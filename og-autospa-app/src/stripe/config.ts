import { loadStripe, type Stripe } from '@stripe/stripe-js'

/**
 * Publishable key only — secret key stays on the server.
 * Set VITE_STRIPE_PUBLISHABLE_KEY in `.env` (see `.env.example`).
 */
export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() || 'pk_test_replace_me'

/** True when a real-looking publishable key is configured. */
export function isStripeConfigured(): boolean {
  return STRIPE_PUBLISHABLE_KEY.startsWith('pk_') && !STRIPE_PUBLISHABLE_KEY.includes('replace')
}

let stripePromise: Promise<Stripe | null> | null = null

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = isStripeConfigured()
      ? loadStripe(STRIPE_PUBLISHABLE_KEY)
      : Promise.resolve(null)
  }
  return stripePromise
}
