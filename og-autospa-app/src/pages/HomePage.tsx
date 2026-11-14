import { useState } from 'react'
import { BUSINESS, POPULAR_SERVICE_IDS, SERVICES } from '../data/config'
import { BookingPanel } from '../components/BookingPanel'
import { LoyaltyMeter } from '../components/LoyaltyMeter'
import { money } from '../lib/format'
import type { ServiceId } from '../types'

export function HomePage() {
  const popular = POPULAR_SERVICE_IDS.map((id) => SERVICES.find((s) => s.id === id)!).filter(Boolean)
  const [bookingService, setBookingService] = useState<ServiceId | null>(null)
  const [missionOpen, setMissionOpen] = useState(false)

  return (
    <div className="page page-home">
      <header className="page-hero">
        <p className="eyebrow">Who we are</p>
        <h1>{BUSINESS.name}</h1>
        <p className="lead">{BUSINESS.whatWeDo}</p>
        <p className="muted">{BUSINESS.whatWeBring}</p>
        <p>
          <a className="btn btn-primary" href={BUSINESS.bookingUrl} target="_blank" rel="noreferrer noopener">
            Book on Acuity
          </a>
        </p>
      </header>

      <section className="mission-pin" aria-labelledby="mission-title">
        <p className="eyebrow">Our mission</p>
        <h2 id="mission-title">{BUSINESS.name}</h2>
        <div className={missionOpen ? 'mission-pin__body is-open' : 'mission-pin__body'}>
          {BUSINESS.missionParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="mission-pin__close">{BUSINESS.missionClose}</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost mission-pin__more"
          aria-expanded={missionOpen}
          onClick={() => setMissionOpen((open) => !open)}
        >
          {missionOpen ? 'Show less' : 'Click for more'}
        </button>
      </section>

      <LoyaltyMeter />

      <section aria-labelledby="popular-title">
        <div className="section-head">
          <p className="eyebrow">Most popular</p>
          <h2 id="popular-title">Wash · Interior · Polish</h2>
        </div>
        <div className="popular-grid">
          {popular.map((service) => (
            <article key={service.id} className="popular-card">
              <p className="eyebrow">{service.badge}</p>
              <h3>{service.name}</h3>
              <p className="muted">{service.description}</p>
              <p>
                From <strong>{money(service.prices.sedan)}</strong>
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setBookingService(service.id)}
              >
                Quick book
              </button>
            </article>
          ))}
        </div>
      </section>

      {bookingService && (
        <section className="booking-sheet" aria-labelledby="book-title">
          <div className="section-head">
            <h2 id="book-title">Book a service</h2>
            <button type="button" className="btn btn-ghost" onClick={() => setBookingService(null)}>
              Close
            </button>
          </div>
          <p>
            <a className="btn btn-primary" href={BUSINESS.bookingUrl} target="_blank" rel="noreferrer noopener">
              Book on Acuity
            </a>
          </p>
          <BookingPanel initialServiceId={bookingService} />
        </section>
      )}
    </div>
  )
}
