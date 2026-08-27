// ═══════════════════════════════════════════════════════════
//  FX — the alive layer
//  starfield (pointer gravity + scroll streaks + music bursts)
//  custom cursor · ripples · text decode · 3D tilt · magnets
// ═══════════════════════════════════════════════════════════
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAL = ['#F2E8D5', '#D9A441', '#C4453A', '#8E8CA3'];

let field = null;

// ── STARFIELD ───────────────────────────────────────────────
export function initStarfield() {
  if (document.getElementById('fx-stars')) return;
  const cv = document.createElement('canvas');
  cv.id = 'fx-stars';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W, H, dpr;
  const fit = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit(); addEventListener('resize', fit);

  const N = (fine ? 170 : 95) | 0;
  const P = Array.from({ length: N }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    z: 0.25 + Math.random() * 0.75,           // depth
    vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
    r: 0.6 + Math.random() * 1.6,
    c: PAL[(Math.random() * PAL.length) | 0],
    tw: Math.random() * 6.28,
  }));

  const ptr = { x: -9e3, y: -9e3, on: false };
  addEventListener('pointermove', (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; }, { passive: true });
  addEventListener('pointerleave', () => { ptr.on = false; });

  let scrollV = 0, lastY = scrollY;
  addEventListener('scroll', () => {
    scrollV = Math.max(-30, Math.min(30, (scrollY - lastY) * 0.4));
    lastY = scrollY;
  }, { passive: true });

  field = {
    burst(v = 0.5) {
      const cx = ptr.on ? ptr.x : W / 2, cy = ptr.on ? ptr.y : H / 2;
      for (const p of P) {
        const dx = p.x - cx, dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const f = (v * 2.4) / Math.max(60, d);
        p.vx += (dx / d) * f; p.vy += (dy / d) * f;
      }
    },
  };

  let run = true;
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) loop(); });

  function loop() {
    if (!run) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      // pointer gravity — gentle pull + swirl
      if (ptr.on && fine) {
        const dx = ptr.x - p.x, dy = ptr.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 162) * 0.06 * p.z;
          p.vx += (dx / d) * f - (dy / d) * f * 0.7; // pull + orbit
          p.vy += (dy / d) * f + (dx / d) * f * 0.7;
        }
      }
      p.vx *= 0.94; p.vy *= 0.94;
      p.vx += (Math.random() - 0.5) * 0.012; p.vy += (Math.random() - 0.5) * 0.012;
      p.x += p.vx + 0; p.y += p.vy - scrollV * 0.02 * p.z;
      p.tw += 0.03;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

      const streak = Math.min(14, Math.abs(scrollV) * 0.5 * p.z);
      const a = (0.25 + 0.55 * p.z) * (0.7 + 0.3 * Math.sin(p.tw));
      if (streak > 2) {
        ctx.strokeStyle = p.c; ctx.globalAlpha = a * 0.8; ctx.lineWidth = p.r;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + (scrollV > 0 ? streak : -streak)); ctx.stroke();
      } else {
        ctx.fillStyle = p.c; ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.z, 0, 6.29); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    scrollV *= 0.9;
    requestAnimationFrame(loop);
  }
  if (!reduced) loop(); else { // static sky
    for (const p of P) { ctx.fillStyle = p.c; ctx.globalAlpha = 0.3 + 0.4 * p.z; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill(); }
  }
}

export function burstField(v) { field?.burst(v); }

// ── CURSOR + RIPPLES ────────────────────────────────────────
export function initCursor() {
  if (fine) {
    const dot = document.createElement('div'); dot.id = 'cur';
    const ring = document.createElement('div'); ring.id = 'curg';
    document.body.append(dot, ring);
    let mx = -100, my = -100, gx = -100, gy = -100;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const hoverSel = 'a,button,input,[data-moon],.polaroid,.pp,.mood-stack';
    addEventListener('pointerover', (e) => { ring.classList.toggle('big', !!e.target.closest(hoverSel)); }, { passive: true });
    (function c() {
      gx += (mx - gx) * 0.16; gy += (my - gy) * 0.16;
      dot.style.transform = `translate(${mx}px,${my}px)`;
      ring.style.transform = `translate(${gx}px,${gy}px)`;
      requestAnimationFrame(c);
    })();
    document.documentElement.classList.add('fine-cursor');
  }
  addEventListener('pointerdown', (e) => {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  }, { passive: true });
}

// ── TEXT DECODE ─────────────────────────────────────────────
const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
export function scramble(el, speed = 26) {
  if (!el || reduced || el._scrambling) return;
  const txt = el.dataset.txt || (el.dataset.txt = el.textContent);
  el._scrambling = true;
  let frame = 0;
  const total = Math.max(14, txt.length + 10);
  const iv = setInterval(() => {
    frame++;
    const reveal = Math.floor((frame / total) * txt.length);
    let out = '';
    for (let i = 0; i < txt.length; i++) {
      if (txt[i] === ' ') { out += ' '; continue; }
      out += i < reveal ? txt[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (frame >= total) { clearInterval(iv); el.textContent = txt; el._scrambling = false; }
  }, speed);
}

// ── 3D TILT ─────────────────────────────────────────────────
export function initTilt() {
  if (!fine || reduced) return;
  document.querySelectorAll('.polaroid, #phone, .hand-frame').forEach((el) => {
    el.addEventListener('pointerenter', () => { el.style.transition = 'transform .12s ease-out'; });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rot = el.classList.contains('polaroid') ? ' rotate(var(--rot,0deg))' : '';
      el.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)${rot}`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.2,1.4,.3,1)';
      el.style.transform = '';
    });
  });
}

// ── MAGNETIC BUTTONS ────────────────────────────────────────
export function magnetize(els) {
  if (!fine || reduced) return;
  els.forEach((el) => {
    if (el._magnet) return; el._magnet = true;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.22}px,${dy * 0.28}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// ── SCROLL VELOCITY SKEW ────────────────────────────────────
export function initSkew(sel) {
  const el = document.querySelector(sel);
  if (!el || reduced) return;
  let cur = 0, target = 0, lastY = scrollY, raf = null;
  addEventListener('scroll', () => {
    target = Math.max(-5, Math.min(5, (scrollY - lastY) * 0.06));
    lastY = scrollY;
    if (!raf) raf = requestAnimationFrame(damp);
  }, { passive: true });
  function damp() {
    cur += (target - cur) * 0.12;
    target *= 0.9;
    el.style.transform = `skewY(${cur.toFixed(2)}deg)`;
    raf = (Math.abs(cur) > 0.05 || Math.abs(target) > 0.05) ? requestAnimationFrame(damp) : null;
  }
}
