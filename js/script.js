/* ==========================================================================
   RuhunaFind — site script
   Shared on every page. Page-specific code runs only where its elements exist.

   1. Helpers & data     2. Icons          3. Shared header / footer
   4. Ticket card        5. Home           6. Browse (+ details dialog)
   7. Report form        8. Contact form
   ========================================================================== */

(() => {
  'use strict';

  /* 1 — Helpers & data ---------------------------------------------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v) =>
    String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const TEAM_EMAIL = 'ruhunafind-team@university.edu';
  const SECURITY_LINE = 'Ext 4400';
  const STORE_KEY = 'ruhunafind.reports.v1';

  const CATEGORIES = [
    { id: 'electronics', label: 'Electronics', icon: 'laptop', desc: 'Phones, laptops, chargers, earbuds' },
    { id: 'personal', label: 'Personal belongings', icon: 'wallet', desc: 'Wallets, watches, glasses, jewellery' },
    { id: 'books', label: 'Books & stationery', icon: 'notebook', desc: 'Notebooks, textbooks, calculators, pens' },
    { id: 'bags', label: 'Bags & backpacks', icon: 'bag', desc: 'Backpacks, totes, pencil cases' },
    { id: 'cards', label: 'Cards & ID', icon: 'idcard', desc: 'Student IDs, bank cards, licences' },
    { id: 'other', label: 'Other items', icon: 'box', desc: 'Keys, umbrellas, bottles, everything else' },
  ];
  const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  const LOCATIONS = [
    'Science Complex', 'Science Canteen', 'CS Auditorium', 'Mini CS Auditorium', 'CS Lab', 'Computer Laboratory',
    'Lab Rack', 'PLT 1', 'PLT 2', 'MLT 1', 'MLT 2', 'Management Faculty', 'Art Faculty', 'Art Canteen',
    'Library', 'University Ground', 'Hostel',
  ];

  // Starter listings. Reports submitted through the form are saved in the
  // visitor's browser (localStorage) and shown alongside these.
  const SEED_ITEMS = [
    {
      ref: 'RF-0247', status: 'found', title: 'Wireless earbuds with charging case', category: 'electronics',
      location: 'Science Complex', date: '2026-11-13', photo: 'images/items/earbuds.webp', pos: '50% 60%',
      desc: 'Dark navy earbuds in a matching charging case with a small scratch on the lid. Found on a bench outside the main entrance.',
    },
    {
      ref: 'RF-0246', status: 'lost', title: 'Tan canvas tote bag', category: 'bags',
      location: 'Art Canteen', date: '2026-11-12', photo: 'images/items/tote-bag.webp', pos: '50% 62%',
      desc: 'Plain tan tote with two long handles. Contains a pencil case and a printed lecture handout.',
    },
    {
      ref: 'RF-0244', status: 'found', title: 'Brown leather wallet', category: 'personal',
      location: 'Library', date: '2026-11-11', photo: 'images/items/wallet.webp', pos: '50% 30%',
      desc: 'Folded brown leather wallet, worn at the edges. Found on a study table on the ground floor. The contents are not listed here: the owner should be able to describe them.',
    },
    {
      ref: 'RF-0241', status: 'lost', title: 'Black over-ear headphones', category: 'electronics',
      location: 'University Ground', date: '2026-11-10', photo: 'images/items/headphones.webp', pos: '50% 50%',
      desc: 'Black wireless headphones with silver detailing on the ear cups. Left behind after an evening practice session.',
    },
    {
      ref: 'RF-0238', status: 'lost', title: 'Navy canvas backpack', category: 'bags',
      location: 'Science Canteen', date: '2026-11-09', photo: null,
      desc: 'Navy backpack with a black zip and a keyring on the front pocket. Contains notebooks and a water bottle.',
    },
    {
      ref: 'RF-0235', status: 'lost', title: 'Blue spiral lecture notebook', category: 'books',
      location: 'PLT 1', date: '2026-11-08', photo: null,
      desc: 'A4 blue spiral notebook with handwritten lecture notes. A name is written on the inside cover.',
    },
    {
      ref: 'RF-0233', status: 'found', title: 'Silver wristwatch', category: 'personal',
      location: 'MLT 2', date: '2026-11-07', photo: null,
      desc: 'Silver analogue wristwatch with a metal strap, left on a desk after the afternoon lecture.',
    },
    {
      ref: 'RF-0232', status: 'found', title: 'Keys on a green lanyard', category: 'other',
      location: 'Computer Laboratory', date: '2026-11-06', photo: null,
      desc: 'Three keys and a small padlock key on a green lanyard, found beside a workstation after the evening session.',
    },
    {
      ref: 'RF-0230', status: 'found', title: 'Student ID card', category: 'cards',
      location: 'Library', date: '2026-11-06', photo: null,
      desc: 'A student ID card handed in at the library. The name is not shown here: get in touch with your name and registration number to claim it.',
    },
  ].map((i) => ({ ...i, reporter: 'RuhunaFind team', email: TEAM_EMAIL }));

  function loadReports() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((r) => r && r.ref && r.title && r.date) : [];
    } catch (_) {
      return [];
    }
  }
  function saveReport(item) {
    const list = loadReports();
    list.push(item);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list));
      return true;
    } catch (_) {
      return false;
    }
  }
  const allItems = () =>
    [...loadReports(), ...SEED_ITEMS].sort((a, b) => b.date.localeCompare(a.date) || b.ref.localeCompare(a.ref));

  function nextRef() {
    const nums = allItems().map((i) => parseInt(String(i.ref).replace(/\D/g, ''), 10) || 0);
    return 'RF-' + String(Math.max(0, ...nums) + 1).padStart(4, '0');
  }

  const fmtDate = (iso) => {
    const d = new Date(iso + 'T00:00:00Z');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  };
  const todayISO = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /* 2 — Icons (inline sprite, so it also works when opened from disk) ----- */

  const ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
    laptop: '<path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"/><path d="M20.054 15.987H3.946"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    notebook: '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
    bag: '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/><path d="M8 10h8"/>',
    idcard: '<path d="M13 19a4 4 0 0 0-8 0"/><path d="M16 10h2M16 14h2"/><circle cx="9" cy="12" r="3"/><rect x="2" y="5" width="20" height="14" rx="2"/>',
    box: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  };
  const SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    Object.entries(ICONS)
      .map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${d}</symbol>`)
      .join('') +
    '</svg>';
  const ic = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  /* 3 — Shared header / footer ------------------------------------------- */

  const NAV = [
    ['home', 'index.html', 'Home'],
    ['browse', 'browse.html', 'Browse items'],
    ['report', 'report.html', 'Report item'],
    ['contact', 'contact.html', 'Contact & Guide'],
  ];

  const header = $('.site-header');
  if (header) {
    const active = header.dataset.nav;
    if (!header.querySelector('.nav')) {
      header.innerHTML = `
        <a class="skip" href="#main">Skip to content</a>
        <div class="wrap nav">
          <a class="nav__logo" href="index.html" aria-label="RuhunaFind home">
            <img src="images/logo.png" alt="RuhunaFind" width="141" height="34">
          </a>
          <button class="nav__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu"><span></span><span></span></button>
          <nav class="nav__menu" id="nav-menu" aria-label="Main">
            <ul>
              ${NAV.map(([key, href, label]) => `<li><a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}
            </ul>
            <a class="btn btn--primary btn--sm" href="report.html">${ic('plus')} Report an item</a>
          </nav>
        </div>
        <div class="progress" aria-hidden="true"></div>`;
    }

    const toggle = $('.nav__toggle', header);
    const setOpen = (open) => {
      header.classList.toggle('is-open', open);
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
    };
    if (toggle) {
      toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
    }
    document.addEventListener('click', (e) => {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false); toggle?.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => m.matches && setOpen(false));
  }

  const footer = $('.site-footer');
  if (footer && !footer.querySelector('.wrap')) {
    footer.innerHTML = `
      <div class="wrap">
        <div class="footer__top">
          <div class="footer__brand">
            <img src="images/logo-white.png" alt="RuhunaFind" width="146" height="36">
            <p>A lost-and-found board for the University of Ruhuna. Built by five Computer Science students as a group project.</p>
          </div>
          <div class="footer__col">
            <h2>Navigate</h2>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="browse.html">Browse items</a></li>
              <li><a href="report.html">Report an item</a></li>
            </ul>
          </div>
          <div class="footer__col">
            <h2>Help &amp; Guide</h2>
            <ul>
              <li><a href="contact.html#guide">How it works</a></li>
              <li><a href="contact.html#rules">Safety rules</a></li>
              <li><a href="contact.html#faq">FAQs</a></li>
              <li><a href="contact.html">Contact us</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__mark" aria-hidden="true">RuhunaFind</div>
        <div class="footer__bottom mono">
          <span>&copy; 2026 RuhunaFind</span>
          <span>University of Ruhuna student project</span>
        </div>
      </div>`;
  }

  /* 4 — Ticket card ------------------------------------------------------- */

  const tag = (status) => `<span class="tag tag--${status}">${status === 'lost' ? 'Lost' : 'Found'}</span>`;

  function mediaHTML(item) {
    if (item.photo) {
      return `<img src="${esc(item.photo)}" alt="${esc(item.title)}" loading="lazy" style="object-position:${esc(item.pos || '50% 50%')}">`;
    }
    const cat = CAT[item.category] || CAT.other;
    return `<div class="ticket__ph" aria-hidden="true">${ic(cat.icon, 'i--xl')}<span class="mono caps">No photo</span></div>`;
  }

  function ticketHTML(item, opts = {}) {
    const cat = CAT[item.category] || CAT.other;
    const href = `details.html?ref=${encodeURIComponent(item.ref)}`;
    return `
      <article class="ticket" data-ref="${esc(item.ref)}">
        <div class="ticket__media">${mediaHTML(item)}${tag(item.status)}</div>
        <div class="ticket__perf" aria-hidden="true"></div>
        <div class="ticket__body">
          <div class="ticket__top mono caps"><span>${esc(item.ref)}</span><span>${esc(cat.label)}</span></div>
          <h3 class="ticket__title">${esc(item.title)}</h3>
          <ul class="ticket__facts">
            <li>${ic('pin')}${esc(item.location)}</li>
            <li>${ic('calendar')}${fmtDate(item.date)}</li>
          </ul>
          <a class="ticket__more" href="${href}" data-open="${esc(item.ref)}" aria-label="View details: ${esc(item.title)}">View details ${ic('arrow')}</a>
        </div>
      </article>`;
  }

  function largeTicketHTML(item, { link = true } = {}) {
    const cat = CAT[item.category] || CAT.other;
    return `
      <article class="ticket ticket--lg${link ? '' : ' ticket--static'}" data-ref="${esc(item.ref)}">
        <div class="ticket__media">${mediaHTML(item)}${tag(item.status)}</div>
        <div class="ticket__perf" aria-hidden="true"></div>
        <div class="ticket__body">
          <div class="ticket__top mono caps"><span>${esc(cat.label)}</span><span>${fmtDate(item.date)}</span></div>
          <h3 class="ticket__title">${link ? `<a href="details.html?ref=${encodeURIComponent(item.ref)}" style="text-decoration:none">${esc(item.title)}</a>` : esc(item.title)}</h3>
          <ul class="ticket__facts"><li>${ic('pin')}${esc(item.location)}</li></ul>
        </div>
        <div class="ticket__perf" aria-hidden="true"></div>
        <div class="ticket__stub">
          <div class="ticket__stub-text mono caps"><span>Claim ref</span><strong>${esc(item.ref)}</strong></div>
          <div class="barcode" aria-hidden="true"></div>
        </div>
      </article>`;
  }

  /* 5 — Home -------------------------------------------------------------- */

  const page = document.body.dataset.page;

  if (page === 'home') {
    const items = allItems();
    const lost = items.filter((i) => i.status === 'lost').length;

    // Hero ticket stack: the newest item that has a portrait photo, plus the newest landscape one behind it
    const withPhoto = items.filter((i) => i.photo);
    const hero = withPhoto.find((i) => /wallet|tote/.test(i.photo)) || withPhoto[0] || items[0];
    const ghost = withPhoto.find((i) => i !== hero && /earbuds|headphones/.test(i.photo));
    const stack = $('#hero-stack');
    if (stack && hero) {
      stack.insertAdjacentHTML(
        'afterbegin',
        (ghost
          ? `<div class="ticket ticket--ghost ticket--static" aria-hidden="true">
               <div class="ticket__media">${mediaHTML(ghost)}${tag(ghost.status)}</div>
               <div class="ticket__perf"></div>
               <div class="ticket__stub"><div class="ticket__stub-text mono caps"><strong>${esc(ghost.ref)}</strong></div><div class="barcode"></div></div>
             </div>`
          : '') + largeTicketHTML(hero)
      );
    }
    const caption = $('#hero-caption');
    if (caption) caption.textContent = `On the board now: ${plural(items.length, 'item', 'items')} — ${lost} lost, ${items.length - lost} found`;

    const recent = $('#recent');
    if (recent) recent.innerHTML = items.slice(0, 4).map((i) => ticketHTML(i)).join('');
    const all = $('#all-count');
    if (all) all.textContent = items.length;

    const list = $('#catlist');
    if (list) {
      list.innerHTML = CATEGORIES.map((c, n) => {
        const count = items.filter((i) => i.category === c.id).length;
        return `<li><a href="browse.html?category=${c.id}">
          <span class="catlist__num">0${n + 1}</span>
          <span class="catlist__name">${ic(c.icon)}${esc(c.label)}</span>
          <span class="catlist__desc">${esc(c.desc)}</span>
          <span class="catlist__count">${plural(count, 'item', 'items')}</span>
          <span class="catlist__go">${ic('arrow')}</span>
        </a></li>`;
      }).join('');
    }
  }

  /* 6 — Browse ------------------------------------------------------------ */

  if (page === 'browse') {
    const state = { q: '', status: 'all', category: 'all', location: 'all', sort: 'recent' };
    const els = {
      q: $('#f-q'), category: $('#f-category'), location: $('#f-location'), sort: $('#f-sort'),
      clear: $('#f-clear'), grid: $('#grid'), count: $('#count'), empty: $('#empty'),
      tabs: $$('[data-status]'), total: $('#total'),
    };

    els.category.innerHTML = '<option value="all">All categories</option>' + CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
    els.location.innerHTML = '<option value="all">All locations</option>' + LOCATIONS.map((l) => `<option>${esc(l)}</option>`).join('');

    // Read filters from the URL (e.g. coming from the home page search)
    const params = new URLSearchParams(location.search);
    state.q = (params.get('q') || '').trim();
    if (['lost', 'found'].includes(params.get('status'))) state.status = params.get('status');
    if (CAT[params.get('category')]) state.category = params.get('category');
    if (LOCATIONS.includes(params.get('location'))) state.location = params.get('location');
    els.q.value = state.q;
    els.category.value = state.category;
    els.location.value = state.location;

    const matches = (item, ignoreStatus) => {
      if (!ignoreStatus && state.status !== 'all' && item.status !== state.status) return false;
      if (state.category !== 'all' && item.category !== state.category) return false;
      if (state.location !== 'all' && item.location !== state.location) return false;
      if (state.q) {
        const hay = `${item.title} ${item.desc} ${item.location} ${(CAT[item.category] || {}).label} ${item.ref}`.toLowerCase();
        return state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
      }
      return true;
    };

    function syncURL() {
      const p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (state.status !== 'all') p.set('status', state.status);
      if (state.category !== 'all') p.set('category', state.category);
      if (state.location !== 'all') p.set('location', state.location);
      const qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }

    function render() {
      const items = allItems();
      let list = items.filter((i) => matches(i));
      if (state.sort === 'oldest') list = [...list].reverse();

      els.tabs.forEach((b) => {
        const s = b.dataset.status;
        b.setAttribute('aria-pressed', String(state.status === s));
        const n = items.filter((i) => matches(i, true) && (s === 'all' || i.status === s)).length;
        $('span', b).textContent = n;
      });

      els.grid.innerHTML = list.map((i) => ticketHTML(i)).join('');
      els.grid.hidden = list.length === 0;
      els.empty.hidden = list.length !== 0;
      els.count.innerHTML = `<strong>${plural(list.length, 'item', 'items')}</strong>${state.q ? ` for “${esc(state.q)}”` : ''}`;
      const filtered = state.q || state.status !== 'all' || state.category !== 'all' || state.location !== 'all';
      els.clear.hidden = !filtered;
      if (els.total) els.total.textContent = `${items.length} on the board`;
      syncURL();
    }

    els.q.addEventListener('input', () => { state.q = els.q.value.trim(); render(); });
    els.category.addEventListener('change', () => { state.category = els.category.value; render(); });
    els.location.addEventListener('change', () => { state.location = els.location.value; render(); });
    els.sort.addEventListener('change', () => { state.sort = els.sort.value; render(); });
    els.tabs.forEach((b) => b.addEventListener('click', () => { state.status = b.dataset.status; render(); }));
    const reset = () => {
      Object.assign(state, { q: '', status: 'all', category: 'all', location: 'all' });
      els.q.value = ''; els.category.value = 'all'; els.location.value = 'all';
      render();
    };
    els.clear.addEventListener('click', reset);
    $('#empty-clear')?.addEventListener('click', reset);

    render();
  }

  /* 7 — Report form ------------------------------------------------------- */

  if (page === 'report') {
    const form = $('#report-form');
    const F = form.elements; // named controls (form.title / form.name would clash with built-in properties)
    const done = $('#done');
    const photoInput = $('#photo');
    const upload = $('#upload');
    const preview = $('#preview');
    let photoData = null;

    $('#category').innerHTML = '<option value="">Select a category</option>' + CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
    $('#location').innerHTML = '<option value="">Select a location</option>' + LOCATIONS.map((l) => `<option>${esc(l)}</option>`).join('');
    $('#date').max = todayISO();
    $('#date').value = todayISO();

    const t = new URLSearchParams(location.search).get('type');
    if (['lost', 'found'].includes(t)) $(`input[name="type"][value="${t}"]`).checked = true;

    // Resize the photo so it fits comfortably in localStorage
    function shrink(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onerror = () => resolve(null);
        reader.onload = () => {
          const img = new Image();
          img.onerror = () => resolve(null);
          img.onload = () => {
            const max = 720;
            const k = Math.min(1, max / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * k);
            c.height = Math.round(img.height * k);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL('image/jpeg', 0.8));
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }

    photoInput.addEventListener('change', async () => {
      const file = photoInput.files[0];
      if (!file) { photoData = null; upload.classList.remove('has-file'); return; }
      photoData = await shrink(file);
      if (photoData) {
        preview.src = photoData;
        upload.classList.add('has-file');
        $('#upload-name').textContent = file.name;
      }
    });

    const fields = {
      type: () => (F.type.value ? '' : 'Choose whether the item was lost or found.'),
      title: () => (F.title.value.trim().length >= 3 ? '' : 'Give the item a short name, e.g. “Blue Hydro Flask bottle”.'),
      category: () => (F.category.value ? '' : 'Select a category.'),
      date: () => (!F.date.value ? 'Pick a date.' : F.date.value > todayISO() ? 'The date can’t be in the future.' : ''),
      location: () => (F.location.value ? '' : 'Select where it was lost or found.'),
      desc: () => (F.desc.value.trim().length >= 15 ? '' : 'Add a little more detail (at least a sentence) so the owner can recognise it.'),
      name: () => (F.reporterName.value.trim().length >= 2 ? '' : 'Enter your name.'),
      email: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.value.trim()) ? '' : 'Enter a valid email address.'),
    };
    const inputFor = (k) => (k === 'type' ? $('input[name="type"]', form) : k === 'name' ? F.reporterName : F[k]);

    function check(k) {
      const msg = fields[k]();
      const out = $(`#err-${k}`);
      out.textContent = msg;
      const input = inputFor(k);
      if (k !== 'type') input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    Object.keys(fields).forEach((k) => {
      if (k === 'type') $$('input[name="type"]', form).forEach((r) => r.addEventListener('change', () => check('type')));
      else inputFor(k).addEventListener('blur', () => check(k));
      if (k !== 'type') inputFor(k).addEventListener('input', () => inputFor(k).getAttribute('aria-invalid') === 'true' && check(k));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map((k) => [k, check(k)]);
      const bad = results.find(([, ok]) => !ok);
      if (bad) { inputFor(bad[0]).focus(); return; }

      const item = {
        ref: nextRef(), status: F.type.value, title: F.title.value.trim(), category: F.category.value,
        location: F.location.value, date: F.date.value, desc: F.desc.value.trim(),
        photo: photoData, pos: '50% 50%', reporter: F.reporterName.value.trim(), email: F.email.value.trim(),
      };
      if (!saveReport(item)) {
        item.photo = null; // storage full: retry without the photo
        saveReport(item);
      }

      form.hidden = true;
      $('#report-intro').hidden = true;
      done.hidden = false;
      $('#done-ticket').innerHTML = largeTicketHTML(item, { link: false });
      $('#done-view').href = `details.html?ref=${encodeURIComponent(item.ref)}`;
      $('#done-title').focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $('#done-again').addEventListener('click', () => {
      form.reset();
      photoData = null; upload.classList.remove('has-file');
      $('#date').value = todayISO();
      $$('[aria-invalid]', form).forEach((n) => n.setAttribute('aria-invalid', 'false'));
      $$('.field__err', form).forEach((n) => (n.textContent = ''));
      done.hidden = true; form.hidden = false; $('#report-intro').hidden = false;
      window.scrollTo({ top: 0 });
    });
  }

  /* 8 — Contact form ------------------------------------------------------ */

  if (page === 'contact') {
    const form = $('#contact-form');
    const F = form.elements;
    const status = $('#contact-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const subject = F.subject.value.trim() || 'Message from the RuhunaFind website';
      const body = `${F.message.value.trim()}\n\n— ${F.fullname.value.trim()} (${F.email.value.trim()})`;
      window.location.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.hidden = false;
      status.textContent = `Your email app should open with the message ready to send. If nothing opens, write to ${TEAM_EMAIL} directly.`;
    });
  }

  /* 8b — Details & Claim view (Member 4) ----------------------------------- */

  if (page === 'details') {
    const params = new URLSearchParams(location.search);
    const hashRef = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
    const ref = params.get('ref') || params.get('id') || hashRef || 'RF-0244';
    const item = allItems().find((i) => i.ref === ref) || allItems()[0];

    if (item) {
      const isFound = item.status === 'found';
      const cat = CAT[item.category] || CAT.other;
      const email = item.email || TEAM_EMAIL;
      const subject = encodeURIComponent(`RuhunaFind Claim Inquiry ${item.ref}: ${item.title}`);

      const titleEl = $('#detail-title');
      if (titleEl) titleEl.textContent = item.title;

      const refEl = $('#detail-ref');
      if (refEl) refEl.textContent = item.ref;

      const catEl = $('#detail-cat');
      if (catEl) catEl.textContent = cat.label;

      const locEl = $('#detail-loc');
      if (locEl) locEl.textContent = item.location;

      const dateEl = $('#detail-date');
      if (dateEl) dateEl.textContent = fmtDate(item.date);

      const repEl = $('#detail-reporter');
      if (repEl) repEl.textContent = item.reporter || 'Campus Member';

      const descEl = $('#detail-desc');
      if (descEl) descEl.textContent = item.desc || 'No description was provided.';

      const mediaEl = $('#detail-media');
      if (mediaEl) mediaEl.innerHTML = mediaHTML(item) + tag(item.status);

      const statusTagEl = $('#detail-status-tag');
      if (statusTagEl) statusTagEl.innerHTML = tag(item.status);

      const claimBtn = $('#detail-claim-btn');
      if (claimBtn) claimBtn.href = `mailto:${esc(email)}?subject=${subject}`;

      const claimHead = $('#detail-claim-heading');
      if (claimHead) claimHead.textContent = isFound ? 'Think this is yours?' : 'Seen this item?';

      const locLabel = $('#detail-loc-label');
      if (locLabel) locLabel.textContent = isFound ? 'Found at' : 'Lost at';

      const dateLabel = $('#detail-date-label');
      if (dateLabel) dateLabel.textContent = isFound ? 'Found on' : 'Lost on';
    }
  }

  /* 9 — Polish: scroll progress, reveal, marquee, counters, parallax -------- */

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header shadow + reading-progress bar
  (() => {
    const bar = $('.progress');
    const head = $('.site-header');
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
      if (head) head.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  })();

  // Campus marquee (home): the list is doubled so the loop is seamless
  const marquee = $('#marquee');
  if (marquee) {
    const half = LOCATIONS.map((l) => `<span class="marquee__item">${esc(l)}</span>`).join('');
    marquee.innerHTML = half + half;
  }

  // Count-up numbers (home)
  const statEls = $$('[data-stat]');
  if (statEls.length) {
    const items = allItems();
    const lost = items.filter((i) => i.status === 'lost').length;
    const values = { total: items.length, lost, found: items.length - lost, spots: LOCATIONS.length };
    const run = (el) => {
      const target = values[el.dataset.stat] ?? 0;
      if (reduce) { el.textContent = target; return; }
      const t0 = performance.now(), dur = 1100;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.6 });
      statEls.forEach((el) => io.observe(el));
    } else statEls.forEach(run);
  }

  // Scroll reveal. The class is only added when it can actually run,
  // so content is never left invisible.
  if (!reduce && 'IntersectionObserver' in window) {
    const targets = $$('.section-head, .catlist li, .step3, .band-cta__grid, .rule, .row, .faq details, .split > *, .contact__info, .contact__form, .report__aside, .facts');
    targets.forEach((el, n) => {
      el.classList.add('reveal');
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${(n % 4) * 0.07}s`);
    });
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  }

  // Gentle mouse parallax on the hero ticket (fine pointers only)
  const heroSection = $('.hero');
  const heroStack = $('#hero-stack');
  if (heroSection && heroStack && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      heroStack.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1));
      heroStack.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1));
    });
    heroSection.addEventListener('mouseleave', () => { heroStack.style.setProperty('--px', 0); heroStack.style.setProperty('--py', 0); });
  }
})();
