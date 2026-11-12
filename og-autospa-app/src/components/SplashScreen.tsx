import { useEffect, useRef, useState } from 'react'
import { BUSINESS } from '../data/config'
import { BrandMark } from './BrandMark'

const AUTO_DISMISS_MS = 2600
const CHIME_SRC = '/sounds/splash-chime.wav'

interface SplashScreenProps {
  onDone: () => void
}

/**
 * Apple Arcade–style launch splash:
 * centered logo + business name, short bundled chime, tap or auto-dismiss.
 */
export function SplashScreen({ onDone }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)
  const doneRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setExiting(true)
    window.setTimeout(onDone, 480)
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))

    const audio = new Audio(CHIME_SRC)
    audio.preload = 'auto'
    audio.volume = 0.7
    audioRef.current = audio

    const tryPlay = () => {
      void audio.play().catch(() => {
        // Autoplay may be blocked until a gesture; tap-to-dismiss still works.
      })
    }

    // Slight delay so the logo fade-in and chime land together
    const chimeTimer = window.setTimeout(tryPlay, 180)
    const dismissTimer = window.setTimeout(finish, AUTO_DISMISS_MS)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(chimeTimer)
      window.clearTimeout(dismissTimer)
      audio.pause()
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only splash lifecycle
  }, [])

  const handleActivate = () => {
    // User gesture unlocks audio if autoplay was blocked
    const audio = audioRef.current
    if (audio && audio.paused) {
      void audio.play().catch(() => undefined)
    }
    finish()
  }

  return (
    <div
      className={`splash ${visible ? 'splash--in' : ''} ${exiting ? 'splash--out' : ''}`}
      role="dialog"
      aria-label={`${BUSINESS.shortName} launch screen`}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleActivate()
        }
      }}
      tabIndex={0}
    >
      <div className="splash__glow" aria-hidden="true" />
      <div className="splash__stage">
        <div className="splash__logo-wrap">
          <BrandMark size={128} className="splash__logo" />
        </div>
        <p className="splash__eyebrow">EST. {BUSINESS.est}</p>
        <h1 className="splash__title">{BUSINESS.shortName}</h1>
        <p className="splash__sub">&amp; Services · Mobile Detailing</p>
        <p className="splash__hint">Tap to continue</p>
      </div>
    </div>
  )
}
