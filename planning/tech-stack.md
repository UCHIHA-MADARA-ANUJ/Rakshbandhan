# ⚙️ TECH STACK — the answer, with reasons

## Language & framework (the direct answer)
- **HTML5 + CSS3 + vanilla JavaScript (ES2022 modules). NO framework. No React, no Next, no Tailwind.**
- **Why:** this is a linear, cinematic, one-page experience. A framework adds ~45–140KB of
  runtime and a virtual DOM we'd fight against — GSAP needs direct DOM control every frame.
  You (web dev) will be able to read every line and tweak copy yourself in one file.
- **Bundler: Vite** — dev server + hashed builds + image pipeline. Build output = plain static files.

## Libraries (only 4, each earning its KB)
| Lib | Size | Job |
|---|---|---|
| **GSAP + ScrollTrigger** | ~70KB | the entire scroll-cinema: pinned acts, scrubbed moon/thread/typography |
| **Lenis** | ~10KB | inertial smooth scroll (desktop), native scroll on touch |
| **Howler.js** | ~30KB | audio: ambience loop, music ducking under voice note, iOS unlock |
| **Canvas 2D (hand-rolled, 0KB)** | 0 | starfield, moon glow, petals — no Three.js. Night sky in 2D canvas ≈ 150 lines at 60fps; Three.js would cost 600KB+ to draw the same sky. Rejected on purpose. |

## Fonts (self-hosted woff2, latin subset, ~180KB)
Fraunces (display) · Space Grotesk (UI) · Space Mono (stamps/exhibits) · Kalam (letter)

## Architecture
```
src/
  acts/act1-wanted.js … act6-letter.js   ← each act = a GSAP scene module
  core/director.js      ← master timeline, scroll orchestration
  core/audio.js         ← Howler manager (ambience/music/voice, ducking)
  core/gate.js          ← the name-gate logic + reactions
  core/easter-eggs.js
  data/content.js       ← ⭐ ALL text, photos, captions in ONE file — you edit here, never in components
public/assets/
  photos/ (AVIF q45 + WebP fallback, 1600px long edge, ~80KB each)
  audio/ (opus/m4a, ambience ~150KB, music ~200KB, voice ~40KB)
```
- Single `index.html`, acts mounted as sections, preloaded via moon progress bar.
- Photos lazy-loaded by IntersectionObserver with LQIP blur-up.
- `prefers-reduced-motion` → static readable version. `navigator.connection.saveData` respected.

## Performance budget (Indian 4G, mid-range Android = the real device)
- First screen ≤ **1.5MB**, LCP ≤ 2.5s, 60fps scroll, total media ≤ 6MB *lazily* loaded.
- All 37 photos batch-processed (ffmpeg/PIL): grade → grain (CSS overlay, not baked) → AVIF/WebP.

## Deployment
- **Cloudflare Pages** (free, fast Indian edge, clean URLs) → unlisted slug + `noindex` + robots.
- Optional custom domain (`ekhichaand.in`, ~₹800/2yr) — decide AFTER the site works; certificate gets the domain printed on it either way.

## Deliverable to you
- `dist/` static folder + preview link you open on your phone at every stage.
