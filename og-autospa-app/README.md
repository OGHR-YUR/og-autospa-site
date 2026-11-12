# O.G. AutoSpa — Customer App

Vite + React + TypeScript customer app for **O.G. AutoSpa & Services**, scaffolded from the marketing site brand and service list.

## Run

```bash
cd og-autospa-app
npm install
npm run dev
```

Optional: copy `.env.example` → `.env` and set `VITE_STRIPE_PUBLISHABLE_KEY`.

## What’s included

- **Splash** — Apple Arcade–style launch with logo, business name, and bundled chime (`public/sounds/splash-chime.wav`)
- **Bottom tabs** — Home · Gallery · Contact · Reviews
- **Home** — about copy, pinned mission placeholder, popular services + quick book, loyalty meter
- **Gallery** — category filters (Instagram auto-import not available; manual upload later)
- **Contact** — phone/email/owner placeholder + social links
- **Reviews** — in-app stars → Google / Facebook / Yelp (Yelp slot empty)
- **Loyalty stubs** — account / review / book / complete points; horizontal orange meter with tier markers
- **Stripe façade** — commercial maintenance autopay + optional tips (`src/stripe/`)

## Repo location

Scaffold lives at `og-autospa-app/` inside [og-autospa-site](https://github.com/OGHR-YUR/og-autospa-site) until a standalone `og-autospa-app` GitHub repo is created (token here cannot create new repos).
