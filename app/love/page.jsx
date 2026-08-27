'use client';
import { useEffect, useRef } from 'react';
import * as C from '../content.js';
import { getAudio, toast } from '../chrome.jsx';
import { setAudioLevel } from '../particles.jsx';

export default function Love() {
  const cvRef = useRef(null);
  const boomed = useRef(false);

  useEffect(() => {
    document.getElementById('love-box')?.classList.add('in');
    const t = setTimeout(() => setAudioLevel(1), 800);
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const fit = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    fit(); addEventListener('resize', fit);

    // drifting emojis + petals + fireworks, all in one sky
    const EMO = ['🤍', '🌙', '✨', '🤍', '❤️', '🥹', '💫'];
    const drift = Array.from({ length: 16 }, () => ({
      e: EMO[(Math.random() * EMO.length) | 0],
      x: Math.random(), y: Math.random(),
      vy: 0.1 + Math.random() * 0.22, ph: Math.random() * 6.28, s: 14 + Math.random() * 18,
    }));
    const FW = [];
    window._loveBoom = () => {
      for (let b = 0; b < 3; b++) {
        const bx = cv.width * (0.15 + Math.random() * 0.7), by = cv.height * (0.1 + Math.random() * 0.4);
        const col = ['#FF2E4D', '#D9A441', '#F2E8D5'][(Math.random() * 3) | 0];
        for (let k = 0; k < 52; k++) {
          const a = (k / 52) * 6.29, sp = 1.6 + Math.random() * 3;
          FW.push({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: Math.random() < 0.8 ? col : '#fff' });
        }
      }
    };
    const iv = setInterval(() => { window._loveBoom?.(); }, 2200);
    setTimeout(() => window._loveBoom?.(), 1400);

    let t2 = 0;
    (function loop() {
      t2 += 0.016;
      ctx.clearRect(0, 0, cv.width, cv.height);
      // rising emojis
      ctx.textAlign = 'center';
      for (const d of drift) {
        d.y -= d.vy / 900; d.ph += 0.015;
        if (d.y < -0.06) { d.y = 1.06; d.x = Math.random(); }
        ctx.globalAlpha = 0.5 + 0.4 * Math.sin(d.ph * 2);
        ctx.font = `${d.s}px serif`;
        ctx.fillText(d.e, (d.x + Math.sin(d.ph) * 0.02) * cv.width, d.y * cv.height);
      }
      // fireworks
      for (const s of FW) {
        s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.vx *= 0.985; s.life -= 0.011;
        if (s.life > 0) {
          ctx.globalAlpha = Math.max(0, s.life); ctx.fillStyle = s.c;
          ctx.beginPath(); ctx.arc(s.x, s.y, 1.6 + s.life * 2, 0, 6.29); ctx.fill();
        }
      }
      for (let k = FW.length - 1; k >= 0; k--) if (FW[k].life <= 0) FW.splice(k, 1);
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
    return () => { clearInterval(iv); clearTimeout(t); removeEventListener('resize', fit); };
  }, []);

  const heartTap = () => {
    window._loveBoom?.();
    getAudio()?.sfx('whoosh');
    setAudioLevel(1); setTimeout(() => setAudioLevel(0.6), 900);
    try { navigator.vibrate?.([40, 50, 80]); } catch {}
    if (!boomed.current) { boomed.current = true; toast(C.LOVE.heartBoom); }
  };

  return (
    <main className="page love-page">
      <canvas id="love-canvas" ref={cvRef} aria-hidden="true" />
      <div id="love-box">
        <p className="hud-txt gold kicker">{C.LOVE.kicker}</p>
        <h1 className="giant lg love-title">
          {C.LOVE.words.map((word, w) => (
            <span className="fword" key={w}>
              {[...word].map((ch, i) => <b key={i} style={{ transitionDelay: `${0.4 + w * 0.55 + i * 0.07}s` }}>{ch}</b>)}
            </span>
          ))}
          <span className="fword name" style={{ transitionDelay: '2.2s' }}>{C.LOVE.name}</span>
        </h1>
        <button className="love-heart" onClick={heartTap} aria-label="heart">❤️</button>
        <p className="love-said">{C.LOVE.said}</p>
        <p className="hud-txt love-deny">{C.LOVE.deny}</p>
        <p className="love-hint hud-txt gold pulse">{C.LOVE.tapHeart}</p>
      </div>
      <footer className="hud-txt fin-footer">{C.LOVE.footer}</footer>
    </main>
  );
}
