const CONFIG = {
  PHONE: '(385) 346-8125',
  PHONE_E164: '+13853468125',
  EMAIL: 'o.g.autospa.services@gmail.com',
  AREA: 'Salt Lake City and the Salt Lake Valley',
  EST: '2024',
  TAX_RATE: 0.0745,
  DEPOSIT_PERCENT: 0.5,
  AFTER_HOURS_FEE: 50,
  HOURS: [
    { day: 'Wednesday', hours: 'Starts from 12 PM until midnight' },
    { day: 'Thursday – Saturday', hours: 'Starts from 8 AM until midnight' },
    { day: 'Sunday – Tuesday', hours: 'Closed' }
  ],
  BOOKING_URL: 'https://example.com/booking',
  FORM_ENDPOINT: '',
  SHOP_URL: 'https://11u81s-f0.myshopify.com',
  SOCIAL: {
    instagram: 'https://www.instagram.com/oscarguerrero230/',
    tiktok: '',
    facebook: 'https://www.facebook.com/profile.php?id=61574226024258',
    google: ''
  },
  SERVICES: [
    { id: 'maintenance', name: 'Maintenance Detail', badge: 'Best for recent clean', featured: true, prices: { sedan: 109, suv: 139, large: 169 } },
    { id: 'exterior', name: 'Exterior Wash', badge: 'Fast refresh', featured: true, prices: { sedan: 89, suv: 109, large: 129 } },
    { id: 'full', name: 'Full Detail', badge: 'Most popular', featured: true, prices: { sedan: 259, suv: 319, large: 389 } },
    { id: 'interior', name: 'Interior Only', badge: 'Deep clean', featured: true, prices: { sedan: 169, suv: 219, large: 259 } },
    { id: 'deep', name: 'Deep Interior', badge: 'Stain removal', featured: false, prices: { sedan: 229, suv: 279, large: 329 } },
    { id: 'signature', name: 'Signature Detail', badge: 'Luxury finish', featured: false, prices: { sedan: 329, suv: 389, large: 449 } },
    { id: 'wax', name: 'Polish & Wax', badge: 'Gloss boost', featured: false, prices: { sedan: 179, suv: 229, large: 279 } }
  ],
  PHOTOS: {
    gallery: []
  }
};

const SIZE_LABELS = ['sedan', 'suv', 'large'];
const SIZE_TITLES = { sedan: 'Sedan / Coupe', suv: 'SUV / Truck', large: 'Large SUV / Van' };

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function applyConfig() {
  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (key === 'phone') el.textContent = CONFIG.PHONE;
    if (key === 'email') el.textContent = CONFIG.EMAIL;
    if (key === 'area') el.textContent = CONFIG.AREA;
    if (key === 'est') el.textContent = CONFIG.EST;
    if (key === 'tax-rate') el.textContent = (CONFIG.TAX_RATE * 100).toFixed(2) + '%';
    if (key === 'deposit') el.textContent = (CONFIG.DEPOSIT_PERCENT * 100).toFixed(0) + '%';
    if (key === 'after-hours-fee') el.textContent = money(CONFIG.AFTER_HOURS_FEE);
    if (key === 'year') el.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-link="tel"]').forEach(el => {
    el.href = `tel:${CONFIG.PHONE_E164}`;
  });

  document.querySelectorAll('[data-link="email"]').forEach(el => {
    el.href = `mailto:${CONFIG.EMAIL}`;
  });

  document.querySelectorAll('[data-link="book"]').forEach(el => {
    el.href = CONFIG.BOOKING_URL || 'book.html';
  });

  document.querySelectorAll('[data-link="sms"]').forEach(el => {
    el.href = `sms:${CONFIG.PHONE_E164}`;
  });

  document.querySelectorAll('[data-link="shop"]').forEach(el => {
    el.href = CONFIG.SHOP_URL;
  });

  document.querySelectorAll('[data-social]').forEach(el => {
    const key = el.getAttribute('data-social');
    const url = CONFIG.SOCIAL[key];
    if (!url) {
      el.closest('li')?.remove();
      return;
    }
    el.href = url;
  });

  const hoursEl = document.querySelector('[data-hours]');
  if (hoursEl) {
    hoursEl.innerHTML = CONFIG.HOURS.map(item => `<li><span>${item.day}</span><span>${item.hours}</span></li>`).join('');
  }
}

function renderFeaturedServices() {
  const featureRoot = document.querySelector('[data-services="featured"]');
  if (!featureRoot) return;

  const featured = CONFIG.SERVICES.filter(s => s.featured);
  featureRoot.innerHTML = featured.map(service => {
    const sedan = service.prices.sedan;
    const label = service.badge ? `<span class="eyebrow">${service.badge}</span>` : '';
    return `
      <article class="card">
        ${label}
        <h3>${service.name}</h3>
        <p class="muted">Starting at <strong>${money(sedan)}</strong></p>
        <p class="mt-0">Sedan / Coupe from ${money(sedan)} • SUV from ${money(service.prices.suv)} • Large from ${money(service.prices.large)}</p>
        <a class="btn btn-ghost" href="services.html">View details</a>
      </article>
    `;
  }).join('');
}

function renderPriceTable() {
  const root = document.querySelector('[data-price-table]');
  if (!root) return;

  const rows = CONFIG.SERVICES.map(service => {
    const sedan = service.prices.sedan;
    const suv = service.prices.suv;
    const large = service.prices.large;
    const totalSedan = sedan * (1 + CONFIG.TAX_RATE);
    const totalSuv = suv * (1 + CONFIG.TAX_RATE);
    const totalLarge = large * (1 + CONFIG.TAX_RATE);
    return `
      <tr>
        <td><strong>${service.name}</strong>${service.badge ? `<br><small>${service.badge}</small>` : ''}</td>
        <td>${money(sedan)}<br><small class="with-tax">${money(totalSedan)}</small></td>
        <td>${money(suv)}<br><small class="with-tax">${money(totalSuv)}</small></td>
        <td>${money(large)}<br><small class="with-tax">${money(totalLarge)}</small></td>
      </tr>
    `;
  }).join('');

  root.innerHTML = `
    <table class="price-table">
      <thead>
        <tr>
          <th>Package</th>
          <th>Sedan / Coupe</th>
          <th>SUV / Truck</th>
          <th>Large SUV / Van</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function populateEstimator() {
  const serviceSelect = document.getElementById('est-service');
  const sizeSelect = document.getElementById('est-size');
  const lateCheckbox = document.getElementById('est-late');
  if (!serviceSelect || !sizeSelect) return;

  serviceSelect.innerHTML = CONFIG.SERVICES.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  sizeSelect.innerHTML = Object.entries(SIZE_TITLES).map(([key, label]) => `<option value="${key}">${label}</option>`).join('');

  const update = () => {
    const service = CONFIG.SERVICES.find(s => s.id === serviceSelect.value);
    const size = sizeSelect.value;
    const base = service.prices[size];
    const lateFee = lateCheckbox.checked ? CONFIG.AFTER_HOURS_FEE : 0;
    const subtotal = base + lateFee;
    const tax = subtotal * CONFIG.TAX_RATE;
    const total = subtotal + tax;
    const deposit = total * CONFIG.DEPOSIT_PERCENT;

    const sub = document.getElementById('est-sub');
    const taxEl = document.getElementById('est-tax');
    const totalEl = document.getElementById('est-total');
    const depositEl = document.getElementById('est-deposit');

    if (sub) sub.textContent = money(subtotal);
    if (taxEl) taxEl.textContent = money(tax);
    if (totalEl) totalEl.textContent = money(total);
    if (depositEl) depositEl.textContent = money(deposit);
  };

  serviceSelect.addEventListener('change', update);
  sizeSelect.addEventListener('change', update);
  lateCheckbox.addEventListener('change', update);
  update();
}

function renderGallery() {
  const galleryRoot = document.querySelector('[data-gallery]');
  if (!galleryRoot || !CONFIG.PHOTOS.gallery.length) return;

  const note = document.getElementById('owner-note');
  if (note) note.remove();

  galleryRoot.innerHTML = CONFIG.PHOTOS.gallery.map(item => `
    <figure class="reveal">
      <img src="${item.src}" alt="${item.alt}" style="aspect-ratio: 4 / 3; object-fit: cover; border-radius: 16px; width: 100%;">
      <figcaption>${item.caption}</figcaption>
    </figure>
  `).join('');
}

function initBookingEmbed() {
  const root = document.getElementById('booking-embed');
  if (!root || !CONFIG.BOOKING_URL) return;

  const iframe = document.createElement('iframe');
  iframe.src = CONFIG.BOOKING_URL;
  iframe.title = 'Booking calendar';
  iframe.loading = 'lazy';
  iframe.style.width = '100%';
  iframe.style.minHeight = '900px';
  iframe.style.border = '0';
  iframe.style.borderRadius = '24px';
  root.innerHTML = '';
  root.appendChild(iframe);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    const required = [...form.querySelectorAll('[required]')];
    const ok = required.every(input => input.value.trim());
    const status = document.getElementById('form-status');

    if (!ok) {
      event.preventDefault();
      status.textContent = 'Please fill in the required fields before sending.';
      return;
    }

    if (!CONFIG.FORM_ENDPOINT) {
      event.preventDefault();
      const subject = encodeURIComponent('New message from O.G. AutoSpa website');
      const body = encodeURIComponent(
        `Name: ${form.elements.name?.value || ''}\nPhone: ${form.elements.phone?.value || ''}\nEmail: ${form.elements.email?.value || ''}\nCity: ${form.elements.city?.value || ''}\nVehicle: ${form.elements.vehicle?.value || ''}\nService: ${form.elements.service?.value || ''}\n\nMessage:\n${form.elements.message?.value || ''}`
      );
      window.location.href = `mailto:${CONFIG.EMAIL}?subject=${subject}&body=${body}`;
      status.textContent = 'Your email app is opening. Please send the message there.';
      return;
    }

    status.textContent = 'Sending...';
  });
}

function initNav() {
  const button = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!button || !nav) return;
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  renderFeaturedServices();
  renderPriceTable();
  populateEstimator();
  renderGallery();
  initBookingEmbed();
  initContactForm();
  initNav();
});
