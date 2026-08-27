'use client';
// ═══════════════════════════════════════════════════════════
//  CHROME — global system: particle sky, nav, audio, prev/next
//  (every page lives inside this)
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

// ── audio singleton ──
let A = null;
export const getAudio = () => A;
const ENERGY = { '/': 0.16, '/dossier': 0.2, '/scanner': 0.3, '/transmission': 0.45, '/distance': 0.55, '/ritual': 0.7, '/letter': 0.5, '/finale': 1, '/archive': 0.25 };

export function useReveals() {
  useEffect(() => {
    const flips = document.querySelectorAll('.flip');
    if (flips.length) {
      gsap.fromTo(flips, { y: 110, opacity: 0, rotateX: -70, skewY: 5 },
        { y: 0, opacity: 1, rotateX: 0, skewY: 0, duration: 1.3, stagger: 0.1, ease: 'power4.out' });
    }
    document.querySelectorAll('.gcard').forEach((card) => {
      gsap.fromTo(card, { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%' } });
    });
    const evs = document.querySelectorAll('.evcard');
    if (evs.length) {
      gsap.fromTo(evs, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out' });
    }
  }, []);
}

export default function Chrome({ children }) {
  const path = usePathname();
  const [muted, setMuted] = useState(false);
  const idx = C.ROUTES.findIndex((r) => r.path === path);
  const prev = idx > 0 ? C.ROUTES[idx - 1] : null;
  const next = idx >= 0 && idx < C.ROUTES.length - 1 ? C.ROUTES[idx + 1] : null;

  // audio unlock + per-route energy
  useEffect(() => {
    const init = async () => {
      if (A) return;
      const { Baarishein } = await import('./audio.js');
      A = new Baarishein();
      await A.unlock();
      A.onPulse = (v) => setAudioLevel(Math.min(1, v * 1.5));
      A.setEnergy(ENERGY[path] ?? 0.2);
    };
    addEventListener('pointerdown', init, { once: true });
    return () => removeEventListener('pointerdown', init);
  }, []);
  useEffect(() => { if (A) A.setEnergy(ENERGY[path] ?? 0.2); }, [path]);

  const toggleMute = () => { if (!A) return; A.setMuted(!A.muted); setMuted(A.muted); };

  return (
    <>
      <div className="bg-noise" />
      <div className="scanline" />
      <ParticleField />

      <header className="topnav">
        <a href="/" className="brand">RAKHI<span className="gold">.</span>PROTOCOL_</a>
        <nav className="navlinks">
          {C.ROUTES.map((r, i) => (
            <a key={r.path} href={r.path} className={r.path === path ? 'on' : ''}>
              {r.short || r.tag}
            </a>
          ))}
        </nav>
        <button id="mute" onClick={toggleMute} aria-label="sound">{muted ? '🔇' : '🔊'}</button>
      </header>

      {children}

      {idx >= 0 && (
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
