'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as C from './content.js';
import { setAudioLevel } from './particles.jsx';

const ParticleField = dynamic(() => import('./particles.jsx'), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

const flip = (containerSel, wordSel) => {
  const words = document.querySelectorAll(wordSel);
  if (!words.length) return;
  gsap.fromTo(words,
    { y: 120, opacity: 0, rotateX: -80, skewY: 6 },
    { y: 0, opacity: 1, rotateX: 0, skewY: 0, duration: 1.4, stagger: 0.12, ease: 'power4.out',
      scrollTrigger: { trigger: containerSel, start: 'top 78%' } });
};

export default function Page() {
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(-1);
  const [gateResp, setGateResp] = useState('');
  const [gateOk, setGateOk] = useState(false);
  const [stamp, setStamp] = useState(false);
  const [mood, setMood] = useState(0);
  const [km, setKm] = useState(0);
  const [muted, setMuted] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [cert, setCert] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const audio = useRef(null);
  const wrong = useRef(0);
  const inputRef = useRef(null);
  const petalsRef = useRef(null);

  // boot terminal
  useEffect(() => {
    document.body.classList.add('locked');
    const ts = C.BOOT.lines.map((_, i) => setTimeout(() => setBootLine(i), 350 + i * 900));
    const end = setTimeout(() => finishBoot(), 350 + C.BOOT.lines.length * 900 + 900);
    return () => { ts.forEach(clearTimeout); clearTimeout(end); };
  }, []);
  const finishBoot = () => {
    setBooted(true);
    document.body.classList.remove('locked');
    setTimeout(() => {
      flip('#hero', '#hero .flip');
      flip('#file-head', '#file-head .flip');
    }, 150);
  };

  // audio unlock on first gesture
  useEffect(() => {
    const init = async () => {
      if (audio.current) return;
      const { Baarishein } = await import('./audio.js');
      const a = new Baarishein();
      audio.current = a;
      await a.unlock();
      a.setEnergy(0.14);
      a.onPulse = (v) => setAudioLevel(Math.min(1, v * 1.5));
      import('./eggs.js').then((m) => m.initEggs({
        sfx: (k) => a.sfx(k),
        onGallery: setGallery,
      }));
    };
    addEventListener('pointerdown', init, { once: true });
    fetch('audio/voice.m4a', { method: 'HEAD' }).then((r) => r.ok && setHasVoice(true)).catch(() => {});
  }, []);

  // scroll story
  useEffect(() => {
    if (!booted) return;
    const h = document.documentElement;
    // reveals
    flip('#scan-head', '#scan-head .flip');
    flip('#tx-head', '#tx-head .flip');
    flip('#dist-thesis', '#dist-thesis .flip');
    flip('#letter-flip', '#letter-flip .flip');
    // cards
    document.querySelectorAll('.gcard').forEach((card) => {
      gsap.fromTo(card, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      });
    });
    // exhibits
    gsap.fromTo('.evcard', { y: 80, opacity: 0, rotate: -2 }, {
      y: 0, opacity: 1, rotate: 0, duration: 1, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '#evidence', start: 'top 80%' },
    });
    // km counter
    ScrollTrigger.create({
      trigger: '#dist', start: 'top 70%', once: true,
      onEnter: () => {
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / 2200);
          setKm(Math.round((1 - Math.pow(1 - p, 3)) * C.DIST.kmMax));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
    });
    // energy per zone
    const zones = [
      ['#hero', 0.14], ['#file', 0.18], ['#scan', 0.3], ['#tx', 0.5],
      ['#dist', 0.62], ['#rakhi', 0.85], ['#letter', 0.55], ['#finale', 1],
    ];
    zones.forEach(([sel, e]) => ScrollTrigger.create({
      trigger: sel, start: 'top 60%', end: 'bottom 40%',
      onToggle: (self) => self.isActive && audio.current?.setEnergy(e),
    }));
    // rakhi draw + finale
    ScrollTrigger.create({ trigger: '#rakhi', start: 'top 65%', once: true,
      onEnter: () => document.getElementById('hand-wrap')?.classList.add('in') });
    ScrollTrigger.create({ trigger: '#finale', start: 'top 70%', once: true,
      onEnter: () => {
        document.getElementById('finale-box')?.classList.add('in');
        startPetals();
        audio.current?.sfx('whoosh');
      } });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [booted]);

  // gate
  const check = () => {
    const v = inputRef.current?.value.trim().toLowerCase();
    if (!v || gateOk) return;
    for (const g of Object.values(C.GATE.accept)) {
      if (g.keys.some((k) => v.includes(k))) {
        setGateResp(g.resp);
        setGateOk(true);
        if (g.stamp) setStamp(true);
        audio.current?.sfx('stamp');
        setAudioLevel(1);
        setTimeout(() => setAudioLevel(0.2), 900);
        setTimeout(() => document.getElementById('file')?.scrollIntoView({ behavior: 'smooth' }), 1600);
        return;
      }
    }
    setGateResp(C.GATE.wrong[wrong.current % C.GATE.wrong.length]);
    wrong.current++;
    inputRef.current.value = '';
    audio.current?.sfx('tick');
  };

  // mood drag
  const moodDrag = (() => {
    let sx = null, acc = 0;
    return {
      down: (e) => { sx = e.clientX; acc = 0; try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} },
      move: (e) => {
        if (sx == null) return;
        acc += e.clientX - sx; sx = e.clientX;
        while (Math.abs(acc) > 42) {
          setMood((m) => Math.max(0, Math.min(C.SCAN.moods.length - 1, m + (acc > 0 ? 1 : -1))));
          acc = 0;
        }
      },
      up: () => { sx = null; },
    };
  })();

  // petals
  const startPetals = () => {
    const cv = petalsRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const fit = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    fit(); addEventListener('resize', fit);
    const cols = ['#FF2E4D', '#D9A441', '#F2E8D5', '#a8362e'];
    const P = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(), r: 3 + Math.random() * 5,
      vy: 0.4 + Math.random() * 0.8, ph: Math.random() * 6.28,
      c: cols[(Math.random() * cols.length) | 0], a: 0.5 + Math.random() * 0.5,
    }));
    let t = 0;
    (function loop() {
      t += 0.016;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of P) {
        p.y += p.vy / 620; p.ph += 0.02;
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
  };

  const toggleMute = () => {
    const a = audio.current; if (!a) return;
    a.setMuted(!a.muted); setMuted(a.muted);
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
      hand = getComputedStyle(document.querySelector('.letter-body')).fontFamily;
    } catch {}
    ctx.fillStyle = '#06060B'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.strokeRect(50, 50, W - 100, H - 100);
    ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
    ctx.fillStyle = '#F2E8D5'; ctx.beginPath(); ctx.arc(cx, 240, 78, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#06060B'; ctx.beginPath(); ctx.arc(cx + 34, 214, 70, 0, 6.29); ctx.fill();
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
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.25}px,${dy * 0.3}px)`;
    },
    onMouseLeave: (e) => { e.currentTarget.style.transform = ''; },
  };

  return (
    <>
      <div className="bg-noise" />
      <div className="scanline" />
      <ParticleField />

      {/* ══ BOOT ══ */}
      {!booted && (
        <div id="boot" onClick={finishBoot}>
          <h1 className="boot-word">{C.BOOT.bigWord}</h1>
          <div className="glass-terminal boot-term">
            <div className="term-dots"><i /><i /><i /></div>
            <div className="term-lines">
              {C.BOOT.lines.slice(0, bootLine + 1).map((l, i) => (
                <p key={i} className={l.c}>{l.t}</p>
              ))}
              <span className="cursor" />
            </div>
          </div>
          <button className="skip" onClick={finishBoot}>{C.BOOT.skip}</button>
          <p className="boot-hint">🔊 tap anywhere — sound is part of the gift</p>
        </div>
      )}

      {booted && (
        <button id="mute" onClick={toggleMute} aria-label="sound">{muted ? '🔇' : '🔊'}</button>
      )}

      <main>
        {/* ══ HERO ══ */}
        <section id="hero">
          <div className="hud">
            <div className="hud-txt tl">
              <span className="gold pulse">■ {C.HERO.hud.tl1}</span>
              <span>{C.HERO.hud.tl2}</span>
              <span>{C.HERO.hud.tl3}</span>
            </div>
            <div className="hud-txt tr">
              <span>{C.HERO.hud.tr1}</span>
              <span>{C.HERO.hud.tr2}</span>
            </div>
            <div className="hud-txt bl">
              <span>{C.HERO.hud.bl1}</span>
              <span className="gold">{C.HERO.hud.bl2}</span>
            </div>
            <div className="hud-txt br">
              <span className="pulse">{C.HERO.hud.br}</span>
              <i className="hud-line" />
            </div>
            <i className="corner c1" /><i className="corner c2" />
          </div>
          <div className="hero-type">
            <h1 className="giant">
              <span className="flip outline">{C.HERO.line1}</span>
              <span className="flip glow">{C.HERO.line2}</span>
            </h1>
            <p className="hero-sub hud-txt">{C.HERO.sub}</p>
          </div>
        </section>

        {/* ══ GATE ══ */}
        <section id="gate">
          <div className="glass-terminal gate-box">
            <p className="hud-txt gold mb">{C.GATE.tag}</p>
            <h2 className="gate-q">{C.GATE.q}</h2>
            <input ref={inputRef} type="text" autoComplete="off" spellCheck="false"
              placeholder={C.GATE.placeholder} aria-label="identify yourself"
              onKeyDown={(e) => e.key === 'Enter' && check()} />
            <button className="gate-btn" onClick={check}>SUBMIT ↵</button>
            <p className="gate-resp hud-txt">{gateResp}</p>
            {stamp && <div className="gate-stamp on">ACCESS GRANTED<br /><span>— DAYAN CONFIRMED —</span></div>}
          </div>
        </section>

        {/* ══ SUBJECT FILE ══ */}
        <section id="file">
          <div className="sec-head" id="file-head">
            <p className="hud-txt gold mb">{C.FILE.tag}</p>
            <h2 className="giant md">
              <span className="flip">{C.FILE.head[0]}</span>
              <span className="flip shock">{C.FILE.head[1]}</span>
            </h2>
          </div>
          <div className="charge-roll hud-txt">
            {C.FILE.charges.map((c, i) => <span key={i}>⚠ {c}</span>)}
          </div>
          <div className="cards">
            {C.FILE.cards.map((c, i) => (
              <div className="gcard" key={i}>
                <i className="shine" />
                <div className="gcard-n">{c.n}</div>
                <div className="gcard-l hud-txt gold">{c.l}</div>
                <p className="gcard-d">{c.d}</p>
              </div>
            ))}
          </div>
          <div id="evidence">
            <p className="hud-txt gold mb center">{C.FILE.exhibitsTag}</p>
            <div className="filmstrip">
              {C.FILE.exhibits.map((e, i) => (
                <figure className="evcard" key={e.slug}>
                  <img loading="lazy" src={C.PHOTOS(e.slug)} alt={e.cap} />
                  <figcaption>
                    <b className="gold">{e.tag}</b>
                    <span>{e.cap}</span>
                    <em className="hud-txt">2:22 AM</em>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="drag-hint hud-txt">← DRAG →</p>
          </div>
        </section>

        {/* ══ SCANNER ══ */}
        <section id="scan">
          <div className="sec-head" id="scan-head">
            <p className="hud-txt gold mb">{C.SCAN.tag}</p>
            <h2 className="giant md">
              <span className="flip">{C.SCAN.head[0]}</span>
              <span className="flip shock">{C.SCAN.head[1]}</span>
            </h2>
          </div>
          <div className="scanner">
            <div className="mood-stack"
              onPointerDown={moodDrag.down} onPointerMove={moodDrag.move}
              onPointerUp={moodDrag.up} onPointerCancel={moodDrag.up}>
              {C.SCAN.moods.map((m, i) => (
                <img key={m.slug} src={C.PHOTOS(m.slug)} alt={m.label} loading="lazy"
                  className={i === mood ? 'on' : ''} draggable={false} />
              ))}
              <i className="scan-beam" />
              <i className="scan-grid" />
            </div>
            <div className="mood-label hud-txt" id="mood-label">{C.SCAN.moods[mood]?.label}</div>
            <div className="verdict hud-txt gold">{C.SCAN.verdict}</div>
            <p className="scan-foot">{C.SCAN.foot}</p>
          </div>
        </section>

        {/* ══ TRANSMISSION ══ */}
        <section id="tx">
          <div className="sec-head" id="tx-head">
            <p className="hud-txt gold mb">{C.TX.tag}</p>
            <h2 className="giant md">
              <span className="flip">{C.TX.head[0]}</span>
              <span className="flip shock">{C.TX.head[1]}</span>
            </h2>
          </div>
          <div className="phone-zone">
            <div className="phone">
              <i className="phone-notch" />
              <div className="phone-screen">
                {C.TX.phone.map((p) => (
                  <div key={p.slug} className={`pp ${p.big ? 'big' : ''}`}>
                    <img loading="lazy" src={C.PHOTOS(p.slug)} alt={p.label} />
                    <span className="hud-txt">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="turn">
            <div className="glass-terminal chat">
              <div className="term-dots"><i /><i /><i /></div>
              <p className="hud-txt dim mb">{C.TX.chatMeta} · 🔒</p>
              {C.TX.chat.map((m, i) => (
                <div key={i} className={`bub ${m.side}`}>
                  {m.text}{m.time ? <span className="t hud-txt">{m.time}</span> : null}
                </div>
              ))}
            </div>
            <div className="turn-lines">
              <p className="tline">{C.TX.turn[0]}</p>
              <p className="tline soft">{C.TX.turn[1]}</p>
            </div>
          </div>
        </section>

        {/* ══ DISTANCE ══ */}
        <section id="dist">
          <p className="hud-txt gold mb center">{C.DIST.tag}</p>
          <div className="km-wrap">
            <span className="km" id="km-num">{km.toLocaleString('en-IN')}</span>
            <span className="km-unit hud-txt">KM BETWEEN US</span>
          </div>
          <h2 className="giant md" id="dist-thesis">
            <span className="flip">{C.DIST.thesis[0]}</span>
            <span className="flip shock">{C.DIST.thesis[1]}</span>
          </h2>
          <p className="dist-sub">{C.DIST.thesis2}</p>
          <div className="cards">
            {C.DIST.cards.map((c, i) => (
              <div className="gcard" key={i}>
                <i className="shine" />
                <div className="gcard-n">{c.n}</div>
                <div className="gcard-l hud-txt gold">{c.l}</div>
                <p className="gcard-d">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ RAKHI ══ */}
        <section id="rakhi">
          <p className="hud-txt gold mb center">{C.RAKHI.tag}</p>
          <div className="hand-wrap" id="hand-wrap">
            <div className="hand-frame">
              <img id="hand-img" src={C.PHOTOS(C.RAKHI.handSlug)} alt={C.RAKHI.handAlt} />
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
              <div className="date-stamp hud-txt">{C.RAKHI.stamp}</div>
            </div>
            <h2 className="giant md">
              <span>{C.RAKHI.lines[0]}</span>
              <span className="shock">{C.RAKHI.lines[1]}</span>
            </h2>
            <p className="dist-sub">{C.RAKHI.sub}</p>
          </div>
        </section>

        {/* ══ LETTER ══ */}
        <section id="letter">
          <p className="hud-txt gold mb center">{C.LETTER.tag}</p>
          <div className="letter-grid">
            <h2 className="giant md" id="letter-flip">
              <span className="flip">{C.LETTER.flipWords[0]}</span>
              <span className="flip gold-t">{C.LETTER.flipWords[1]}</span>
            </h2>
            <div className="letter-col">
              <div className="letter-body">
                {C.LETTER.body.map((l, i) => <p key={i}>{l}</p>)}
                <p className="sign">{C.LETTER.sign}</p>
                <p className="ps">{C.LETTER.ps}</p>
              </div>
              {hasVoice && (
                <button className="voice-btn" onClick={() => {
                  const el = new Audio('audio/voice.m4a');
                  audio.current?.duck(true);
                  el.play(); el.addEventListener('ended', () => audio.current?.duck(false));
                }}>▶ bhai ki awaaz</button>
              )}
            </div>
          </div>
        </section>

        {/* ══ FINALE ══ */}
        <section id="finale">
          <canvas id="petals" ref={petalsRef} aria-hidden="true" />
          <div id="finale-box">
            <div className="moon-final" data-moon />
            <p className="hud-txt gold kicker">{C.FINALE.kicker}</p>
            <h1 className="giant lg">
              {C.FINALE.title.map((t, i) => <span key={i} className="fout">{t}</span>)}
            </h1>
            <div className="fin-name">{C.FINALE.name}</div>
            <p className="fin-credit">{C.FINALE.credit[0]}<br />
              <span className="dim2">{C.FINALE.credit[1]}</span></p>
            <div className="fin-actions">
              <a className="fbtn primary" href="#" {...mag}>{C.FINALE.call}</a>
              <button className="fbtn" onClick={openCert} {...mag}>{C.FINALE.cert}</button>
              <a className="fbtn" href="#" target="_blank" rel="noopener" {...mag}>{C.FINALE.reply}</a>
            </div>
          </div>
          <footer className="hud-txt fin-footer">{C.FINALE.footer}</footer>
        </section>
      </main>

      {/* overlays */}
      {gallery && (
        <div id="gallery" className="overlay">
          <p className="hud-txt gold">DAYAN KI POORI FILE — DECLASSIFIED 🔓</p>
          <div className="gallery-grid">
            {C.ALL_SLUGS.map((s) => (
              <img key={s} loading="lazy" src={C.PHOTOS(s)} alt={s} />
            ))}
          </div>
          <button className="fbtn" onClick={() => setGallery(false)}>CLOSE ✕</button>
        </div>
      )}
      {cert && (
        <div id="cert-modal" className="overlay">
          <canvas id="cert-canvas" width="1400" height="1980" />
          <div className="cert-actions">
            <a className="fbtn primary" id="cert-dl" download="rakhi-certificate-didi.png" href="#">DOWNLOAD 📜</a>
            <button className="fbtn" onClick={() => setCert(false)}>BACK →</button>
          </div>
        </div>
      )}
      <div id="flicker" aria-hidden="true" />
    </>
  );
}
