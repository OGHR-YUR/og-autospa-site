# O.G. AutoSpa & Services — Website

Static website for **O.G. AutoSpa & Services**, mobile car detailing in Salt Lake City, UT.
Plain HTML + CSS + JavaScript. No build step, no frameworks, no npm. The only outside resource is Google Fonts (Bebas Neue + Inter).

---

## 🤖 Prompt for GitHub Copilot (paste this)

> I have a finished static website in this folder (plain HTML/CSS/JS, no build step) for my mobile detailing business, O.G. AutoSpa & Services. Please:
>
> 1. Create a new GitHub repository called `og-autospa-site` from these files (keep the folder structure exactly as is, with `index.html` at the repo root) and push it to the `main` branch.
> 2. Deploy it as a static site. Use **GitHub Pages** (Settings → Pages → Deploy from a branch → `main` / root). If I say I want **Render** instead, create a Render **Static Site** with no build command and publish directory `.`.
> 3. Don't change the design or add frameworks. All business info lives in `js/config.js`; prices are in the `SERVICES` list there.
> 4. Then help me fill in the placeholders. Ask me for each value and update the files:
>    - `BOOKING_URL` in `js/config.js` (my Acuity Scheduling link)
>    - `FORM_ENDPOINT` in `js/config.js` (Formspree form URL, or leave as is to use email)
>    - `SOCIAL` links in `js/config.js` (Instagram, TikTok, Facebook, Google Business)
>    - My domain: replace every `REPLACE-WITH-YOUR-DOMAIN.com` (in all `.html` files, `robots.txt` and `sitemap.xml`). If I use a custom domain on GitHub Pages, add a `CNAME` file containing it.
>    - Photos: when I give you image files, put them in `assets/images/` and list them under `PHOTOS` in `js/config.js`.
> 5. After each change, commit with a clear message and confirm the live site updated.

---

## Folder structure

```
og-autospa-site/
├── index.html          Home: hero + Book Now, services, how it works, area & hours, why us, reviews (placeholder), merch, FAQ
├── services.html       Full price list (with and without tax), sizes, add-ons, quote-only, estimator, booking policy
├── book.html           Embedded Acuity booking calendar (+ "open in new tab" fallback)
├── gallery.html        Photo grid (placeholders until you add photos)
├── contact.html        Phone, email, service area, hours, contact/quote form
├── shop.html           Merch page, links out to the Shopify store
├── 404.html            "Wrong turn" page for broken links
├── css/styles.css      All styling
├── js/config.js        ⭐ EDIT THIS: links, phone, email, prices, hours, photos
├── js/main.js          Behavior (renders prices, booking embed, form, menu). Normally no edits needed.
├── assets/             Logo, favicon, share image, photos (see assets/README.md)
├── robots.txt
├── sitemap.xml
└── README.md
```

## Placeholders to fill in

| Where | Placeholder | Put in |
|---|---|---|
| `js/config.js` | `BOOKING_URL: "https://REPLACE-WITH-ACUITY-LINK"` | Your Acuity scheduling page link. Until set, "Book Now" goes to `book.html`, which shows "call or text" instead of a calendar. |
| `js/config.js` | `FORM_ENDPOINT` (`…/f/REPLACE-WITH-FORM-ID`) | A free Formspree form URL. Until set, the contact form opens the visitor's email app addressed to you. |
| `js/config.js` | `SOCIAL` (`REPLACE`) | Your social links. Any left as `REPLACE` or `""` are hidden automatically. |
| all `.html`, `robots.txt`, `sitemap.xml` | `https://REPLACE-WITH-YOUR-DOMAIN.com` | Your real domain (used for Google/SEO and share previews). Find-and-replace across the repo. |
| `js/config.js` → `PHOTOS` | empty | Hero before/after, van, gallery photos (see `assets/README.md`). |
| `index.html` reviews section | "Customer review placeholder" cards | **Real** reviews only, with the customer's permission. |
| `services.html` | `<!-- REPLACE -->` comments | Optional: extra add-ons, vehicle size definitions. |

Already filled in: phone `(385) 346-8125`, email `o.g.autospa.services@gmail.com`, service area, hours, 7.45% tax, $50 after-hours fee, 50% deposit, Shopify store `https://11u81s-f0.myshopify.com`.

## How to edit

**Prices / packages:** open `js/config.js`, find `SERVICES`. Each package has `prices: { sedan, suv, large }` (pre-tax). Change a number, save, done; the home page cards, the price table, the with-tax totals and the estimator all update. `featured: true` shows a package on the home page; `badge` adds a little label.

**Tax rate:** `TAX_RATE: 0.0745` (7.45%). **After-hours fee:** `AFTER_HOURS_FEE`. **Deposit:** `DEPOSIT_PERCENT`.

**Hours:** `HOURS` in `js/config.js`. (Also update `openingHoursSpecification` in the JSON-LD block in `index.html` and `contact.html` so Google sees the same hours, and the FAQ answer in `index.html`.)

**Phone / email:** `PHONE`, `PHONE_E164` (format `+13853468125`) and `EMAIL`. The HTML also contains them as no-JavaScript fallbacks; find-and-replace if they ever change.

**Shop link:** `SHOP_URL`. Change it to your custom shop domain later if you add one.

**Booking embed (Acuity):** In Acuity go to *Scheduling Page → Share / Embed* (or *Business Settings → Scheduling Page*), copy the direct link (looks like `https://app.acuityscheduling.com/schedule.php?owner=12345678` or your custom `…as.me` link) and paste it into `BOOKING_URL`. `book.html` puts it in an iframe; Book Now buttons link straight to it.

## Deploy

### Option A: GitHub Pages (free)
1. Create a repo and upload all files (keep `index.html` at the root).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`** → Save.
3. Site goes live at `https://<username>.github.io/<repo>/` in a minute or two.
4. Custom domain: Settings → Pages → Custom domain → enter it (this creates a `CNAME` file), then add the DNS records GitHub shows (A records to GitHub's IPs or a CNAME to `<username>.github.io`). Tick **Enforce HTTPS**.
5. `404.html` is used automatically by GitHub Pages.

### Option B: Render (free static site)
1. Push the files to a GitHub repo.
2. On render.com: **New → Static Site** → connect the repo.
3. **Build command:** leave empty. **Publish directory:** `.`
4. Create. Add a custom domain under *Settings → Custom Domains*.
5. Render serves `404.html` for missing pages; if it doesn't, add a Rewrite rule `/*` → `/404.html` (status 404) under *Redirects/Rewrites*.

After deploying with your real domain:
- Replace `REPLACE-WITH-YOUR-DOMAIN.com` everywhere.
- Submit `https://yourdomain.com/sitemap.xml` in Google Search Console.
- Put your website link on your Google Business Profile, Instagram bio and Acuity.
- If you use Apple Pay in the Acuity embed with Stripe, register the domain in Stripe (Settings → Payment methods → Apple Pay domains).

## Notes
- **SEO:** each page has its own title, description, Open Graph and Twitter tags. `index.html` and `contact.html` include LocalBusiness JSON-LD (`AutoWash` / `AutomotiveBusiness`) with phone, email, hours and service area. No street address, ratings or reviews are included on purpose; add a real `aggregateRating` only once you have real reviews.
- **Accessibility:** semantic landmarks, skip link, visible focus outlines, labelled form fields, alt text, reduced-motion support, AA-contrast colors.
- **No JavaScript?** The pages still read fine; prices and the booking calendar need JavaScript.
- **Merch art:** the back print shows real car models. Brand likenesses (e.g. Ferrari) can draw takedown requests on marketplaces; consider a generic-car version for public sale.
- `404.html` uses relative links, so on a GitHub Pages *project* URL (`/repo/`) it works best once you're on a custom domain at the root.

File name: robots.txt
Language: 
User-agent: *
Allow: /

# REPLACE the domain below with your real domain
Sitemap: https://REPLACE-WITH-YOUR-DOMAIN.com/sitemap.xml

File name: sitemap.xml
Language: 
<?xml version="1.0" encoding="UTF-8"?>
<!-- REPLACE "REPLACE-WITH-YOUR-DOMAIN.com" with your real domain -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://REPLACE-WITH-YOUR-DOMAIN.com/</loc><lastmod>2026-11-03</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://REPLACE-WITH-YOUR-DOMAIN.com/services.html</loc><lastmod>2026-11-03</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://REPLACE-WITH-YOUR-DOMAIN.com/book.html</loc><lastmod>2026-11-03</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://REPLACE-WITH-YOUR-DOMAIN.com/gallery.html</loc><lastmod>2026-11-03</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://REPLACE-WITH-YOUR-DOMAIN.com/contact.html</loc><lastmod>2026-11-03</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://REPLACE-WITH-YOUR-DOMAIN.com/shop.html</loc><lastmod>2026-11-03</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>



---

## Customer app scaffold

The customer-facing app lives in [`og-autospa-app/`](./og-autospa-app/). See that folder’s README for run instructions (Vite + React). Intended eventual standalone repo name: `og-autospa-app`.
