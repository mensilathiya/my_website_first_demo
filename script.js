'use strict';
window.__ok = true; // tells index.html the script loaded (otherwise the page falls back to a fully visible no-JS state)

/* ================= EDIT YOUR PROJECTS HERE =================
   Each row: [title, filter category, project type, description, tools, colour 0-5, image path (optional), alt text (optional)]
   Filter categories: Branding | Social Media | Posters | Packaging | Digital Design
   Images: set AUTO_IMAGES to true and add images/project-01.jpg … project-12.jpg, OR give each row its own path (7th value).
   Missing images fall back to the placeholder. All sample projects below are fictional concepts. */
const AUTO_IMAGES = false;
const PAL = [['#1a1a1a','#2b3300','#C8FF00'],['#141414','#3a1d5c','#8a5cff'],['#151515','#0f3a40','#27d3e0'],['#1c1c1c','#5c2a14','#ff7a3d'],['#111','#3d3d3d','#f2f2f2'],['#1a1a1a','#4a1230','#ff4d8d']];
const RAW = [
  ['Nova Coffee Roasters','Branding','Brand Identity','Concept identity for a specialty roaster: wordmark, colour palette, stationery and a compact brand guide.',['Illustrator','InDesign','Photoshop'],0],
  ['Orbit Logo Series','Branding','Logo Design','A set of geometric logo marks exploring orbit and motion, built on a strict grid.',['Illustrator','Figma'],4],
  ['Pulse Festival','Posters','Event Poster','Bold type-led poster for an imaginary music festival with layered gradients and grain.',['Photoshop','Illustrator'],1],
  ['Kinetic Social Kit','Social Media','Social Media Creatives','A reusable template kit of posts, stories and covers for a fast-moving fitness brand concept.',['Figma','Photoshop','After Effects'],3],
  ['Aqua Water Packaging','Packaging','Packaging Design','Minimal label and carton system for a premium mineral water concept with a clean, cool palette.',['Illustrator','Dimension'],2],
  ['Lumen App Launch','Digital Design','Digital Campaign','Launch campaign visuals for a fictional sleep app: banners, landing hero and social teasers.',['Figma','Photoshop'],1],
  ['Mono Type Poster','Posters','Typographic Poster','An experiment in expressive black-and-white typography at poster scale.',['InDesign','Illustrator'],4],
  ['Bloom Skincare Box','Packaging','Packaging Design','Soft, botanical packaging concept with foil details and a tactile unboxing flow.',['Illustrator','Dimension','Photoshop'],5],
  ['Studio Grid Rebrand','Branding','Brand Identity','Concept rebrand for a design studio built around a flexible modular grid system.',['Figma','Illustrator'],0],
  ['Weekend Stories','Social Media','Social Media Creatives','Carousel and story designs for a travel-journal concept with consistent editorial layouts.',['Photoshop','Figma'],2],
  ['Neon Nights Gig Poster','Posters','Gig Poster','High-contrast gig poster using neon colour and halftone texture.',['Photoshop','Illustrator'],3],
  ['Pixel Pop Campaign','Digital Design','Digital Campaign','Playful animated banner and social set for a fictional gaming accessory launch.',['Figma','After Effects','Illustrator'],5]
];
const PROJECTS = RAW.map((r, i) => ({
  t: r[0], c: r[1], k: r[2], d: r[3], u: r[4], p: PAL[r[5]],
  img: r[6] || (AUTO_IMAGES ? 'images/project-' + String(i + 1).padStart(2, '0') + '.jpg' : ''),
  alt: r[7] || ''
}));
const CATS = ['All', 'Branding', 'Social Media', 'Posters', 'Packaging', 'Digital Design'];
/* Contact form: paste your Google Apps Script Web App URL here (see google-apps-script.gs). Leave empty to fall back to the visitor's email app. */
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyYi8oeRQTXTa2JHPCHXl_snTU2FZCv8BiHo6BMk_v8LgwpgShpQBUojz7P0PRpYMgt/exec';
const CONTACT_EMAIL = 'hello@yourname.com';
const ROLES = ['Graphic Designer', 'Visual Storyteller', 'Brand Builder'];

/* ================= helpers ================= */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function loader() {
  const L = $('#loader'), p = $('#pct'), bar = $('#ldbar');
  let loaded = document.readyState === 'complete', fin = false;
  addEventListener('load', () => { loaded = true; }, { once: true });
  const finish = () => {
    if (fin) return; fin = true;
    p.textContent = 100; bar.style.transform = 'scaleX(1)';
    setTimeout(() => {
      L.classList.add('done'); document.body.classList.add('ready');
      setTimeout(() => L.remove(), 1300);
    }, rmq.matches ? 0 : 350);
  };
  setTimeout(finish, 4000); // hard fallback: the loader can never get stuck
  const t0 = performance.now(), dur = rmq.matches ? 1 : 1600;
  requestAnimationFrame(function tick(now) {
    if (fin) return;
    const t = Math.min((now - t0) / dur, 1);
    let v = Math.round(100 * (1 - (1 - t) * (1 - t)));
    if (!loaded) v = Math.min(v, 90);
    p.textContent = v; bar.style.transform = 'scaleX(' + v / 100 + ')';
    if (t >= 1 && loaded) return finish();
    requestAnimationFrame(tick);
  });
}

function scramble(el) {
  if (rmq.matches) return;
  const f = el.textContent, ch = 'ABCDEFGHJKLMNOPQRSTUVWXYZ#%&*+/';
  let i = 0;
  const s = setInterval(() => {
    el.textContent = f.split('').map((c, k) => c === ' ' || k < i ? c : ch[Math.random() * ch.length | 0]).join('');
    if (i++ >= f.length) { el.textContent = f; clearInterval(s); }
  }, 35);
}

function splitHeadline() {
  const h = $('#h1'); let n = 0;
  const walk = (node, hl) => [...node.childNodes].map(c => c.nodeType === 3
    ? c.textContent.split(/\s+/).filter(Boolean).map(w => `<span class="w"><i style="--n:${n++}">${esc(w)}</i></span> `).join('')
    : `<span class="${hl ? '' : 'hl'}">${walk(c, true)}</span>`).join('');
  h.setAttribute('aria-label', h.textContent.trim());
  h.innerHTML = walk(h, false).replace(/<span class="hl">/g, '<span class="hl" aria-hidden="true">');
}

function roles() {
  const el = $('#typed');
  if (rmq.matches) return;
  let i = 0, j = 0, del = false;
  (function t() {
    const w = ROLES[i]; el.textContent = w.slice(0, j);
    if (!del && j++ === w.length) { del = true; return setTimeout(t, 1600); }
    if (del && j-- === 0) { del = false; i = (i + 1) % ROLES.length; j = 0; }
    setTimeout(t, del ? 40 : 90);
  })();
}

function reveals() {
  const items = $$('.rv');
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in', 'done')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('in');
    setTimeout(() => { t.style.transitionDelay = ''; t.classList.add('done'); }, 1500);
    const lb = $('.label', t); if (lb) scramble(lb);
    $$('[data-n]', t).forEach(c => {
      const to = +c.dataset.n; let s = null;
      const f = ts => { s = s || ts; const p = Math.min((ts - s) / 1400, 1); c.textContent = Math.round(to * (1 - (1 - p) ** 3)) + (p === 1 ? '+' : ''); if (p < 1) requestAnimationFrame(f); };
      if (!rmq.matches) requestAnimationFrame(f);
    });
    io.unobserve(t);
  }), { threshold: .12 });
  items.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
}

function navigation() {
  const nav = $('#nav'), fab = $('#fab'), links = $('#links'), bg = $('#burger');
  $$('a', links).forEach((a, k) => a.style.setProperty('--k', k));
  const setMenu = on => {
    links.classList.toggle('open', on); nav.classList.toggle('menu', on);
    bg.textContent = on ? '✕' : '☰'; bg.setAttribute('aria-expanded', on); bg.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
  };
  bg.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); }, { passive: true });

  let ly = 0, tk = false;
  addEventListener('scroll', () => {
    if (tk) return; tk = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle('solid', y > 40);
      nav.classList.toggle('hide', y > ly && y > 400 && !links.classList.contains('open'));
      fab.classList.toggle('show', y > 700); fab.tabIndex = y > 700 ? 0 : -1;
      fab.style.setProperty('--p', Math.round(y / Math.max(1, root.scrollHeight - innerHeight) * 100));
      ly = y; tk = false;
    });
  }, { passive: true });

  [$('#top'), fab].forEach(b => b.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: rmq.matches ? 'auto' : 'smooth' }); }));

  if ('IntersectionObserver' in window) {
    const lk = $$('a', links);
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) lk.forEach(a => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('act', on); on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(s => so.observe(s));
  }
}

/* Desktop-only effects (cursor, parallax, magnetic buttons) with full teardown */
let teardown = null, wide = innerWidth >= 900;
function effects() {
  if (teardown) { teardown(); teardown = null; }
  if (!fine.matches || rmq.matches || innerWidth < 900) return;
  const ac = new AbortController(), sg = { signal: ac.signal };
  const c = document.createElement('div'); c.id = 'cur'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<i></i>'; document.body.appendChild(c);
  const sh = $('.shape'), gr = $('.grid-bg'), btns = $$('.btn');
  let x = 0, y = 0, cx = 0, cy = 0, px = 0, py = 0, tx = 0, ty = 0, raf = 0, seen = false;
  const loop = () => {
    cx += (x - cx) * .2; cy += (y - cy) * .2; px += (tx - px) * .06; py += (ty - py) * .06;
    c.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    sh.style.transform = `translate3d(${px * 34}px,${py * 34}px,0)`;
    gr.style.transform = `translate3d(${px * -12}px,${py * -12}px,0)`;
    raf = requestAnimationFrame(loop);
  };
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; tx = x / innerWidth - .5; ty = y / innerHeight - .5; if (!seen) { seen = true; cx = x; cy = y; c.style.opacity = 1; } }, { signal: ac.signal, passive: true });
  addEventListener('mouseover', e => c.classList.toggle('hov', !!e.target.closest('a,button')), sg);
  root.addEventListener('mouseleave', () => { c.style.opacity = 0; }, sg);
  root.addEventListener('mouseenter', () => { if (seen) c.style.opacity = 1; }, sg);
  btns.forEach(b => {
    b.classList.add('mag');
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left - r.width / 2) * .25 + 'px'); b.style.setProperty('--my', (e.clientY - r.top - r.height / 2) * .35 + 'px'); }, sg);
    b.addEventListener('mouseleave', () => { b.style.removeProperty('--mx'); b.style.removeProperty('--my'); }, sg);
  });
  loop();
  teardown = () => {
    ac.abort(); cancelAnimationFrame(raf); c.remove(); sh.style.transform = gr.style.transform = '';
    btns.forEach(b => { b.classList.remove('mag'); b.style.removeProperty('--mx'); b.style.removeProperty('--my'); });
  };
}

/* ================= gallery + lightbox ================= */
function gallery() {
  const gal = $('#gallery'), fl = $('#filters'), cnt = $('#cnt'), lb = $('#lb'), lbw = $('.lbw'), vis = $('#lbP');
  let cur = 'All', list = PROJECTS, idx = 0, tm = 0, closing = false;
  const alt = p => p.alt || `${p.t} — ${p.k} project preview`;
  const ph = p => `<span class="ph" style="--a:${p.p[0]};--c:${p.p[1]};--b2:${p.p[2]}">${p.img ? `<img src="${esc(p.img)}" alt="${esc(alt(p))}" loading="lazy" decoding="async">` : ''}</span>`;
  const onErr = e => { if (e.target.tagName === 'IMG') e.target.remove(); }; // missing image → placeholder
  gal.addEventListener('error', onErr, true); vis.addEventListener('error', onErr, true);

  const show = el => { el.classList.add('in'); };
  const gio = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); gio.unobserve(e.target); } }), { threshold: .08 })
    : null;
  const render = () => {
    list = cur === 'All' ? PROJECTS : PROJECTS.filter(p => p.c === cur);
    gal.innerHTML = list.map((p, i) => `<button type="button" class="g${i % 5 === 0 ? ' w' : ''}" data-i="${i}" style="--i:${i % 6}" aria-haspopup="dialog"><span class="gf">${ph(p)}<span class="chip">${esc(p.k)}</span><span class="go" aria-hidden="true">↗</span></span><span class="gm"><strong>${esc(p.t)}</strong><em>${esc(p.c)}</em></span><span class="gd">${esc(p.d)}</span></button>`).join('');
    cnt.textContent = `Showing ${list.length} ${cur === 'All' ? '' : cur + ' '}project${list.length === 1 ? '' : 's'}`;
    $$('.g', gal).forEach(g => gio ? gio.observe(g) : show(g));
  };
  fl.innerHTML = CATS.map(c => `<button type="button" class="fb" data-c="${c}" aria-pressed="${c === cur}">${c}</button>`).join('');
  fl.addEventListener('click', e => {
    const b = e.target.closest('.fb'); if (!b || b.dataset.c === cur) return;
    cur = b.dataset.c; $$('.fb', fl).forEach(x => x.setAttribute('aria-pressed', x === b));
    gal.style.minHeight = gal.offsetHeight + 'px'; gal.classList.add('out'); clearTimeout(tm);
    tm = setTimeout(() => { render(); gal.classList.remove('out'); setTimeout(() => { gal.style.minHeight = ''; }, 700); }, rmq.matches ? 0 : 320);
  });
  render();

  const fill = () => {
    const p = list[idx];
    vis.innerHTML = ph(p); $('#lbK').textContent = `${p.c} — ${p.k}`; $('#lbT').textContent = p.t; $('#lbD').textContent = p.d;
    $('#lbU').innerHTML = p.u.map(u => `<li>${esc(u)}</li>`).join('');
    $('#lbN').textContent = `${String(idx + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
    $('#lbPrev').hidden = $('#lbNext').hidden = list.length < 2;
    lbw.classList.remove('sw'); void lbw.offsetWidth; lbw.classList.add('sw');
  };
  const go = d => { if (list.length < 2) return; idx = (idx + d + list.length) % list.length; fill(); };
  const open = i => {
    idx = i; fill();
    typeof lb.showModal === 'function' ? lb.showModal() : lb.setAttribute('open', '');
    root.style.overflow = 'hidden'; requestAnimationFrame(() => lb.classList.add('show'));
  };
  const close = () => {
    if (closing || !lb.open) return; closing = true; lb.classList.remove('show');
    setTimeout(() => { typeof lb.close === 'function' ? lb.close() : lb.removeAttribute('open'); root.style.overflow = ''; closing = false; }, rmq.matches ? 0 : 350);
  };
  gal.addEventListener('click', e => { const g = e.target.closest('.g'); if (g) open(+g.dataset.i); });
  $('#lbX').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => go(-1));
  $('#lbNext').addEventListener('click', () => go(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.addEventListener('cancel', e => { e.preventDefault(); close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'Escape') close(); });
  let sx = 0, sy = 0;
  lbw.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lbw.addEventListener('touchend', e => { const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1); }, { passive: true });
  $('#lbA').addEventListener('click', e => { e.preventDefault(); close(); setTimeout(() => $('#contact').scrollIntoView({ behavior: rmq.matches ? 'auto' : 'smooth' }), rmq.matches ? 0 : 400); });
}

function contactForm() {
  const f = $('#contactForm'), btn = $('#cfBtn'), st = $('#cfStatus');
  const say = (m, c) => { st.textContent = m; st.className = 'cf-s ' + (c || ''); };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const d = new FormData(f);
    if (d.get('website')) { say('Thank you! Your message has been sent.', 'ok'); f.reset(); return; } // honeypot: bots
    if (!FORM_ENDPOINT) { // not connected yet: open the visitor's email app instead
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Project enquiry from ' + d.get('name'))}&body=${encodeURIComponent(d.get('message') + '\n\n' + d.get('name') + ' — ' + d.get('email'))}`;
      return;
    }
    btn.disabled = true; say('Sending…');
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: new URLSearchParams(d) });
      const res = await r.json();
      if (res.result !== 'success') throw new Error(res.message || 'Request failed');
      say('Thank you! Your message has been sent — I’ll reply soon.', 'ok'); f.reset();
    } catch (err) {
      console.error(err); say('Sorry, something went wrong. Please email me directly at ' + CONTACT_EMAIL + '.', 'err');
    } finally { setTimeout(() => { btn.disabled = false; }, 2000); }
  });
}

/* ================= init ================= */
try {
  loader();
  splitHeadline();
  roles();
  $('#yr').textContent = new Date().getFullYear();
  $$('[data-n]').forEach(c => { if (!rmq.matches) c.textContent = '0'; });
  navigation();
  gallery();
  contactForm();
  reveals();
  effects();
  [fine, rmq].forEach(m => m.addEventListener('change', effects));
  addEventListener('resize', () => { const w = innerWidth >= 900; if (w !== wide) { wide = w; effects(); } }, { passive: true });
} catch (err) {
  console.error('Portfolio script error — falling back to the static page:', err);
  root.className = 'no-js';
  const l = $('#loader'); if (l) l.remove();
}