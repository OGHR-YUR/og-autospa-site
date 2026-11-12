import { useState } from 'react'
import { BUSINESS, LOYALTY } from '../data/config'
import { useAppStore } from '../data/store'

type Platform = 'google' | 'facebook' | 'yelp'

const PLATFORMS: {
  id: Platform
  label: string
  href: string
  ready: boolean
}[] = [
  { id: 'google', label: 'Google', href: BUSINESS.googleReviewUrl, ready: true },
  { id: 'facebook', label: 'Facebook', href: BUSINESS.facebookReviewUrl, ready: true },
  {
    id: 'yelp',
    label: 'Yelp',
    href: BUSINESS.yelpReviewUrl || '#',
    ready: Boolean(BUSINESS.yelpReviewUrl),
  },
]

export function ReviewsPage() {
  const { grantReviewPoints } = useAppStore()
  const [stars, setStars] = useState(5)
  const [platform, setPlatform] = useState<Platform>('google')
  const [message, setMessage] = useState<string | null>(null)

  function submit() {
    const target = PLATFORMS.find((p) => p.id === platform)
    if (!target?.ready) {
      setMessage('Yelp isn’t set up yet — slot is ready when you add a URL.')
      return
    }
    grantReviewPoints()
    setMessage(`Thanks! +${LOYALTY.pointsInAppReview} points stub. Opening ${target.label}…`)
    window.open(target.href, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page page-reviews">
      <header className="page-hero">
        <p className="eyebrow">Feedback</p>
        <h1>Reviews</h1>
        <p className="lead">
          Pick a star rating, choose where to post, and we’ll send you to Google, Facebook, or Yelp.
          In-app stars then redirect — simpler and less bug-prone than a native review SDK.
        </p>
      </header>

      <section className="review-flow">
        <p className="eyebrow">Your rating</p>
        <div className="star-row" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`star-btn${n <= stars ? ' is-on' : ''}`}
              onClick={() => setStars(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>

        <p className="eyebrow">Post to</p>
        <div className="chip-row">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn btn-chip${platform === p.id ? ' is-selected' : ''}`}
              onClick={() => setPlatform(p.id)}
            >
              {p.label}
              {!p.ready ? ' (soon)' : ''}
            </button>
          ))}
        </div>

        <button type="button" className="btn btn-primary" onClick={submit}>
          Continue to {PLATFORMS.find((p) => p.id === platform)?.label}
        </button>
        {message && <p className="form-status">{message}</p>}
        <p className="note">
          Point stubs: review +{LOYALTY.pointsInAppReview}, account +{LOYALTY.pointsAccountCreate},
          book +{LOYALTY.pointsBookViaApp}, complete +{LOYALTY.pointsPerService}. Full math later.
        </p>
      </section>
    </div>
  )
}
