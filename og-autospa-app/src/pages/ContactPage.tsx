import { BUSINESS } from '../data/config'
import { BrandMark } from '../components/BrandMark'

const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', href: BUSINESS.social.instagram },
  { id: 'tiktok', label: 'TikTok', href: BUSINESS.social.tiktok },
  { id: 'facebook', label: 'Facebook', href: BUSINESS.social.facebook },
  { id: 'youtube', label: 'YouTube', href: BUSINESS.social.youtube },
] as const

export function ContactPage() {
  return (
    <div className="page page-contact">
      <header className="page-hero">
        <p className="eyebrow">Say hello</p>
        <h1>Contact us</h1>
      </header>

      <div className="contact-card">
        <div className="owner-photo" aria-label="Owner photo placeholder">
          <BrandMark size={88} />
          <span>Owner photo</span>
        </div>
        <div>
          <h2>{BUSINESS.ownerName}</h2>
          <p className="muted">{BUSINESS.name}</p>
          <p>
            <a href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phone}</a>
          </p>
          <p>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </div>
      </div>

      <section>
        <h2>What we do</h2>
        <p>{BUSINESS.whatWeDo}</p>
        <h2>What we’re aiming for</h2>
        <p>{BUSINESS.aimingFor}</p>
      </section>

      <section aria-labelledby="social-title">
        <h2 id="social-title">Social</h2>
        <div className="social-row">
          {SOCIAL_LINKS.filter((link) => !link.href.includes('REPLACE')).map((link) => (
            <a
              key={link.id}
              className="btn btn-bubbly"
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
