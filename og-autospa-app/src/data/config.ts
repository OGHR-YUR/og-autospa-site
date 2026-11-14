import type { LoyaltyReward, ServiceId, ServicePackage } from '../types'

/** Business config mirrored from the O.G. AutoSpa marketing site. */
export const BUSINESS = {
  name: 'O.G. AutoSpa & Services',
  shortName: 'O.G. AutoSpa',
  ownerName: 'O.G. AutoSpa Owner',
  phone: '(385) 346-8125',
  phoneE164: '+13853468125',
  email: 'o.g.autospa.services@gmail.com',
  area: 'Salt Lake City and the Salt Lake Valley',
  est: '2024',
  taxRate: 0.0745,
  depositPercent: 0.5,
  afterHoursFee: 50,
  shopUrl: 'https://11u81s-f0.myshopify.com',
  bookingUrl: 'https://example.com/booking',
  missionParagraphs: [
    'Our mission goes beyond detailing vehicles and providing services. It’s about building something meaningful, creating opportunities, and leaving behind a legacy for the next generation.',
    'One of our biggest motivations is family, especially our children. Everything we work toward, every sacrifice we make, and every long day we put in is driven by the desire to build a better future and show our children that with hard work, dedication, and determination, anything is possible.',
    'At O.G. AutoSpa & Services, we believe in quality, relationships, and community. We take pride in providing professional detailing and automotive services while building connections with other local businesses, entrepreneurs, and independent service providers.',
    'We believe our communities are stronger when we support one another. Rather than always turning to major corporations, we want to encourage people to shop local, use each other’s services, build partnerships, and keep opportunities and money within our communities.',
    'Our vision is to grow alongside the people around us, create opportunities for others, and prove that success means more when everyone has a chance to benefit.',
    'We’re building more than a business. We’re building a legacy for our family, creating opportunities for our community, and setting an example for the next generation.',
  ],
  missionClose: 'Family Driven. Community Focused. Built on Hard Work.',
  tagline: 'Showroom shine. At your door.',
  whatWeDo:
    'Mobile car detailing that comes to you across Salt Lake City and the Salt Lake Valley — washes, interior cleans, polish & wax, and full details at your driveway.',
  whatWeBring:
    'The van, professional gear, eco-conscious products, and a crew that treats every car like it’s rolling into a showroom.',
  aimingFor:
    'Reliable mobile care for everyday drivers and commercial fleets — clear prices, honest work, and a loyalty program that rewards coming back.',
  googleReviewUrl: 'https://g.page/r/REPLACE-WITH-GOOGLE-BUSINESS-REVIEW',
  facebookReviewUrl: 'https://www.facebook.com/REPLACE-OG-AUTOSPA/reviews',
  /** Yelp not set up yet — slot reserved */
  yelpReviewUrl: '',
  social: {
    instagram: 'https://instagram.com/REPLACE-OG-AUTOSPA',
    tiktok: 'https://tiktok.com/@REPLACE-OG-AUTOSPA',
    facebook: 'https://facebook.com/REPLACE-OG-AUTOSPA',
    youtube: 'https://youtube.com/@REPLACE-OG-AUTOSPA',
  },
} as const

export const SIZE_TITLES = {
  sedan: 'Sedan / Coupe',
  suv: 'SUV / Truck',
  large: 'Large SUV / Van',
} as const

/** Home tab quick-book trio: wash, interior cleaning, polish */
export const POPULAR_SERVICE_IDS: ServiceId[] = ['exterior', 'interior', 'wax']

export const SERVICES: ServicePackage[] = [
  {
    id: 'maintenance',
    name: 'Maintenance Detail',
    badge: 'Autopay eligible',
    featured: true,
    description:
      'Keep a clean car looking sharp between full details. Commercial accounts can store a card and auto-charge when maintenance is completed.',
    prices: { sedan: 109, suv: 139, large: 169 },
    points: 1,
    autopayEligible: true,
  },
  {
    id: 'exterior',
    name: 'Exterior Wash',
    badge: 'Wash',
    featured: true,
    description: 'Hand wash, wheels, and finish protection for the outside.',
    prices: { sedan: 89, suv: 109, large: 129 },
    points: 1,
    autopayEligible: false,
  },
  {
    id: 'full',
    name: 'Full Detail',
    badge: 'Most popular',
    featured: true,
    description: 'Interior and exterior reset — the complete driveway detail.',
    prices: { sedan: 259, suv: 319, large: 389 },
    points: 1,
    autopayEligible: false,
  },
  {
    id: 'interior',
    name: 'Interior Cleaning',
    badge: 'Interior',
    featured: true,
    description: 'Vacuum, wipe-down, surfaces, and glass for a fresh cabin.',
    prices: { sedan: 169, suv: 219, large: 259 },
    points: 1,
    autopayEligible: false,
  },
  {
    id: 'deep',
    name: 'Deep Interior',
    badge: 'Stain removal',
    featured: false,
    description: 'Extraction, stain treatment, and a thorough cabin restore.',
    prices: { sedan: 229, suv: 279, large: 329 },
    points: 1,
    autopayEligible: false,
  },
  {
    id: 'signature',
    name: 'Signature Detail',
    badge: 'Luxury finish',
    featured: false,
    description: 'Our top-tier detail with polish-ready exterior and premium interior.',
    prices: { sedan: 329, suv: 389, large: 449 },
    points: 1,
    autopayEligible: false,
  },
  {
    id: 'wax',
    name: 'Polish & Wax',
    badge: 'Polish',
    featured: true,
    description: 'Paint correction light + wax for lasting shine.',
    prices: { sedan: 179, suv: 229, large: 279 },
    points: 1,
    autopayEligible: false,
  },
]

/**
 * Point stubs — full value math / giveaway thresholds will be refined later.
 * Current defaults for scaffolding only:
 *   account create  → 5 pts
 *   in-app review   → 2 pts
 *   book via app    → 1 pt
 *   complete job    → 1 pt (service points)
 *   referral bonus  → 3 pts (friend completes first service)
 *
 * Reward ladder (one cycle = 25 pts, then meter resets and repeats):
 *   5  free wash | 8 discounted polish | 12 free detail | 18 ceramic discount | 25 polish & wax
 */
export const LOYALTY = {
  pointsPerService: 1,
  pointsAccountCreate: 5,
  pointsInAppReview: 2,
  pointsBookViaApp: 1,
  referralBonusPoints: 3,
  /** Top ladder cost — meter fills 0→cycleMax then resets for the next cycle */
  cycleMax: 25,
  rewards: [
    {
      id: 'free_wash',
      name: 'Free Wash',
      description: '5 points — complimentary Exterior Wash.',
      cost: 5,
      kind: 'free',
      icon: '🚿',
    },
    {
      id: 'discounted_polish',
      name: 'Discounted Polish',
      description: '8 points — 40% off Polish & Wax.',
      cost: 8,
      kind: 'discount',
      discountPercent: 40,
      icon: '✨',
    },
    {
      id: 'free_detail',
      name: 'Free Detail',
      description: '12 points — complimentary Full Detail.',
      cost: 12,
      kind: 'free',
      icon: '🏆',
    },
    {
      id: 'ceramic_discount',
      name: 'Ceramic Discount',
      description: '18 points — 25% off ceramic coat add-on.',
      cost: 18,
      kind: 'discount',
      discountPercent: 25,
      icon: '🛡️',
    },
    {
      id: 'polish_and_wax',
      name: 'Polish & Wax',
      description: '25 points — top tier: complimentary Polish & Wax.',
      cost: 25,
      kind: 'free',
      icon: '💎',
    },
  ] satisfies LoyaltyReward[],
}

export const TIP_PRESETS_CENTS = [0, 500, 1000, 1500, 2000] as const

export const JOB_STATUS_STEPS = [
  { id: 'scheduled', label: 'Booked' },
  { id: 'en_route', label: 'En route' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'quality_check', label: 'Quality check' },
  { id: 'completed', label: 'Done' },
] as const

export const BOOKING_TIME_SLOTS = [
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
] as const

export const GALLERY_CATEGORIES = [
  { id: 'washes', label: 'Washes' },
  { id: 'interior_cleanings', label: 'Interior cleanings' },
  { id: 'polishes', label: 'Polishes' },
  { id: 'restorations', label: 'Restorations' },
  { id: 'commercial_vehicles', label: 'Commercial vehicles' },
] as const
