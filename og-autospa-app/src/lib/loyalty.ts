import { LOYALTY } from '../data/config'
import type { AppState, LoyaltyReward, RewardTier } from '../types'

export function getPointsBalance(state: AppState): number {
  return state.ledger.reduce((sum, entry) => sum + entry.delta, 0)
}

/** Points inside the current cycle (0 → cycleMax), then meter resets. */
export function getCyclePoints(state: AppState): number {
  const balance = getPointsBalance(state)
  const mod = balance % LOYALTY.cycleMax
  // Exact multiples count as a full bar until celebration/reset UX advances
  return balance > 0 && mod === 0 ? LOYALTY.cycleMax : mod
}

export function getCycleIndex(state: AppState): number {
  const balance = getPointsBalance(state)
  if (balance === 0) return 0
  return Math.floor((balance - 1) / LOYALTY.cycleMax)
}

export function getLadderProgress(state: AppState): {
  balance: number
  cyclePoints: number
  cycleIndex: number
  fillPercent: number
  unlockedInCycle: LoyaltyReward[]
  next?: LoyaltyReward
} {
  const balance = getPointsBalance(state)
  const cyclePoints = getCyclePoints(state)
  const cycleIndex = getCycleIndex(state)
  const unlockedInCycle = LOYALTY.rewards.filter((reward) => cyclePoints >= reward.cost)
  const next = LOYALTY.rewards.find((reward) => cyclePoints < reward.cost)

  return {
    balance,
    cyclePoints,
    cycleIndex,
    fillPercent: Math.min(100, (cyclePoints / LOYALTY.cycleMax) * 100),
    unlockedInCycle,
    next,
  }
}

export function celebrationKey(tier: RewardTier, cycleIndex: number): string {
  return `${cycleIndex}:${tier}`
}

export function getNewlyHitTiers(state: AppState): LoyaltyReward[] {
  const { cyclePoints, cycleIndex } = getLadderProgress(state)
  return LOYALTY.rewards.filter((reward) => {
    if (cyclePoints < reward.cost) return false
    return !state.celebratedTierKeys.includes(celebrationKey(reward.id, cycleIndex))
  })
}

export function describeRewardChoice(tier: RewardTier): string {
  return LOYALTY.rewards.find((item) => item.id === tier)?.name ?? tier
}

export const REWARD_THRESHOLDS = LOYALTY.rewards.map((r) => ({
  id: r.id,
  points: r.cost,
  name: r.name,
  icon: r.icon,
}))
