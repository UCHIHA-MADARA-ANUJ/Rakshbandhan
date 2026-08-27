// ═══════════════════════════════════════════════════════════
//  DIRECTOR — renders content + choreographs every act
//  gsap scrub when available, IO fallbacks always
// ═══════════════════════════════════════════════════════════
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as C from './content.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const io = (cb, opts = {}) => new IntersectionObserver((e) => e.forEach(x => x.isIntersecting && cb(x.target, x)), { threshold: 0.28, ...opts });

let hasGSAP = true;
try { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }
catch { hasGSAP = false; }

let audio = null;
export function setAudioRef(a) { audio = a; }
const tick = () => audio?.sfx('tick');

// ── RENDER ──────────────────────────────────────────────────
export function render() {
  // act1
  $('#cap-a1').textContent = C.ACT1.caption;
  $('#wanted-card .wanted-meta').textContent = C.ACT1.wanted.meta;
  $('#wanted-card .wanted-foot').textContent = C.ACT1.wanted.foot;
  $('#charges').innerHTML = C.ACT1.wanted.charges.map(c => `<li>${c}</li>`).join('');

  // act2 exhibits
  $('#exhibits').innerHTML = C.ACT2.exhibits.map((e, i) => `
    <figure class="polaroid" style="--rot:${[-3, 2.5, -1.5, 3, -2.6, 2, -3.4][i % 7]}deg">
      <img loading="lazy" src="${C.PHOTOS(e.slug)}" alt="${e.cap}"/>
      <span class="pol-time">2:22 AM</span>
      <figcaption class="pol-cap"><b>${e.tag}</b> — ${e.cap}</figcaption>
    </figure>`).join('');

  // mood wall
  $('#mood-stack').innerHTML = C.ACT2.moods.map(m => `<img src="${C.PHOTOS(m.slug)}" alt="${m.label}"/>`).join('');
  $('.mood-head .mono-tag').textContent = C.ACT2.moodLabel;
  $('#mood-label').textContent = C.ACT2.moods[0].label;

  // act3 phone
  $('#phone-screen').innerHTML = C.ACT3.phone.map(p => `
    <div class="pp ${p.big ? 'big' : ''}">
      <img loading="lazy" src="${C.PHOTOS(p.slug)}" alt="${p.label}"/><span>${p.label}</span>
    </div>`).join('');
  $('#phone-cap').textContent = C.ACT3.phoneCap;

  // chat
  $('#chat').innerHTML = `<div class="meta">${C.ACT3.chatMeta} · 🔒</div>` +
    C.ACT3.chat.map(m => `<div class="bub ${m.side}">${m.text}${m.time ? `<span class="t">${m.time}</span>` : ''}</div>`).join('');

  // act4 stats
  $('#stats').innerHTML = C.ACT4.stats.map(s => `<span>${s}</span>`).join('');

  // act5 hand
  $('#hand-img').src = C.PHOTOS(C.ACT5.handSlug);
  $('#hand-img').alt = C.ACT5.handAlt;
  $('#date-stamp').textContent = C.ACT5.dateStamp;

  // act6 letter
  $('#letter').innerHTML =
    C.ACT6.letter.map(l => `<p>${l}</p>`).join('') +
    `<p class="sign in">${C.ACT6.sign}</p><p class="ps">${C.ACT6.ps}</p>`;
  $('#end-title').innerHTML = C.ACT6.end.title.join('<br/>');
  $('#end-name').textContent = C.ACT6.end.name;
  $('.end-credit').innerHTML = `${C.ACT6.end.credit[0]}<br/><span class="dim">${C.ACT6.end.credit[1]}</span>`;
  $('#btn-call').href = C.ACT6.end.callHref;
  $('#btn-reply').href = C.ACT6.end.replyHref;

  // gallery (egg)
  $('#gallery-grid').innerHTML = C.ALL_SLUGS.map(s => `<img loading="lazy" src="${C.PHOTOS(s)}" alt="${s}"/>`).join('');

  // stars
  ['#stars-a1'].forEach(sel => {
    const box = $(sel); if (!box) return;
    let html = '';
    for (let i = 0; i < 70; i++) {
      const s = 1 + Math.random() * 1.8;
      html += `<i class="star" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${s}px;height:${s}px;--tw:${3 + Math.random() * 5}s;animation-delay:${-Math.random() * 6}s"></i>`;
    }
    box.innerHTML = html;
  });
}

// ── SCROLL STORY ────────────────────────────────────────────
export function initStory() {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  // thread progress (always)
  const bar = $('#threadbar');
  const setBar = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = Math.min(100, (scrollY / h) * 100) + '%';
  };
  addEventListener('scroll', setBar, { passive: true }); setBar();

  // ── ACT 1 ──
  const card = $('#wanted-card');
  const showCard = () => {
    if (card.classList.contains('in')) return;
    card.classList.add('in');
    audio?.sfx('stamp');
    $$('#charges li').forEach((li, i) => setTimeout(() => { li.classList.add('in'); tick(); }, 350 + i * 260));
  };
  if (hasGSAP) {
    $('#act1').style.height = '320vh';
    gsap.to('#moon-a1', {
      top: '16%', ease: 'none',
      scrollTrigger: { trigger: '#act1', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
    gsap.fromTo('.skyline-ggm', { yPercent: 12 }, {
      yPercent: -4, ease: 'none',
      scrollTrigger: { trigger: '#act1', start: 'top top', end: 'bottom bottom', scrub: 1 },
    });
    ScrollTrigger.create({ trigger: '#act1', start: '38% center', onEnter: showCard, once: true });
  } else {
    io(showCard).observe(card);
  }

  // ── ACT 2 exhibits ──
  const pols = $$('.polaroid');
  pols.forEach(p => io(t => { t.classList.add('in'); tick(); }).observe(p));

  // mood wall scrub / cycle
  const moods = $$('#mood-stack img');
  const label = $('#mood-label');
  let mi = 0;
  const setMood = (i) => {
    mi = Math.max(0, Math.min(moods.length - 1, i));
    moods.forEach((m, k) => m.classList.toggle('on', k === mi));
    label.textContent = C.ACT2.moods[mi].label;
  };
  setMood(0);
  if (hasGSAP) {
    const wall = $('#moods');
    const spacer = document.createElement('div');
    spacer.style.height = `${moods.length * 22}vh`;
    wall.insertAdjacentElement('afterend', spacer);
    ScrollTrigger.create({
      trigger: spacer, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => setMood(Math.round(self.progress * (moods.length - 1))),
    });
  } else {
    io(() => {}, {}).observe($('#moods'));
    const cyc = setInterval(() => setMood((mi + 1) % moods.length), 1800);
    setTimeout(() => clearInterval(cyc), 120000);
  }

  // ── ACT 3 phone pieces ──
  const pieces = $$('#phone-screen .pp');
  io(() => pieces.forEach((p, i) => setTimeout(() => { p.classList.add('in'); tick(); }, i * 220)), { threshold: 0.2 })
    .observe($('#phone'));

  // chat replay + THE TURN
  let chatDone = false;
  io(() => {
    if (chatDone) return; chatDone = true;
    audio?.setEnergy(0.45);
    audio?.startMusic();
    const bubs = $$('#chat .bub');
    bubs.forEach((b, i) => setTimeout(() => { b.classList.add('in'); tick(); }, 500 + i * 1100));
    setTimeout(() => { $('#tl1').classList.add('in'); }, 500 + bubs.length * 1100 + 700);
    setTimeout(() => { $('#tl2').classList.add('in'); audio?.setEnergy(0.6); }, 500 + bubs.length * 1100 + 2400);
  }, { threshold: 0.5 }).observe($('#chat'));

  // ── ACT 4 ──
  const curve = $('#thread-curve');
  const len = curve.getTotalLength();
  curve.style.strokeDasharray = len; curve.style.strokeDashoffset = len;
  const km = $('#km');
  const setStats = () => $('#stats').classList.add('in');
  const setThesis = () => $$('.thesis .big-line').forEach(l => l.classList.add('in'));
  if (hasGSAP) {
    $('#act4').style.height = '420vh';
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#act4', start: 'top top', end: 'bottom bottom', scrub: 0.5 },
    });
    tl.fromTo('#moon-shared', { xPercent: 130, yPercent: 115 }, { xPercent: -50, yPercent: -50, duration: 3, ease: 'sine.inOut' }, 0.4)
      .to(curve, { strokeDashoffset: 0, duration: 4.5, ease: 'none' }, 1.4)
      .to({}, { duration: 0.01, onStart: setThesis }, 4.6)
      .to({}, { duration: 0.01, onStart: setStats }, 5.6)
      .to('#km', { opacity: 0, duration: 0.6 }, 4.9);
    ScrollTrigger.create({
      trigger: '#act4', start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, (self.progress * 1.45) - 0.12));
        km.textContent = Math.round(p * C.ACT4.kmMax).toLocaleString('en-IN') + ' km';
      },
      onEnter: () => audio?.setEnergy(0.75),
    });
  } else {
    curve.style.strokeDashoffset = 0;
    km.textContent = C.ACT4.kmMax.toLocaleString('en-IN') + ' km';
    io(setThesis, { threshold: 0.3 }).observe($('.thesis'));
    io(setStats).observe($('#stats'));
  }

  // ── ACT 5 ──
  io(t => {
    t.classList.add('in');
    setTimeout(() => audio?.sfx('whoosh'), 1700);
    setTimeout(() => audio?.sfx('stamp'), 2500);
    setTimeout(() => audio?.setEnergy(0.85), 800);
  }, { threshold: 0.35 }).observe($('#hand-wrap'));

  // ── ACT 6 letter ──
  const lines = $$('#letter p:not(.sign):not(.ps)');
  io(() => lines.forEach((l, i) => setTimeout(() => { l.classList.add('in'); }, i * 850)), { threshold: 0.12 }).observe($('#letter'));
  $$('#letter .sign, #letter .ps').forEach(p => p.classList.add('in'));

  // END screen
  io(t => {
    t.classList.add('in');
    audio?.setEnergy(1);
    startPetals();
  }, { threshold: 0.4 }).observe($('#end'));

  // certificate
  $('#btn-cert').addEventListener('click', openCert);
  $('#cert-close').addEventListener('click', () => $('#cert-modal').classList.add('hidden'));
}

// ── petals at the end ───────────────────────────────────────
function startPetals() {
  if (startPetals.done) return; startPetals.done = true;
  const cv = $('#petals'), ctx = cv.getContext('2d');
  const fit = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
  fit(); addEventListener('resize', fit);
  const colors = ['#C4453A', '#D9A441', '#F2E8D5', '#a8362e'];
  const P = Array.from({ length: 42 }, () => ({
    x: Math.random(), y: Math.random(), r: 3 + Math.random() * 5,
    vy: 0.35 + Math.random() * 0.75, ph: Math.random() * 6.28, sw: 0.4 + Math.random() * 1.2,
    c: colors[(Math.random() * colors.length) | 0], a: 0.5 + Math.random() * 0.5,
  }));
  let t = 0;
  (function loop() {
    if (!document.body.contains(cv)) return;
    t += 0.016;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of P) {
      p.y += p.vy / 600; p.ph += 0.02;
      if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
      const x = (p.x + Math.sin(p.ph) * 0.018 * p.sw) * cv.width;
      ctx.save(); ctx.translate(x, p.y * cv.height); ctx.rotate(Math.sin(t + p.ph) * 0.9);
      ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.29); ctx.fill(); ctx.restore();
    }
    requestAnimationFrame(loop);
  })();
}

// ── certificate ─────────────────────────────────────────────
async function openCert() {
  const modal = $('#cert-modal'), cv = $('#cert-canvas'), ctx = cv.getContext('2d');
  modal.classList.remove('hidden');
  try { await document.fonts.ready; } catch {}
  const W = cv.width, H = cv.height, cx = W / 2;
  ctx.fillStyle = '#06060B'; ctx.fillRect(0, 0, W, H);
  // borders
  const gold = '#D9A441';
  ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.strokeRect(50, 50, W - 100, H - 100);
  ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
  // moon
  ctx.fillStyle = '#F2E8D5'; ctx.beginPath(); ctx.arc(cx, 240, 78, 0, 6.29); ctx.fill();
  ctx.fillStyle = '#06060B'; ctx.beginPath(); ctx.arc(cx + 34, 214, 70, 0, 6.29); ctx.fill();
  ctx.fillStyle = gold;
  const F = (f, s, col = '#F2E8D5') => { ctx.font = `${f} ${s}px ${col ? '' : ''}`; };
  const center = (txt, font, y, color = '#F2E8D5', spacing = 0) => {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center';
    if (spacing) {
      const chars = [...txt]; const total = ctx.measureText(txt).width + spacing * (chars.length - 1);
      let x = cx - total / 2;
      ctx.textAlign = 'left';
      for (const ch of chars) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + spacing; }
    } else ctx.fillText(txt, cx, y);
  };
  center(C.ACT6.cert.title, '700 92px "Fraunces"', 470, gold);
  center(C.ACT6.cert.id, '400 34px "Space Mono"', 530, '#8E8CA3', 6);
  let y = 660;
  for (const l of C.ACT6.cert.lines) {
    const isName = l.startsWith('D I');
    center(l, isName ? '700 110px "Fraunces"' : '400 44px "Space Grotesk"', y, isName ? '#F2E8D5' : '#bdb9d0');
    y += isName ? 130 : 74;
  }
  // seal
  ctx.strokeStyle = '#C4453A'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(cx, y + 90, 74, 0, 6.29); ctx.stroke();
  ctx.fillStyle = '#C4453A'; ctx.font = '700 30px "Space Mono"'; ctx.textAlign = 'center';
  ctx.fillText('EK HI', cx, y + 80); ctx.fillText('CHAAND', cx, y + 118);
  // sign + footer
  ctx.fillStyle = '#D9A441'; ctx.font = '400 54px "Kalam"'; ctx.textAlign = 'center';
  ctx.fillText(C.ACT6.cert.sign, cx, H - 220);
  ctx.fillStyle = '#8E8CA3'; ctx.font = '400 28px "Space Mono"';
  ctx.fillText(C.ACT6.cert.footer, cx, H - 120);
  $('#cert-dl').href = cv.toDataURL('image/png');
}
