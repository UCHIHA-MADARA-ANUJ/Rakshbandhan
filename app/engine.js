// ═══════════════════════════════════════════════════════════
//  THE ENGINE — morphing particle field (RESONATE-class)
//  particles form text/shapes, tear apart under your finger,
//  regroup, and kick with every note of the score.
// ═══════════════════════════════════════════════════════════
const fine = typeof matchMedia !== 'undefined' && matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAL = ['#F2E8D5', '#F2E8D5', '#D9A441', '#C4453A', '#8E8CA3'];

export class Engine {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.N = fine ? 560 : 280;
    this.targets = null;
    this.formation = formations.ring;
    this.ptr = { x: -9e3, y: -9e3, on: false };
    this.run = true;
    this.fit = this.fit.bind(this);
    this.fit();
    addEventListener('resize', () => { this.fit(); this.retarget(); });
    addEventListener('pointermove', (e) => {
      const r = this.cv.getBoundingClientRect();
      this.ptr.x = e.clientX - r.left; this.ptr.y = e.clientY - r.top; this.ptr.on = true;
    }, { passive: true });
    addEventListener('pointerleave', () => { this.ptr.on = false; });
    document.addEventListener('visibilitychange', () => {
      this.run = !document.hidden; if (this.run) this.loop();
    });
    this.spawn();
    if (!reduced) this.loop();
  }

  fit() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.W = innerWidth; this.H = innerHeight;
    this.cv.width = this.W * dpr; this.cv.height = this.H * dpr;
    this.cv.style.width = this.W + 'px'; this.cv.style.height = this.H + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  spawn() {
    this.P = Array.from({ length: this.N }, () => ({
      x: Math.random() * this.W, y: Math.random() * this.H,
      vx: 0, vy: 0,
      r: 0.7 + Math.random() * 1.7,
      c: PAL[(Math.random() * PAL.length) | 0],
      a: 0.35 + Math.random() * 0.6,
      ph: Math.random() * 6.28,
    }));
  }

  setFormation(fn) { this.formation = fn; this.retarget(); }
  burstFree() { this.targets = null; }
  retarget() {
    if (!this.formation) return;
    const t = this.formation(this.W, this.H, this.N);
    this.targets = t;
  }
  kick(v = 0.5) {
    const cx = this.ptr.on ? this.ptr.x : this.W / 2;
    const cy = this.ptr.on ? this.ptr.y : this.H / 2;
    for (const p of this.P) {
      const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
      const f = (v * 3) / Math.max(70, d);
      p.vx += (dx / d) * f; p.vy += (dy / d) * f;
    }
  }

  loop() {
    if (!this.run) return;
    const { ctx, W, H, P, targets, ptr } = this;
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() / 1000;
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (targets && targets[i]) {
        p.vx += (targets[i].x - p.x) * 0.016;
        p.vy += (targets[i].y - p.y) * 0.016;
      } else {
        p.vx += Math.sin(t * 0.6 + p.ph) * 0.004;
        p.vy += Math.cos(t * 0.5 + p.ph) * 0.004;
      }
      if (ptr.on) {
        const dx = p.x - ptr.x, dy = p.y - ptr.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12100) { // 110px — finger tears the field apart
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 110) * 1.5;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
      }
      p.vx *= 0.88; p.vy *= 0.88;
      p.x += p.vx; p.y += p.vy;
      p.ph += 0.02;
      const a = p.a * (0.75 + 0.25 * Math.sin(p.ph * 2));
      ctx.globalAlpha = a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.loop());
  }
}

// ── formation samplers (return [{x,y}, ...]) ────────────────
function pick(cands, n) {
  if (cands.length <= n) return cands;
  const out = []; const step = cands.length / n;
  for (let i = 0; i < n; i++) out.push(cands[Math.floor(i * step)]);
  return out;
}

function samplePoints(draw, W, H, n) {
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const c = off.getContext('2d');
  draw(c, W, H);
  const data = c.getImageData(0, 0, W, H).data;
  const cands = [];
  const step = W > 700 ? 5 : 4;
  for (let y = 0; y < H; y += step)
    for (let x = 0; x < W; x += step)
      if (data[(y * W + x) * 4 + 3] > 120) cands.push({ x, y });
  return pick(cands, n);
}

export const formations = {
  ring: (W, H) => {
    const n = 240, r = Math.min(W, H) * 0.30, out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283;
      out.push({ x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r * 0.92 });
    }
    return out;
  },
  text: (lines, opts = {}) => (W, H, N) => {
    const fam = opts.font || '700 100px sans-serif';
    const size = Math.min(H * (opts.size || 0.16), W * 0.24);
    return samplePoints((c) => {
      c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = fam.replace(/\d+px/, `${Math.round(size)}px`);
      const lh = size * 1.12;
      const y0 = H / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => c.fillText(l, W / 2, y0 + i * lh));
    }, W, H, Math.floor(N * 0.82));
  },
  halo: (W, H) => {
    const n = 300, rx = Math.min(W, H) * 0.40, ry = Math.min(W, H) * 0.46, out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + Math.sin(i) * 0.2;
      out.push({ x: W / 2 + Math.cos(a) * rx * (0.94 + 0.06 * Math.sin(i * 3)), y: H / 2 + Math.sin(a) * ry });
    }
    return out;
  },
  edge: (W, H) => { // particles retreat to a frame around the content
    const n = 260, m = 60, out = [];
    for (let i = 0; i < n; i++) {
      const side = i % 4, f = (Math.floor(i / 4) / (n / 4));
      const pad = m;
      if (side === 0) out.push({ x: pad + f * (W - 2 * pad), y: pad });
      else if (side === 1) out.push({ x: W - pad, y: pad + f * (H - 2 * pad) });
      else if (side === 2) out.push({ x: W - pad - f * (W - 2 * pad), y: H - pad });
      else out.push({ x: pad, y: H - pad - f * (H - 2 * pad) });
    }
    return out;
  },
  cities: (W, H) => { // two clusters + a thread arcing between + one moon
    const out = [];
    const blob = (cx, cy, r, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, rr = r * (0.35 + Math.random() * 0.65);
        out.push({ x: cx + Math.cos(a) * rr * 1.5, y: cy + Math.sin(a) * rr * 0.6 });
      }
    };
    blob(W * 0.5, H * 0.16, Math.min(W, H) * 0.16, 90);   // gurugram
    blob(W * 0.5, H * 0.84, Math.min(W, H) * 0.16, 90);   // mumbai
    // thread curve
    const x0 = W * 0.5, y0 = H * 0.20, x1 = W * 0.5, y1 = H * 0.80;
    for (let i = 0; i <= 46; i++) {
      const t = i / 46;
      const mx = W * (0.5 + 0.30 * Math.sin(t * 3.14));
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
      const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (H * 0.5) + t * t * y1;
      out.push({ x, y });
    }
    // moon on the thread
    const mc = { x: W * 0.5 + W * 0.30 * Math.sin(0.62 * 3.14), y: H * 0.5 + H * 0.10 };
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * 6.283, r = Math.min(W, H) * 0.055;
      out.push({ x: mc.x + Math.cos(a) * r, y: mc.y + Math.sin(a) * r });
    }
    return out;
  },
  wrist: (W, H) => { // dense convergence — the rakhi point
    const out = [], n = 300, cx = W / 2, cy = H * 0.42;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, r = Math.pow(Math.random(), 0.5) * Math.min(W, H) * 0.07;
      out.push({ x: cx + Math.cos(a) * r * 1.4, y: cy + Math.sin(a) * r });
    }
    return out;
  },
  calm: (W, H) => { // wide slow drift field for the letter
    const out = [], n = 200;
    for (let i = 0; i < n; i++) out.push({ x: Math.random() * W, y: Math.random() * H });
    return out;
  },
};
