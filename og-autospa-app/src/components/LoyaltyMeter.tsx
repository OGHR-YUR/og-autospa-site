import { useEffect, useState } from 'react'
import { LOYALTY } from '../data/config'
import { getLadderProgress, getNewlyHitTiers } from '../lib/loyalty'
import { useAppStore } from '../data/store'

export function LoyaltyMeter() {
  const { state, markTierCelebrated } = useAppStore()
  const progress = getLadderProgress(state)
  const [celebration, setCelebration] = useState<{ title: string; body: string } | null>(null)

  useEffect(() => {
    const newly = getNewlyHitTiers(state)
    if (!newly.length || celebration) return
    const reward = newly[0]
    setCelebration({
      title: `You've won ${reward.name}!`,
      body: `You've won ${reward.name.toLowerCase()} for being such a loyal customer. Keep filling the meter — it resets after each full cycle.`,
    })
    markTierCelebrated(reward.id, progress.cycleIndex)
  }, [state, celebration, markTierCelebrated, progress.cycleIndex])

  return (
    <section className="loyalty-meter" aria-labelledby="loyalty-meter-title">
      <div className="loyalty-meter__head">
        <h2 id="loyalty-meter-title">Loyalty meter</h2>
        <p>
          {progress.cyclePoints} / {LOYALTY.cycleMax} pts this cycle
          {progress.cycleIndex > 0 ? ` · Cycle ${progress.cycleIndex + 1}` : ''}
        </p>
      </div>

      <div className="loyalty-meter__track" role="img" aria-label={`Loyalty progress ${progress.fillPercent}%`}>
        <div className="loyalty-meter__fill" style={{ width: `${progress.fillPercent}%` }} />
        {LOYALTY.rewards.map((reward) => {
          const left = (reward.cost / LOYALTY.cycleMax) * 100
          const hit = progress.cyclePoints >= reward.cost
          return (
            <div
              key={reward.id}
              className={`loyalty-meter__marker${hit ? ' is-hit' : ''}`}
              style={{ left: `${left}%` }}
            >
              <span className="loyalty-meter__tick" />
              <span className="loyalty-meter__marker-label">
                <span aria-hidden="true">{reward.icon}</span>
                {reward.name}
              </span>
            </div>
          )
        })}
      </div>

      {celebration && (
        <div className="celebrate" role="alertdialog" aria-modal="true" aria-labelledby="celebrate-title">
          <div className="celebrate__card">
            <p className="celebrate__eyebrow">Reward unlocked</p>
            <h3 id="celebrate-title">{celebration.title}</h3>
            <p>{celebration.body}</p>
            <button type="button" className="btn btn-primary" onClick={() => setCelebration(null)}>
              Nice!
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
