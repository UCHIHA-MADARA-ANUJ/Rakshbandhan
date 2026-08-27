'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from '../content.js';
import { getAudio, toast } from '../chrome.jsx';
import { setAudioLevel } from '../particles.jsx';

export default function Finale() {
  const [cert, setCert] = useState(false);
  const petalsRef = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return; done.current = true;
    const t = setTimeout(() => {
      document.getElementById('finale-box')?.classList.add('in');
      getAudio()?.sfx('whoosh');
      setAudioLevel(1);
      const cv = petalsRef.current; if (!cv) return;
      const ctx = cv.getContext('2d');
      const fit = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
      fit(); addEventListener('resize', fit);
      const cols = ['#FF2E4D', '#D9A441', '#F2E8D5', '#a8362e'];
      const P = Array.from({ length: 44 }, () => ({
        x: Math.random(), y: Math.random(), r: 3 + Math.random() * 5,
        vy: 0.4 + Math.random() * 0.8, ph: Math.random() * 6.28,
        c: cols[(Math.random() * cols.length) | 0], a: 0.5 + Math.random() * 0.5,
      }));
      let t2 = 0;
      const FW = [];
      const boom = () => {
        const bx = cv.width * (0.15 + Math.random() * 0.7), by = cv.height * (0.12 + Math.random() * 0.35);
        const col = ['#FF2E4D', '#D9A441', '#F2E8D5'][(Math.random() * 3) | 0];
        for (let k = 0; k < 42; k++) {
          const a = (k / 42) * 6.29, sp = 1.4 + Math.random() * 2.6;
          FW.push({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: Math.random() < 0.8 ? col : '#fff' });
        }
      };
      const boomIv = setInterval(() => { boom(); boom(); }, 1500);
      setTimeout(boom, 900);
      (function loop() {
        t2 += 0.016;
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (const s of FW) {
          s.x += s.vx; s.y += s.vy; s.vy += 0.045; s.vx *= 0.985; s.life -= 0.012;
          if (s.life > 0) {
            ctx.globalAlpha = Math.max(0, s.life); ctx.fillStyle = s.c;
            ctx.beginPath(); ctx.arc(s.x, s.y, 1.6 + s.life * 1.8, 0, 6.29); ctx.fill();
          }
        }
        for (let k = FW.length - 1; k >= 0; k--) if (FW[k].life <= 0) FW.splice(k, 1);
        ctx.globalAlpha = 1;
        for (const p of P) {
          p.y += p.vy / 620; p.ph += 0.02;
          if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
          ctx.save();
          ctx.translate((p.x + Math.sin(p.ph) * 0.02) * cv.width, p.y * cv.height);
          ctx.rotate(Math.sin(t2 + p.ph));
          ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.29); ctx.fill();
          ctx.restore();
        }
        requestAnimationFrame(loop);
      })();
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const copyReply = async () => {
    try { await navigator.clipboard.writeText(C.FINALE_REPLY); toast(C.FINALE.replyDone); }
    catch { toast('copy blocked — screenshot it 😅'); }
  };

  const openCert = async () => {
    setCert(true);
    await new Promise((r) => setTimeout(r, 30));
    const cv = document.getElementById('cert-canvas'); if (!cv) return;
    await (document.fonts?.ready || Promise.resolve());
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, cx = W / 2, gold = '#D9A441';
    let disp = 'sans-serif', mono = 'monospace', hand = 'cursive';
    try {
      disp = getComputedStyle(document.querySelector('.giant')).fontFamily;
      mono = getComputedStyle(document.querySelector('.hud-txt')).fontFamily;
      hand = getComputedStyle(document.querySelector('.letter-body') || document.body).fontFamily;
    } catch {}
    ctx.fillStyle = '#05050A'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.strokeRect(50, 50, W - 100, H - 100);
    ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
    ctx.fillStyle = '#F2E8D5'; ctx.beginPath(); ctx.arc(cx, 240, 78, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#05050A'; ctx.beginPath(); ctx.arc(cx + 34, 214, 70, 0, 6.29); ctx.fill();
    const center = (txt, font, y, color = '#F2E8D5') => {
      ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(txt, cx, y);
    };
    const D = C.FINALE.certData;
    center(D.title, `700 92px ${disp}`, 470, gold);
    center(D.id, `400 34px ${mono}`, 530, '#8E8CA3');
    let y = 660;
    for (const l of D.lines) {
      const isName = l.startsWith('D I');
      center(l, isName ? `700 110px ${disp}` : `400 44px ${disp}`, y, isName ? '#F2E8D5' : '#bdb9d0');
      y += isName ? 130 : 74;
    }
    ctx.strokeStyle = '#FF2E4D'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, y + 90, 74, 0, 6.29); ctx.stroke();
    ctx.fillStyle = '#FF2E4D'; ctx.font = `700 30px ${mono}`; ctx.textAlign = 'center';
    ctx.fillText('RAKHI', cx, y + 80); ctx.fillText('PROTOCOL', cx, y + 118);
    ctx.fillStyle = gold; ctx.font = `400 54px ${hand}`;
    ctx.fillText(D.sign, cx, H - 220);
    ctx.fillStyle = '#8E8CA3'; ctx.font = `400 28px ${mono}`;
    ctx.fillText(D.footer, cx, H - 120);
    const dl = document.getElementById('cert-dl');
    if (dl) dl.href = cv.toDataURL('image/png');
  };

  const mag = {
    onMouseMove: (e) => {
      const el = e.currentTarget; const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    },
    onMouseLeave: (e) => { e.currentTarget.style.transform = ''; },
  };

  return (
    <main className="page finale-page">
      <section id="finale">
        <canvas id="petals" ref={petalsRef} aria-hidden="true" />
        <div id="finale-box">
          <div className="moon-final" data-moon />
          <p className="hud-txt gold kicker">{C.FINALE.kicker}</p>
          <h1 className="giant lg fin-title">
            {C.FINALE.title.map((word, w) => (
              <span className="fword" key={w}>
                {[...word].map((ch, i) => <b key={i} style={{ transitionDelay: `${0.7 + w * 0.5 + i * 0.06}s` }}>{ch}</b>)}
              </span>
            ))}
          </h1>
          <div className="fin-name">{C.FINALE.name}</div>
          <p className="fin-credit">{C.FINALE.credit[0]}<br /><span className="dim2">{C.FINALE.credit[1]}</span></p>
          <div className="fin-actions">
            <button className="fbtn" onClick={() => toast(C.FINALE.callJoke)} {...mag}>{C.FINALE.call}</button>
            <button className="fbtn primary" onClick={openCert} {...mag}>{C.FINALE.cert}</button>
            <button className="fbtn" onClick={copyReply} {...mag}>{C.FINALE.reply}</button>
          </div>
        </div>
        <footer className="hud-txt fin-footer">{C.FINALE.footer}</footer>
      </section>

      {cert && (
        <div id="cert-modal" className="overlay">
          <canvas id="cert-canvas" width="1400" height="1980" />
          <div className="cert-actions">
            <a className="fbtn primary" id="cert-dl" download="rakhi-certificate-didi.png" href="#">DOWNLOAD 📜</a>
            <button className="fbtn" onClick={() => setCert(false)}>BACK →</button>
          </div>
        </div>
      )}
    </main>
  );
}
