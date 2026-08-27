'use client';
// ═══════════════════════════════════════════════════════════
//  CHROME v3 — veil, page wipes, cursor, clock, nav, audio
// ═══════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setAudioLevel } from './particles.jsx';

const ParticleField = dynamic(() => import('./particles.jsx'), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

import * as C from './content.js';

let A = null;
export const getAudio = () => A;
const ENERGY = { '/': 0.16, '/dossier': 0.2, '/scanner': 0.3, '/transmission': 0.45, '/distance': 0.55, '/timeline': 0.28, '/ritual': 0.7, '/letter': 0.5, '/finale': 1, '/archive': 0.25 };
const TITLES = { '/': 'SIGNAL', '/dossier': 'DOSSIER', '/scanner': 'SCANNER', '/transmission': 'TRANSMISSION', '/distance': 'DISTANCE', '/ritual': 'THE RITUAL', '/letter': 'THE LETTER', '/finale': 'FINALE', '/archive': 'ARCHIVE', '/timeline': 'ORIGIN' };

export const toast = (msg, ms = 2600) => {
  let el = document.getElementById('rk-toast');
  if (!el) {
    el = document.createElement('div'); el.id = 'rk-toast';
    el.style.cssText = 'position:fixed;bottom:86px;left:50%;transform:translate(-50%,16px);' +
      'background:rgba(5,3,6,.92);border:1px solid #D9A441;color:#E8E3D8;padding:13px 22px;border-radius:2px;' +
      'font-family:monospace;font-size:.74rem;letter-spacing:.12em;z-index:400;opacity:0;transition:all .35s;pointer-events:none;max-width:86vw;text-align:center';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = 'translate(-50%,0)'; });
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translate(-50%,16px)'; }, ms);
};

const initAudio = async () => {
  if (A) { if (A.ctx?.state === 'suspended') await A.ctx.resume(); return; }
  const { Baarishein } = await import('./audio.js');
  A = new Baarishein();
  await A.unlock();
  A.onPulse = (v) => setAudioLevel(Math.min(1, v * 1.5));
  // optional: if bhai drops a real track at public/audio/music.mp3, it replaces the plucks
  try { if (await A.attachMusic('/audio/music.mp3')) A.startMusic(); } catch {}
};

export function useReveals() {
  useEffect(() => {
    const flips = document.querySelectorAll('.flip');
    if (flips.length) gsap.fromTo(flips, { y: 110, opacity: 0, rotateX: -70, skewY: 5 },
      { y: 0, opacity: 1, rotateX: 0, skewY: 0, duration: 1.3, stagger: 0.1, ease: 'power4.out' });
    document.querySelectorAll('.gcard').forEach((card) => {
      gsap.fromTo(card, { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%' } });
    });
    const evs = document.querySelectorAll('.evcard');
    if (evs.length) gsap.fromTo(evs, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out' });
    // text-decode the gold labels
    document.querySelectorAll('.hud-txt.gold').forEach((el) => {
      const txt = el.textContent;
      if (!txt || txt.length > 60) return;
      let f = 0; const total = 16;
      const iv = setInterval(() => {
        f++;
        const rev = Math.floor((f / total) * txt.length);
        el.textContent = [...txt].map((ch, i) => (ch === ' ' ? ' ' : (i < rev ? ch : '!<>-_#/[]{}=+*^?'[(Math.random() * 22) | 0]))).join('');
        if (f >= total) { clearInterval(iv); el.textContent = txt; }
      }, 26);
    });
  }, []);
}

function Cursor() {
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const dot = document.createElement('div'); dot.id = 'cur';
    const ring = document.createElement('div'); ring.id = 'curg';
    document.body.append(dot, ring);
    let mx = -100, my = -100, gx = -100, gy = -100;
    const mm = (e) => { mx = e.clientX; my = e.clientY; };
    const ov = (e) => ring.classList.toggle('big', !!e.target.closest('a,button,input,.mood-stack,.hold-btn,[data-moon]'));
    addEventListener('pointermove', mm, { passive: true });
    addEventListener('pointerover', ov, { passive: true });
    let last = 0;
    (function c(t) {
      gx += (mx - gx) * 0.16; gy += (my - gy) * 0.16;
      dot.style.transform = `translate(${mx}px,${my}px)`;
      ring.style.transform = `translate(${gx}px,${gy}px)`;
      requestAnimationFrame(c);
    })();
    const dn = () => ring.classList.add('down'), up = () => ring.classList.remove('down');
    addEventListener('pointerdown', dn); addEventListener('pointerup', up);
    return () => { dot.remove(); ring.remove(); removeEventListener('pointermove', mm); removeEventListener('pointerover', ov); };
  }, []);
  return null;
}

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    f(); const iv = setInterval(f, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span className="navclock hud-txt">PUNE {t} IST</span>;
}

export default function Chrome({ children }) {
  const path = usePathname();
  const [muted, setMuted] = useState(false);
  const [locked, setLocked] = useState(true);
  const [menu, setMenu] = useState(false);
  const wiped = useRef(false);
  const idx = C.ROUTES.findIndex((r) => r.path === path);
  const prev = idx > 0 ? C.ROUTES[idx - 1] : null;
  const next = idx >= 0 && idx < C.ROUTES.length - 1 ? C.ROUTES[idx + 1] : null;

  // site lock: everything except / requires the gate
  useEffect(() => {
    const ok = sessionStorage.getItem('rk_ok') === '1';
    if (!ok && path !== '/') { location.replace('/'); return; }
    setLocked(!ok);
    const onUnlock = () => setLocked(false);
    addEventListener('rk-unlocked', onUnlock);
    return () => removeEventListener('rk-unlocked', onUnlock);
  }, [path]);

  // incoming wipe + tab title
  useEffect(() => {
    document.title = `${TITLES[path] || 'SIGNAL'} — RAKHI.PROTOCOL`;
    if (A) A.setEnergy(ENERGY[path] ?? 0.2);
    if (sessionStorage.getItem('rk_wipe')) {
      sessionStorage.removeItem('rk_wipe');
      document.body.classList.add('wipe-in');
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('wipe-in')));
    }
  }, [path]);

  // link interception: cinematic wipe + dead-link guard
  useEffect(() => {
    const h = (e) => {
      const a = e.target.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href === '#') {
        e.preventDefault();
        toast('⚠ this button needs bhai\'s number — remind him 😅');
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;
      e.preventDefault();
      if (wiped.current) return; wiped.current = true;
      A?.sfx('whoosh');
      document.body.classList.add('wiping');
      setTimeout(() => {
        sessionStorage.setItem('rk_wipe', '1');
        location.href = href;
      }, 560);
    };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, []);

  // eggs + audio on first gesture (fallback if veil skipped)
  useEffect(() => {
    const init = async () => {
      await initAudio();
      if (!A) return;
      A.setEnergy(ENERGY[path] ?? 0.2);
      import('./eggs.js').then((m) => m.initEggs({
        sfx: (k) => A.sfx(k),
        onGallery: () => { location.href = '/archive'; },
      }));
    };
    addEventListener('pointerdown', init, { once: true });
    return () => removeEventListener('pointerdown', init);
  }, []);

  const toggleMute = () => { if (!A) return; A.setMuted(!A.muted); setMuted(A.muted); };

  return (
    <>
      <div className="skyline-bg" aria-hidden="true" />
      <div className="bg-noise" />
      <div className="scanline" />
      <ParticleField />
      <Cursor />

      <div id="wipe" aria-hidden="true"><i /></div>

      {menu && (
        <div id="routemenu" onClick={() => setMenu(false)}>
          <p className="hud-txt gold">PICK A SEQUENCE</p>
          {C.ROUTES.concat([{ path: '/archive', tag: 'ARCHIVE', short: 'ARCHIVE' }]).map((r, i) => (
            <a key={r.path} href={r.path} className={r.path === path ? 'on' : ''} onClick={() => setMenu(false)}>
              <span className="rm-n">0{i}</span>
              <span className="rm-t">{r.tag}</span>
            </a>
          ))}
          <button className="lb-close" onClick={() => setMenu(false)}>CLOSE ✕</button>
        </div>
      )}

      {!locked && (<header className="topnav">
        <a href="/" className="brand">RAKHI<span className="gold">.</span>PROTOCOL_</a>
        <Clock />
        <nav className="navlinks">
          {C.ROUTES.map((r) => (
            <a key={r.path} href={r.path} className={r.path === path ? 'on' : ''}>
              {r.short || r.tag}
            </a>
          ))}
        </nav>
        <button id="menubtn" onClick={() => setMenu(true)} aria-label="sequences">≡</button>
        <button id="mute" onClick={toggleMute} aria-label="sound">{muted ? '🔇' : '🔊'}</button>
      </header>)}

      {children}

      {idx >= 0 && !locked && (
        <footer className="pagenav">
          {prev ? <a className="pn-btn" href={prev.path}>← {prev.short || prev.tag}</a> : <span />}
          <span className="pn-idx hud-txt">{String(idx).padStart(2, '0')} / {String(C.ROUTES.length - 1).padStart(2, '0')}</span>
          {next ? <a className="pn-btn next" href={next.path}>{next.short || next.tag} →</a> : <span />}
        </footer>
      )}
      <div id="flicker" aria-hidden="true" />
    </>
  );
}
