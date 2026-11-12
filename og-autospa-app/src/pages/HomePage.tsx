import { useState } from 'react'
import { BUSINESS, POPULAR_SERVICE_IDS, SERVICES } from '../data/config'
import { BookingPanel } from '../components/BookingPanel'
import { LoyaltyMeter } from '../components/LoyaltyMeter'
import { money } from '../lib/format'
import type { ServiceId } from '../types'

export function HomePage() {
  const popular = POPULAR_SERVICE_IDS.map((id) => SERVICES.find((s) => s.id === id)!).filter(Boolean)
  const [bookingService, setBookingService] = useState<ServiceId | null>(null)

  return (
    <div className="page page-home">
      <header className="page-hero">
        <p className="eyebrow">Who we are</p>
        <h1>{BUSINESS.name}</h1>
        <p className="lead">{BUSINESS.whatWeDo}</p>
        <p className="muted">{BUSINESS.whatWeBring}</p>
      </header>

      <section className="mission-pin" aria-labelledby="mission-title">
        <p className="eyebrow">Mission</p>
        <h2 id="mission-title">Pinned for the owner</h2>
        <blockquote>
          <p>{BUSINESS.missionStatement}</p>
        </blockquote>
        <p className="note">Reminder: replace this placeholder with your real mission statement in <code>src/data/config.ts</code>.</p>
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
          <BookingPanel initialServiceId={bookingService} />
        </section>
      )}
    </div>
  )
}
