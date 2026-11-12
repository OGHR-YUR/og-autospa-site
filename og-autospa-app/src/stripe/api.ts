import { BUSINESS, SERVICES } from '../data/config'
import type { Customer, ServiceId, ServiceJob, StoredPaymentMethod, VehicleSize } from '../types'
import { isStripeConfigured } from './config'

/**
 * Client-side Stripe API façade.
 *
 * In production these calls hit your backend (SetupIntent / PaymentIntent).
 * Until a backend is wired, we return deterministic demo payloads so the UI
 * and charge flow can be exercised end-to-end.
 */

export interface SetupIntentResponse {
  clientSecret: string
  customerId: string
  demo: boolean
}

export interface ChargeResult {
  paymentIntentId: string
  status: 'succeeded' | 'failed' | 'skipped'
  amountCents: number
  message: string
  demo: boolean
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

/** Create a SetupIntent so Elements can collect a card at commercial signup. */
export async function createSetupIntent(customer: Customer): Promise<SetupIntentResponse> {
  if (customer.accountType !== 'commercial') {
    throw new Error('Card-on-file SetupIntents are limited to commercial accounts.')
  }

  // TODO: POST /api/stripe/setup-intent { customerId, email }
  await delay(350)

  const customerId = customer.stripeCustomerId || uid('cus_demo')
  return {
    customerId,
    clientSecret: `seti_demo_${uid('sec')}_secret_demo`,
    demo: !isStripeConfigured(),
  }
}

/**
 * Persist a PaymentMethod on the customer profile after Elements confirms.
 * Demo path fabricates a Visa •••• 4242 when Stripe keys are not set.
 */
export async function attachPaymentMethod(input: {
  customerId: string
  paymentMethodId?: string
}): Promise<StoredPaymentMethod> {
  await delay(250)

  if (input.paymentMethodId && isStripeConfigured()) {
    // TODO: GET /api/stripe/payment-method/:id and persist on customer
    return {
      id: uid('pm_local'),
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: new Date().getFullYear() + 3,
      stripePaymentMethodId: input.paymentMethodId,
    }
  }

  return {
    id: uid('pm_local'),
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: new Date().getFullYear() + 3,
    stripePaymentMethodId: input.paymentMethodId || uid('pm_demo'),
  }
}

/**
 * Charge a commercial customer's card when a maintenance job completes.
 * One-off washes / non-maintenance services always skip.
 */
export async function chargeMaintenanceOnComplete(input: {
  customer: Customer
  job: ServiceJob
  vehicleSize: VehicleSize
}): Promise<ChargeResult> {
  const service = SERVICES.find((item) => item.id === input.job.serviceId)

  if (!service?.autopayEligible || input.job.serviceId !== 'maintenance') {
    return {
      paymentIntentId: '',
      status: 'skipped',
      amountCents: 0,
      message: 'Autopay is limited to maintenance services — one-off washes are not charged on file.',
      demo: true,
    }
  }

  if (input.customer.accountType !== 'commercial') {
    return {
      paymentIntentId: '',
      status: 'skipped',
      amountCents: 0,
      message: 'Stored-card charges apply to commercial accounts only.',
      demo: true,
    }
  }

  if (!input.customer.paymentMethod || !input.customer.stripeCustomerId) {
    return {
      paymentIntentId: '',
      status: 'skipped',
      amountCents: 0,
      message: 'No payment method on file — add a card in Profile to enable autopay.',
      demo: true,
    }
  }

  const amountCents = Math.round(service.prices[input.vehicleSize] * (1 + BUSINESS.taxRate) * 100)

  // TODO: POST /api/stripe/charge-maintenance { customerId, paymentMethodId, jobId, amountCents }
  await delay(400)

  return {
    paymentIntentId: uid('pi_maint'),
    status: 'succeeded',
    amountCents,
    message: `Charged $${(amountCents / 100).toFixed(2)} for Maintenance Detail (tax included).`,
    demo: !isStripeConfigured(),
  }
}

/** Optional tip — booking-time or post-service — via Stripe PaymentIntent. */
export async function chargeTip(input: {
  customer: Customer
  jobId: string
  tipCents: number
}): Promise<ChargeResult> {
  if (input.tipCents <= 0) {
    return {
      paymentIntentId: '',
      status: 'skipped',
      amountCents: 0,
      message: 'No tip selected.',
      demo: true,
    }
  }

  if (!input.customer.paymentMethod) {
    return {
      paymentIntentId: '',
      status: 'failed',
      amountCents: input.tipCents,
      message: 'Add a card on file to tip through Stripe.',
      demo: true,
    }
  }

  // TODO: POST /api/stripe/tip { customerId, paymentMethodId, jobId, tipCents }
  await delay(300)

  return {
    paymentIntentId: uid('pi_tip'),
    status: 'succeeded',
    amountCents: input.tipCents,
    message: `Tip of $${(input.tipCents / 100).toFixed(2)} charged successfully.`,
    demo: !isStripeConfigured(),
  }
}

export function serviceAllowsAutopay(serviceId: ServiceId): boolean {
  return SERVICES.find((s) => s.id === serviceId)?.autopayEligible === true
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
