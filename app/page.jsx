'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from './content.js';
import { Engine, formations } from './engine.js';

const TOTAL = 10; // chapters 0..9
const clampCh = (n) => Math.max(0, Math.min(TOTAL - 1, n));

export default function Page() {
  const [ch, setCh] = useState(0);
  const [bootLine, setBootLine] = useState(-1);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [granted, setGranted] = useState(false);
  const [gateResp, setGateResp] = useState('');
  const [stampOn, setStampOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mood, setMood] = useState(0);
  const [km, setKm] = useState(0);
  const [hasVoice, setHasVoice] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  const engineRef = useRef(null);
  const audioRef = useRef(null);
  const cvRef = useRef(null);
  const inputRef = useRef(null);
  const petalsRef = useRef(null);
  const wrongRef = useRef(0);
  const doneGateRef = useRef(false);
  const lastNavRef = useRef(0);
  const burstTRef = useRef(null);

  // ── engine boot (particles live from second zero) ──
  useEffect(() => {
    document.body.classList.add('locked');
    engineRef.current = new Engine(cvRef.current);
    engineRef.current.setFormation(formations.ring);
    (async () => { try { await import('./eggs.js').then(m => m.initEggs({
      sfx: (k) => audioRef.current?.sfx(k),
      onGallery: setGalleryOpen,
    })); } catch {} })();
    try {
      fetch('audio/voice.m4a', { method: 'HEAD' }).then(r => r.ok && setHasVoice(true)).catch(() => {});
    } catch {}
    const timers = C.PRELOADER.lines.map((_, i) => setTimeout(() => setBootLine(i), 400 + i * 1100));
    const t = setTimeout(() => setReady(true), Math.max(2200, 400 + C.PRELOADER.lines.length * 1100 + 500));
    return () => { timers.forEach(clearTimeout); clearTimeout(t); };
  }, []);

  // ── chapter → particle formation ──
  useEffect(() => {
    const E = engineRef.current; if (!E) return;
    let disp = 'sans-serif';
    try { disp = getComputedStyle(document.querySelector('.wanted-name')).fontFamily; } catch {}
    const T = (lines, size) => formations.text(lines, { font: `700 90px ${disp}`, size });
    const map = {
      0: formations.ring,
      1: granted ? T(['DAYAN'], 0.20) : T(['WHO ?'], 0.16),
      2: T(['DAYAN'], 0.20),
      3: formations.edge,
      4: formations.halo,
      5: formations.edge,
      6: formations.cities,
      7: formations.wrist,
      8: formations.calm,
      9: T(['HAPPY', 'RAKSHA', 'BANDHAN'], 0.11),
    };
    E.setFormation(map[ch] ?? formations.ring);
    if (ch === 9) {
      clearTimeout(burstTRef.current);
      burstTRef.current = setTimeout(() => E.burstFree(), 4600);
    }
  }, [ch, granted]);

  // ── focus gate input ──
  useEffect(() => { if (ch === 1 && !doneGateRef.current) setTimeout(() => inputRef.current?.focus(), 80); }, [ch]);

  // ── km counter ──
  useEffect(() => {
    if (ch !== 6) { setKm(0); return; }
    let raf, t0;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / 2400);
      setKm(Math.round((1 - Math.pow(1 - p, 3)) * C.ACT4.kmMax));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [ch]);

  // ── petals (finale) ──
  useEffect(() => {
    if (ch !== 9) return;
    const cv = petalsRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const fit = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    fit(); addEventListener('resize', fit);
    const colors = ['#C4453A', '#D9A441', '#F2E8D5', '#a8362e'];
    const P = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(), r: 3 + Math.random() * 5,
      vy: 0.4 + Math.random() * 0.8, ph: Math.random() * 6.28,
      c: colors[(Math.random() * colors.length) | 0], a: 0.5 + Math.random() * 0.5,
    }));
    let t = 0, run = true;
    (function loop() {
      if (!run) return;
      t += 0.016;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of P) {
        p.y += p.vy / 650; p.ph += 0.02;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        ctx.save();
        ctx.translate((p.x + Math.sin(p.ph) * 0.02) * cv.width, p.y * cv.height);
        ctx.rotate(Math.sin(t + p.ph));
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.29); ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    })();
    return () => { run = false; removeEventListener('resize', fit); };
  }, [ch]);

  // ── navigation ──
  const go = (d) => setCh((c) => {
    const n = clampCh(c + d);
    if (c === 1 && !doneGateRef.current && d > 0) return c; // gate locked
    audioRef.current?.sfx('tick');
    return n;
  });
  const jump = (n) => { if (n <= 1 && !doneGateRef.current && n === 1 && ch === 0 && !unlocked) return; setCh(clampCh(n)); };

  useEffect(() => {
    let sy = null, sx = null;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 24 || e.target.closest('.ch-scroll')?.scrollHeight > innerHeight + 40 &&
        e.target.closest('.ch-scroll') && Math.abs(e.deltaY) < 60) return;
      const now = Date.now(); if (now - lastNavRef.current < 950) return;
      lastNavRef.current = now;
      go(e.deltaY > 0 ? 1 : -1);
    };
    const onTS = (e) => {
      if (e.target.closest('.mood-stack, .filmstrip, input, .letter')) { sy = null; return; }
      sy = e.touches[0].clientY; sx = e.touches[0].clientX;
    };
    const onTE = (e) => {
      if (sy == null) return;
      const dy = sy - e.changedTouches[0].clientY;
      const dx = sx - e.changedTouches[0].clientX;
      if (Math.max(Math.abs(dy), Math.abs(dx)) > 65) go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : -1) : (dy > 0 ? 1 : -1));
      sy = null;
    };
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    };
    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('touchstart', onTS, { passive: true });
    addEventListener('touchend', onTE, { passive: true });
    addEventListener('keydown', onKey);
    return () => {
      removeEventListener('wheel', onWheel); removeEventListener('touchstart', onTS);
      removeEventListener('touchend', onTE); removeEventListener('keydown', onKey);
    };
  }, []);

  // ── gate logic ──
  const grant = (g) => {
    doneGateRef.current = true;
    if (inputRef.current) inputRef.current.disabled = true;
    setGateResp(g.resp || C.GATE.grantedLine);
    if (g.stamp) { setStampOn(true); audioRef.current?.sfx('stamp'); }
    setGranted(true);
    engineRef.current?.kick(0.9);
    setTimeout(() => setCh(2), g.stamp ? 2000 : 1600);
  };
  const check = () => {
    const v = inputRef.current?.value.trim().toLowerCase();
    if (!v || doneGateRef.current) return;
    for (const g of Object.values(C.GATE.accept)) {
      if (g.keys.some((k) => v.includes(k))) { grant(g); return; }
    }
    setGateResp(C.GATE.wrong[wrongRef.current % C.GATE.wrong.length]);
    wrongRef.current++;
    inputRef.current.value = '';
    inputRef.current.classList.add('shake');
    setTimeout(() => inputRef.current?.classList.remove('shake'), 400);
  };

  // ── audio init ──
  const initialize = async () => {
    const { Baarishein } = await import('./audio.js');
    const a = new Baarishein();
    audioRef.current = a;
    await a.unlock();
    a.setEnergy(0.08);
    a.sfx('whoosh');
    a.onPulse = (v) => engineRef.current?.kick(Math.min(1, v * 1.6));
    setUnlocked(true);
    setCh(1);
  };

  const toggleMute = () => {
    const a = audioRef.current; if (!a) return;
    a.setMuted(!a.muted); setMuted(a.muted);
  };

  const dragMood = (() => {
    let sx = null, acc = 0;
    return {
      down: (e) => { sx = e.clientX; acc = 0; try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} },
      move: (e) => {
        if (sx == null) return;
        acc += e.clientX - sx; sx = e.clientX;
        while (Math.abs(acc) > 42) {
          setMood((m) => Math.max(0, Math.min(C.ACT2.moods.length - 1, m + (acc > 0 ? 1 : -1))));
          acc = 0;
        }
      },
      up: () => { sx = null; },
    };
  })();

  const openCert = async () => {
    setCertOpen(true);
    await new Promise((r) => setTimeout(r, 30));
    const cv = document.getElementById('cert-canvas'); if (!cv) return;
    await (document.fonts?.ready || Promise.resolve());
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, cx = W / 2, gold = '#D9A441';
    let disp = 'serif', mono = 'monospace', hand = 'cursive';
    try {
      disp = getComputedStyle(document.querySelector('.wanted-name')).fontFamily;
      mono = getComputedStyle(document.querySelector('.scene-caption')).fontFamily;
      hand = getComputedStyle(document.querySelector('#letter')).fontFamily;
    } catch {}
    ctx.fillStyle = '#06060B'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.strokeRect(50, 50, W - 100, H - 100);
    ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
    ctx.fillStyle = '#F2E8D5'; ctx.beginPath(); ctx.arc(cx, 240, 78, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#06060B'; ctx.beginPath(); ctx.arc(cx + 34, 214, 70, 0, 6.29); ctx.fill();
    const center = (txt, font, y, color = '#F2E8D5') => {
      ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(txt, cx, y);
    };
    center(C.ACT6.cert.title, `700 92px ${disp}`, 470, gold);
    center(C.ACT6.cert.id, `400 34px ${mono}`, 530, '#8E8CA3');
    let y = 660;
    for (const l of C.ACT6.cert.lines) {
      const isName = l.startsWith('D I');
      center(l, isName ? `700 110px ${disp}` : `400 44px ${disp}`, y, isName ? '#F2E8D5' : '#bdb9d0');
      y += isName ? 130 : 74;
    }
    ctx.strokeStyle = '#C4453A'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, y + 90, 74, 0, 6.29); ctx.stroke();
    ctx.fillStyle = '#C4453A'; ctx.font = `700 30px ${mono}`; ctx.textAlign = 'center';
    ctx.fillText('EK HI', cx, y + 80); ctx.fillText('CHAAND', cx, y + 118);
    ctx.fillStyle = gold; ctx.font = `400 54px ${hand}`;
    ctx.fillText(C.ACT6.cert.sign, cx, H - 220);
    ctx.fillStyle = '#8E8CA3'; ctx.font = `400 28px ${mono}`;
    ctx.fillText(C.ACT6.cert.footer, cx, H - 120);
    const dl = document.getElementById('cert-dl');
    if (dl) dl.href = cv.toDataURL('image/png');
  };

  const chProps = (n) => ({ className: `chapter ${ch === n ? 'active' : ''}`, 'aria-hidden': ch !== n });
  const ph = () => C.PHOTOS;

  return (
    <>
      <canvas id="engine" ref={cvRef} aria-hidden="true" />
      <div id="threadbar" style={{ width: `${(ch / (TOTAL - 1)) * 100}%` }} aria-hidden="true" />
      {unlocked && (
        <button id="mute" aria-label="sound" onClick={toggleMute}><span>{muted ? '🔇' : '🔊'}</span></button>
      )}

      {/* 0 · BOOT */}
      <section {...chProps(0)}>
        <div className="boot">
          <div className="pre-lines">
            {C.PRELOADER.lines.map((l, i) => (
              <p key={i} className={`${l.cls || ''} ${i <= bootLine ? 'on' : ''}`}>{l.t}</p>
            ))}
          </div>
          <button className={`init-btn ${ready ? '' : 'hidden'}`} onClick={initialize}>
            {ready ? C.PRELOADER.enter : ''}
          </button>
          <p className={`pre-hint ${ready ? '' : 'hidden'}`}>{C.PRELOADER.hint}</p>
        </div>
      </section>

      {/* 1 · IDENTIFY */}
      <section {...chProps(1)}>
        <div className="gate2">
          <p className="gate-q2">{granted ? '' : <>pehle batao —<br /><em>{C.GATE.question}</em></>}</p>
          <input
            ref={inputRef} type="text" autoComplete="off" spellCheck="false"
            placeholder={C.GATE.placeholder} aria-label="identify yourself"
            onKeyDown={(e) => e.key === 'Enter' && check()}
            onBlur={() => !doneGateRef.current && setTimeout(() => inputRef.current?.focus(), 40)}
          />
          <p className="gate-resp2">{gateResp}</p>
          {stampOn && (
            <div className="gate-stamp on">ACCESS GRANTED<br /><span>— DAYAN DETECTED —</span></div>
          )}
        </div>
      </section>

      {/* 2 · SUBJECT */}
      <section {...chProps(2)}>
        <div className="ch-scroll">
          <div className="spacer50" aria-hidden="true" />
          <div id="wanted-card">
            <div className="wanted-head">WANTED</div>
            <div className="wanted-name">DAYAN</div>
            <div className="wanted-meta">{C.ACT1.wanted.meta}</div>
            <ul className="charges">{C.ACT1.wanted.charges.map((c, i) => <li key={i}>{c}</li>)}</ul>
            <div className="wanted-foot">{C.ACT1.wanted.foot}</div>
          </div>
          <div className="scene-caption">{C.ACT1.caption}</div>
        </div>
      </section>

      {/* 3 · EVIDENCE */}
      <section {...chProps(3)}>
        <div className="ch-scroll evidence-ch">
          <div className="act-head">
            <span className="mono-tag">EXHIBITS</span>
            <h2>{C.ACT2.head[0]}<br /><em>{C.ACT2.head[1]}</em></h2>
          </div>
          <div className="filmstrip">
            {C.ACT2.exhibits.map((e, i) => (
              <figure key={e.slug} className="slide" style={{ '--rot': `${[-3, 2.5, -1.5, 3, -2.6, 2, -3.4][i % 7]}deg` }}>
                <div className="polaroid in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" src={C.PHOTOS(e.slug)} alt={e.cap} />
                  <span className="pol-time">2:22 AM</span>
                  <figcaption className="pol-cap"><b>{e.tag}</b> — {e.cap}</figcaption>
                </div>
              </figure>
            ))}
          </div>
          <p className="drag-hint mono">← drag →</p>
        </div>
      </section>

      {/* 4 · MOOD ENGINE */}
      <section {...chProps(4)}>
        <div className="ch-scroll mood-ch">
          <div className="mood-head"><span className="mono-tag">{C.ACT2.moodLabel}</span></div>
          <div
            className="mood-stack"
            onPointerDown={dragMood.down} onPointerMove={dragMood.move}
            onPointerUp={dragMood.up} onPointerCancel={dragMood.up}
          >
            {C.ACT2.moods.map((m, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.slug} src={C.PHOTOS(m.slug)} alt={m.label} loading="lazy"
                   className={i === mood ? 'on' : ''} />
            ))}
          </div>
          <div className="mood-label mono" id="mood-label">{C.ACT2.moods[mood]?.label}</div>
          <div className="mood-foot">{C.ACT2.moodFoot[0]}<br /><span className="dim">{C.ACT2.moodFoot[1]}</span></div>
        </div>
      </section>

      {/* 5 · HER PHONE */}
      <section {...chProps(5)}>
        <div className="ch-scroll phone-ch">
          <div className="act-head">
            <span className="mono-tag">EVIDENCE: PHONE</span>
            <h2>{C.ACT3.head[0]}<br /><em>{C.ACT3.head[1]}</em></h2>
          </div>
          <div className="phone-zone">
            <div className="phone" id="phone">
              <div className="phone-notch" />
              <div className="phone-screen" id="phone-screen">
                {C.ACT3.phone.map((p) => (
                  <div key={p.slug} className={`pp ${p.big ? 'big' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" src={C.PHOTOS(p.slug)} alt={p.label} /><span>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="phone-cap">{C.ACT3.phoneCap}</p>
          </div>
          <div className="turn">
            <div className="chat" id="chat">
              <div className="meta">{C.ACT3.chatMeta} · 🔒</div>
              {C.ACT3.chat.map((m, i) => (
                <div key={i} className={`bub ${m.side}`}>
                  {m.text}{m.time ? <span className="t">{m.time}</span> : null}
                </div>
              ))}
            </div>
            <div className="turn-lines">
              <p className="big-line">{C.ACT3.turnLines[0]}</p>
              <p className="big-line soft">{C.ACT3.turnLines[1]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · DISTANCE */}
      <section {...chProps(6)}>
        <div className="dist-ch">
          <div className="stats2" id="stats">
            {C.ACT4.stats.map((s, i) => <span key={i} dangerouslySetInnerHTML={{ __html: s }} />)}
          </div>
          <div className="km2 mono">{km.toLocaleString('en-IN')} km</div>
          <div className="thesis2">
            <p className="big-line">{C.ACT4.thesis[0]}</p>
            <p className="big-line soft">{C.ACT4.thesis[1]}</p>
          </div>
          <div className="city-tags mono">
            <span>GURUGRAM — bhai</span><span>MUMBAI — dayan</span>
          </div>
        </div>
      </section>

      {/* 7 · RAKHI */}
      <section {...chProps(7)}>
        <div className="ch-scroll">
          <div className={`hand-wrap ${ch === 7 ? 'in' : ''}`} id="hand-wrap">
            <div className="hand-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="hand-img" src={C.PHOTOS(C.ACT5.handSlug)} alt={C.ACT5.handAlt} />
              <svg className="rakhi" viewBox="0 0 300 300" aria-hidden="true">
                <path className="rk-thread" d="M4,150 C 70,132 110,150 150,150 C 190,150 230,168 296,150" />
                <g className="rk-center">
                  <circle className="rk-outer" cx="150" cy="150" r="34" />
                  <circle className="rk-inner" cx="150" cy="150" r="20" />
                  <circle className="rk-dot d1" cx="150" cy="112" r="4" />
                  <circle className="rk-dot d2" cx="184" cy="128" r="4" />
                  <circle className="rk-dot d3" cx="184" cy="172" r="4" />
                  <circle className="rk-dot d4" cx="150" cy="188" r="4" />
                  <circle className="rk-dot d5" cx="116" cy="172" r="4" />
                  <circle className="rk-dot d6" cx="116" cy="128" r="4" />
                </g>
              </svg>
              <div className="date-stamp mono">{C.ACT5.dateStamp}</div>
            </div>
            <p className="big-line">{C.ACT5.lines[0]}</p>
            <p className="big-line soft">{C.ACT5.lines[1]}</p>
          </div>
        </div>
      </section>

      {/* 8 · LETTER */}
      <section {...chProps(8)}>
        <div className="ch-scroll letter-ch">
          <div className="letter" id="letter">
            {C.ACT6.letter.map((l, i) => <p key={i}>{l}</p>)}
            <p className="sign">{C.ACT6.sign}</p>
            <p className="ps">{C.ACT6.ps}</p>
          </div>
          {hasVoice && (
            <button id="voice-btn" className="voice-btn" type="button"
              onClick={() => {
                const el = new Audio('audio/voice.m4a');
                audioRef.current?.duck(true);
                el.play(); el.addEventListener('ended', () => audioRef.current?.duck(false));
              }}>▶ bhai ki awaaz</button>
          )}
        </div>
      </section>

      {/* 9 · FINALE */}
      <section {...chProps(9)}>
        <div className={`end ${ch === 9 ? 'in' : ''}`} id="end">
          <canvas id="petals" ref={petalsRef} aria-hidden="true" />
          <div className="moon moon-final" data-moon />
          <div className="end-kicker mono">{C.ACT6.end.kicker}</div>
          <h1 className="end-title">{C.ACT6.end.title.map((t, i) => <span key={i}>{t}</span>)}</h1>
          <div className="end-name">{C.ACT6.end.name}</div>
          <p className="end-credit">{C.ACT6.end.credit[0]}<br /><span className="dim">{C.ACT6.end.credit[1]}</span></p>
          <div className="end-actions">
            <a className="end-btn primary" id="btn-call" href={C.ACT6.end.callHref}>call kar abhi</a>
            <button className="end-btn" onClick={openCert}>rakhi certificate 📜</button>
            <a className="end-btn" id="btn-reply" href={C.ACT6.end.replyHref} target="_blank" rel="noopener">reply likh do</a>
          </div>
        </div>
      </section>

      {/* nav */}
      {ch >= 2 && (
        <nav className="dots" aria-label="chapters">
          {Array.from({ length: TOTAL }, (_, i) => (
            <button key={i} className={i === ch ? 'on' : ''} aria-label={`chapter ${i}`} onClick={() => setCh(clampCh(i))} />
          ))}
        </nav>
      )}
      {ch >= 2 && ch < 9 && <button className="nav-arrow next" onClick={() => go(1)} aria-label="next">→</button>}
      {ch >= 3 && <button className="nav-arrow prev" onClick={() => go(-1)} aria-label="back">←</button>}
      {ch === 0 && ready && <div className="scroll-cue mono" aria-hidden="true">tap initialize to begin</div>}

      {/* overlays */}
      {galleryOpen && (
        <div id="gallery" className="overlay">
          <div className="overlay-head mono">DAYAN KI POORI FILE 🔓</div>
          <div className="gallery-grid" id="gallery-grid">
            {C.ALL_SLUGS.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s} loading="lazy" src={C.PHOTOS(s)} alt={s} />
            ))}
          </div>
          <button className="overlay-close" onClick={() => setGalleryOpen(false)}>band karo ✕</button>
        </div>
      )}
      {certOpen && (
        <div id="cert-modal" className="overlay">
          <canvas id="cert-canvas" width="1400" height="1980" />
          <div className="cert-actions">
            <a className="end-btn primary" id="cert-dl" download="rakhi-certificate-diii.png" href="#">download 📜</a>
            <button className="end-btn" onClick={() => setCertOpen(false)}>wapas →</button>
          </div>
        </div>
      )}
      <div id="flicker" aria-hidden="true" />
    </>
  );
}
