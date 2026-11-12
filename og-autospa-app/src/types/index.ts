export type VehicleSize = 'sedan' | 'suv' | 'large'

export type AccountType = 'consumer' | 'commercial'

export type ServiceId =
  | 'maintenance'
  | 'exterior'
  | 'full'
  | 'interior'
  | 'deep'
  | 'signature'
  | 'wax'

export type JobStatus =
  | 'scheduled'
  | 'en_route'
  | 'in_progress'
  | 'quality_check'
  | 'completed'
  | 'cancelled'

export type MediaKind = 'photo' | 'video'
export type MediaPhase = 'before' | 'after' | 'showcase'

export type GalleryCategory =
  | 'polishes'
  | 'washes'
  | 'interior_cleanings'
  | 'restorations'
  | 'commercial_vehicles'

/**
 * Loyalty reward ladder thresholds (see LOYALTY in data/config.ts):
 * free_wash(5) → discounted_polish(8) → free_detail(12) → ceramic_discount(18) → polish_and_wax(25)
 * Meter cycles: progress = balance % cycleMax within the current fill.
 */
export type RewardTier =
  | 'free_wash'
  | 'discounted_polish'
  | 'free_detail'
  | 'ceramic_discount'
  | 'polish_and_wax'

export type ChargeStatus = 'pending' | 'succeeded' | 'failed' | 'skipped'

export type ReferralStatus = 'pending' | 'signed_up' | 'completed_service' | 'rewarded'

export interface ServicePackage {
  id: ServiceId
  name: string
  badge?: string
  featured?: boolean
  description: string
  prices: Record<VehicleSize, number>
  points: number
  autopayEligible: boolean
}

export interface Vehicle {
  id: string
  year: number
  make: string
  model: string
  size: VehicleSize
  color: string
  plate?: string
}

export interface StoredPaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  stripePaymentMethodId: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  accountType: AccountType
  companyName?: string
  vehicles: Vehicle[]
  joinedAt: string
  referralCode: string
  stripeCustomerId?: string
  paymentMethod?: StoredPaymentMethod
  /** True after account-created bonus was granted */
  accountBonusGranted?: boolean
}

export interface MediaItem {
  id: string
  customerId?: string
  jobId?: string
  kind: MediaKind
  phase: MediaPhase
  category: GalleryCategory
  src: string
  caption: string
  createdAt: string
}

export interface ServiceJob {
  id: string
  customerId: string
  vehicleId: string
  serviceId: ServiceId
  status: JobStatus
  scheduledAt: string
  startedAt?: string
  completedAt?: string
  notes?: string
  pointsAwarded?: number
  tipCents?: number
  tipStatus?: ChargeStatus
  tipPaymentIntentId?: string
  stripePaymentIntentId?: string
  chargeStatus?: ChargeStatus
  chargeAmountCents?: number
  chargeMessage?: string
  reviewPromptDismissed?: boolean
}

export interface LoyaltyLedgerEntry {
  id: string
  customerId: string
  jobId?: string
  referralId?: string
  delta: number
  reason: string
  createdAt: string
}

export interface LoyaltyReward {
  id: RewardTier
  name: string
  description: string
  cost: number
  kind: 'free' | 'discount'
  discountPercent?: number
  icon: string
}

export interface Referral {
  id: string
  referrerCustomerId: string
  codeUsed: string
  friendName: string
  friendEmail: string
  status: ReferralStatus
  createdAt: string
  signedUpAt?: string
  firstServiceCompletedAt?: string
  pointsAwarded?: number
}

export interface BookingDraft {
  serviceId: ServiceId
  vehicleId: string
  date: string
  time: string
  notes: string
  tipCents: number
}

export interface AppState {
  customer: Customer
  jobs: ServiceJob[]
  media: MediaItem[]
  ledger: LoyaltyLedgerEntry[]
  referrals: Referral[]
  redeemedRewardIds: RewardTier[]
  celebratedTierKeys: string[]
  reviewCount: number
}
