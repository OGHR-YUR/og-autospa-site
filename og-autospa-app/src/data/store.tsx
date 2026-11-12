import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { LOYALTY, SERVICES } from './config'
import { SEED_STATE } from './seed'
import { chargeMaintenanceOnComplete, chargeTip } from '../stripe/api'
import { celebrationKey } from '../lib/loyalty'
import type {
  AppState,
  BookingDraft,
  RewardTier,
  ServiceJob,
  StoredPaymentMethod,
} from '../types'

const STORAGE_KEY = 'og-autospa-app-state-v2'

interface AppStore {
  state: AppState
  resetDemo: () => void
  savePaymentMethod: (stripeCustomerId: string, method: StoredPaymentMethod) => void
  bookService: (draft: BookingDraft) => Promise<ServiceJob>
  completeJob: (jobId: string) => Promise<ServiceJob | undefined>
  addTipToJob: (jobId: string, tipCents: number) => Promise<ServiceJob | undefined>
  dismissReviewPrompt: (jobId: string) => void
  markTierCelebrated: (tier: RewardTier, cycleIndex: number) => void
  redeemReward: (tier: RewardTier) => void
  grantReviewPoints: () => void
}

const StoreContext = createContext<AppStore | null>(null)

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* ignore */
  }
  return structuredClone(SEED_STATE)
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const resetDemo = useCallback(() => {
    const next = structuredClone(SEED_STATE)
    setState(next)
  }, [])

  const savePaymentMethod = useCallback((stripeCustomerId: string, method: StoredPaymentMethod) => {
    setState((prev) => ({
      ...prev,
      customer: { ...prev.customer, stripeCustomerId, paymentMethod: method },
    }))
  }, [])

  const bookService = useCallback(
    async (draft: BookingDraft) => {
      const scheduledAt = new Date(`${draft.date}T${draft.time}:00`).toISOString()
      const job: ServiceJob = {
        id: `job_${Math.random().toString(36).slice(2, 9)}`,
        customerId: state.customer.id,
        vehicleId: draft.vehicleId,
        serviceId: draft.serviceId,
        status: 'scheduled',
        scheduledAt,
        notes: draft.notes || undefined,
        tipCents: draft.tipCents > 0 ? draft.tipCents : undefined,
        tipStatus: draft.tipCents > 0 ? 'pending' : undefined,
      }

      if (draft.tipCents > 0) {
        const tipResult = await chargeTip({
          customer: state.customer,
          jobId: job.id,
          tipCents: draft.tipCents,
        })
        job.tipStatus = tipResult.status
        job.tipPaymentIntentId = tipResult.paymentIntentId || undefined
      }

      const bookLedger = {
        id: `led_${Math.random().toString(36).slice(2, 9)}`,
        customerId: state.customer.id,
        jobId: job.id,
        delta: LOYALTY.pointsBookViaApp,
        reason: 'Booked service in app',
        createdAt: new Date().toISOString(),
      }

      setState((prev) => ({
        ...prev,
        jobs: [job, ...prev.jobs],
        ledger: [bookLedger, ...prev.ledger],
      }))
      return job
    },
    [state.customer],
  )

  const completeJob = useCallback(
    async (jobId: string) => {
      const current = state.jobs.find((j) => j.id === jobId)
      if (!current || current.status === 'completed') return current

      const vehicle = state.customer.vehicles.find((v) => v.id === current.vehicleId)
      const service = SERVICES.find((s) => s.id === current.serviceId)
      const charge = await chargeMaintenanceOnComplete({
        customer: state.customer,
        job: current,
        vehicleSize: vehicle?.size ?? 'sedan',
      })

      const completed: ServiceJob = {
        ...current,
        status: 'completed',
        completedAt: new Date().toISOString(),
        startedAt: current.startedAt || new Date().toISOString(),
        pointsAwarded: service?.points ?? LOYALTY.pointsPerService,
        stripePaymentIntentId: charge.paymentIntentId || undefined,
        chargeStatus: charge.status,
        chargeAmountCents: charge.amountCents || undefined,
        chargeMessage: charge.message,
        reviewPromptDismissed: false,
      }

      const ledgerEntry = {
        id: `led_${Math.random().toString(36).slice(2, 9)}`,
        customerId: state.customer.id,
        jobId: completed.id,
        delta: completed.pointsAwarded ?? 1,
        reason: `Completed ${service?.name ?? 'service'}`,
        createdAt: completed.completedAt!,
      }

      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === jobId ? completed : j)),
        ledger: [ledgerEntry, ...prev.ledger],
      }))
      return completed
    },
    [state],
  )

  const addTipToJob = useCallback(
    async (jobId: string, tipCents: number) => {
      const job = state.jobs.find((j) => j.id === jobId)
      if (!job) return undefined
      const tipResult = await chargeTip({
        customer: state.customer,
        jobId,
        tipCents,
      })
      const updated: ServiceJob = {
        ...job,
        tipCents,
        tipStatus: tipResult.status,
        tipPaymentIntentId: tipResult.paymentIntentId || undefined,
      }
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === jobId ? updated : j)),
      }))
      return updated
    },
    [state.customer, state.jobs],
  )

  const dismissReviewPrompt = useCallback((jobId: string) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => (j.id === jobId ? { ...j, reviewPromptDismissed: true } : j)),
    }))
  }, [])

  const markTierCelebrated = useCallback((tier: RewardTier, cycleIndex: number) => {
    const key = celebrationKey(tier, cycleIndex)
    setState((prev) =>
      prev.celebratedTierKeys.includes(key)
        ? prev
        : { ...prev, celebratedTierKeys: [...prev.celebratedTierKeys, key] },
    )
  }, [])

  const redeemReward = useCallback((tier: RewardTier) => {
    setState((prev) => ({
      ...prev,
      redeemedRewardIds: prev.redeemedRewardIds.includes(tier)
        ? prev.redeemedRewardIds
        : [...prev.redeemedRewardIds, tier],
    }))
  }, [])

  const grantReviewPoints = useCallback(() => {
    setState((prev) => ({
      ...prev,
      reviewCount: prev.reviewCount + 1,
      ledger: [
        {
          id: `led_${Math.random().toString(36).slice(2, 9)}`,
          customerId: prev.customer.id,
          delta: LOYALTY.pointsInAppReview,
          reason: 'Left a review through the app',
          createdAt: new Date().toISOString(),
        },
        ...prev.ledger,
      ],
    }))
  }, [])

  const value = useMemo(
    () => ({
      state,
      resetDemo,
      savePaymentMethod,
      bookService,
      completeJob,
      addTipToJob,
      dismissReviewPrompt,
      markTierCelebrated,
      redeemReward,
      grantReviewPoints,
    }),
    [
      state,
      resetDemo,
      savePaymentMethod,
      bookService,
      completeJob,
      addTipToJob,
      dismissReviewPrompt,
      markTierCelebrated,
      redeemReward,
      grantReviewPoints,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useAppStore(): AppStore {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
