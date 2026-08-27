'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from './content.js';

const GGM_PATH =
  'M0,140 L0,110 L18,110 L18,92 L30,92 L30,110 L44,110 L44,70 L52,70 L52,40 L58,40 L58,26 L61,18 L64,26 L64,40 L70,40 L70,70 L78,70 L78,110 L96,110 L96,84 L104,84 L104,60 L110,60 L110,84 L118,84 L118,110 L134,110 L134,50 L140,50 L140,30 L146,30 L146,50 L152,50 L152,110 L170,110 L170,90 L186,90 L186,64 L196,64 L196,90 L212,90 L212,110 L228,110 L228,74 L236,74 L236,54 L244,54 L244,74 L252,74 L252,110 L270,110 L270,86 L286,86 L286,58 L294,58 L294,86 L302,86 L302,110 L318,110 L318,66 L330,66 L330,110 L348,110 L348,88 L364,88 L364,108 L382,108 L382,118 L400,118 L400,140 Z';
const MUM_PATH =
  'M0,140 L0,118 L26,118 L26,96 L34,96 L34,70 L40,70 L46,58 L52,70 L58,70 L58,96 L84,96 L84,118 L108,118 L108,84 L118,84 L126,60 L132,60 L138,84 L148,84 L148,118 L170,118 L170,74 L176,74 L176,52 L182,52 L188,74 L194,74 L194,118 L216,118 L216,92 L228,92 L236,92 L236,118 L258,118 L258,50 L262,50 L266,42 L270,50 L274,50 L274,118 L300,118 L300,100 L360,100 L360,94 L316,58 L322,52 L366,88 L372,82 L328,46 L334,40 L378,76 L400,54 L400,118 L400,140 Z M294,60 l6,8 l6,-8 z';

export default function Page() {
  const [phase, setPhase] = useState('pre'); // pre → gate → story
  const [lineIdx, setLineIdx] = useState(-1);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [gateResp, setGateResp] = useState('');
  const [stampOn, setStampOn] = useState(false);
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const wrongRef = useRef(0);
  const doneRef = useRef(false);
  const ringRef = useRef(null);
  const inputRef = useRef(null);

  // boot: inject content + preloader sequence
  useEffect(() => {
    document.body.classList.add('locked');
    (async () => {
      const D = await import('./director.js');
      D.render();
    })();
    const timers = C.PRELOADER.lines.map((_, i) =>
      setTimeout(() => setLineIdx(i), 500 + i * 1300)
    );
    let prog = 0;
    const ringT = setInterval(() => {
      prog = Math.min(96, prog + 3 + Math.random() * 7);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = 327 - (327 * prog) / 100;
    }, 130);
    const done = setTimeout(() => {
      clearInterval(ringT);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = 0;
      setReady(true);
    }, Math.max(2400, 500 + C.PRELOADER.lines.length * 1300 + 600));
    return () => { timers.forEach(clearTimeout); clearInterval(ringT); clearTimeout(done); };
  }, []);

  useEffect(() => {
    if (phase === 'gate') setTimeout(() => inputRef.current?.focus(), 60);
  }, [phase]);

  const enter = async () => {
    const { Baarishein } = await import('./audio.js');
    const a = new Baarishein();
    audioRef.current = a;
    await a.unlock();
    a.setEnergy(0.06);
    a.sfx('whoosh');
    setPhase('gate');
  };

  const grant = (g) => {
    doneRef.current = true;
    if (inputRef.current) inputRef.current.disabled = true;
    setGateResp(g.resp || C.GATE.grantedLine);
    if (g.stamp) {
      setStampOn(true);
      audioRef.current?.sfx('stamp');
    }
    setTimeout(() => setPhase('story'), g.stamp ? 1900 : 1500);
  };

  const check = () => {
    const v = inputRef.current?.value.trim().toLowerCase();
    if (!v || doneRef.current) return;
    for (const g of Object.values(C.GATE.accept)) {
      if (g.keys.some((k) => v.includes(k))) { grant(g); return; }
    }
    setGateResp(C.GATE.wrong[wrongRef.current % C.GATE.wrong.length]);
    wrongRef.current++;
    inputRef.current.value = '';
    inputRef.current.classList.add('shake');
    setTimeout(() => inputRef.current?.classList.remove('shake'), 400);
  };

  // story boot
  useEffect(() => {
    if (phase !== 'story' || startedRef.current) return;
    startedRef.current = true;
    (async () => {
      document.body.classList.remove('locked');
      const D = await import('./director.js');
      D.setAudioRef(audioRef.current);
      requestAnimationFrame(() => D.initStory());
      const { initEggs } = await import('./eggs.js');
      initEggs(audioRef.current);
      audioRef.current?.sfx('stamp');
      try {
        const r = await fetch('audio/voice.m4a', { method: 'HEAD' });
        if (r.ok) {
          const el = new Audio('audio/voice.m4a');
          const vb = document.getElementById('voice-btn');
          vb?.classList.remove('hidden');
          el.addEventListener('ended', () => {
            vb?.classList.remove('playing');
            audioRef.current?.duck(false);
          });
          vb?.addEventListener('click', () => {
            if (el.paused) { el.play(); vb.classList.add('playing'); audioRef.current?.duck(true); }
            else { el.pause(); vb.classList.remove('playing'); audioRef.current?.duck(false); }
          });
        }
      } catch {}
    })();
  }, [phase]);

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.setMuted(!a.muted);
    setMuted(a.muted);
  };

  return (
    <>
      {phase === 'pre' && (
        <div id="preloader">
          <svg className="moon-ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="mr-bg" cx="60" cy="60" r="52" />
            <circle className="mr-fg" ref={ringRef} cx="60" cy="60" r="52" />
            <circle className="mr-core" cx="60" cy="60" r="34" />
          </svg>
          <div className="pre-lines">
            {C.PRELOADER.lines.map((l, i) => (
              <p key={i} className={`${l.cls || ''} ${i <= lineIdx ? 'on' : ''}`}>{l.t}</p>
            ))}
          </div>
          <button id="enter-btn" type="button" className={ready ? '' : 'hidden'} onClick={enter}>
            {C.PRELOADER.enter}
          </button>
          <p className={`pre-hint ${ready ? '' : 'hidden'}`}>{C.PRELOADER.hint}</p>
        </div>
      )}

      {phase === 'gate' && (
        <div id="gate">
          <div className="gate-inner">
            <p className="gate-q">pehle batao —<br /><em>{C.GATE.question}</em></p>
            <input
              id="gate-input" ref={inputRef} type="text" autoComplete="off" spellCheck="false"
              placeholder={C.GATE.placeholder} aria-label="apna naam batao"
              onKeyDown={(e) => e.key === 'Enter' && check()}
              onBlur={() => !doneRef.current && setTimeout(() => inputRef.current?.focus(), 40)}
            />
            <p className="gate-resp" id="gate-resp">{gateResp}</p>
            {stampOn && (
              <div className="gate-stamp on">ACCESS GRANTED<br /><span>— DAYAN DETECTED —</span></div>
            )}
          </div>
        </div>
      )}

      {phase === 'story' && (
        <button id="mute" aria-label="sound on/off" onClick={toggleMute}>
          <span>{muted ? '🔇' : '🔊'}</span>
        </button>
      )}

      <main id="story" aria-hidden={phase !== 'story'}>

        {/* ACT I — WANTED */}
        <section id="act1" data-act="1">
          <div className="sticky-wrap">
            <div className="sky">
              <div className="stars" id="stars-a1" />
              <div className="moon" id="moon-a1" data-moon />
            </div>
            <svg className="skyline skyline-ggm" viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d={GGM_PATH} />
            </svg>
            <div className="scene-caption" id="cap-a1" />
            <div className="wanted" id="wanted-card">
              <div className="wanted-head">WANTED</div>
              <div className="wanted-name">DAYAN</div>
              <div className="wanted-meta" />
              <ul className="charges" id="charges" />
              <div className="wanted-foot" />
            </div>
          </div>
        </section>

        {/* ACT II — EXHIBITS + MOOD INDEX */}
        <section id="act2" data-act="2">
          <div className="act-head">
            <span className="mono-tag">EXHIBITS</span>
            <h2>{C.ACT2.head[0]}<br /><em>{C.ACT2.head[1]}</em></h2>
          </div>
          <div id="exhibits" className="exhibits" />
          <div id="moods" className="moodwall">
            <div className="mood-head"><span className="mono-tag" /></div>
            <div className="mood-stack" id="mood-stack" />
            <div className="mood-label mono" id="mood-label" />
            <div className="mood-foot">{C.ACT2.moodFoot[0]}<br /><span className="dim">{C.ACT2.moodFoot[1]}</span></div>
          </div>
        </section>

        {/* ACT III — HER PHONE + THE TURN */}
        <section id="act3" data-act="3">
          <div className="act-head">
            <span className="mono-tag">EVIDENCE: PHONE</span>
            <h2>{C.ACT3.head[0]}<br /><em>{C.ACT3.head[1]}</em></h2>
          </div>
          <div className="phone-zone">
            <div className="phone" id="phone">
              <div className="phone-notch" />
              <div className="phone-screen" id="phone-screen" />
            </div>
            <p className="phone-cap" id="phone-cap" />
          </div>
          <div className="turn" id="turn">
            <div className="chat" id="chat" />
            <div className="turn-lines">
              <p className="big-line" id="tl1" />
              <p className="big-line soft" id="tl2" />
            </div>
          </div>
        </section>

        {/* ACT IV — TWO CITIES, ONE MOON */}
        <section id="act4" data-act="4">
          <div className="sticky-wrap cities-wrap">
            <div className="cities">
              <div className="city city-ggm">
                <svg className="skyline" viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d={GGM_PATH} /></svg>
                <span className="city-name mono">GURUGRAM — bhai</span>
              </div>
              <div className="city city-mum">
                <svg className="skyline" viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d={MUM_PATH} /></svg>
                <span className="city-name mono">MUMBAI — dayan</span>
              </div>
              <div className="moon moon-shared" id="moon-shared" data-moon />
              <svg className="thread-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path id="thread-curve" d="M2,86 C 30,78 55,40 98,14" fill="none" />
              </svg>
              <div className="km mono" id="km">0 km</div>
            </div>
            <div className="thesis">
              <p className="big-line" id="th1" />
              <p className="big-line soft" id="th2" />
            </div>
            <div className="stats" id="stats" />
          </div>
        </section>

        {/* ACT V — THE HAND */}
        <section id="act5" data-act="5">
          <div className="hand-wrap" id="hand-wrap">
            <div className="hand-frame">
              <img id="hand-img" alt="diii ka haath" />
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
              <div className="date-stamp mono" id="date-stamp" />
            </div>
            <p className="big-line" />
            <p className="big-line soft" />
          </div>
        </section>

        {/* ACT VI — LETTER + END */}
        <section id="act6" data-act="6">
          <div className="letter-zone">
            <div className="letter" id="letter" />
            <button id="voice-btn" className="voice-btn hidden" type="button">▶ bhai ki awaaz</button>
          </div>
          <div className="end" id="end">
            <canvas id="petals" aria-hidden="true" />
            <div className="moon moon-final" data-moon />
            <div className="end-kicker mono" />
            <h1 className="end-title" id="end-title" />
            <div className="end-name" id="end-name" />
            <p className="end-credit" />
            <div className="end-actions">
              <a className="end-btn primary" id="btn-call" href="#">call kar abhi</a>
              <button className="end-btn" id="btn-cert" type="button">rakhi certificate 📜</button>
              <a className="end-btn" id="btn-reply" href="#" target="_blank" rel="noopener">reply likh do</a>
            </div>
          </div>
          <footer className="site-foot mono">khoon ka rishta nahi tha. isliye sabse khaas hai. — ek hi chand ® 2026</footer>
        </section>
      </main>

      {/* overlays */}
      <div id="gallery" className="overlay hidden">
        <div className="overlay-head mono">DAYAN KI POORI FILE 🔓</div>
        <div className="gallery-grid" id="gallery-grid" />
        <button className="overlay-close" id="gallery-close" type="button">band karo ✕</button>
      </div>
      <div id="cert-modal" className="overlay hidden">
        <canvas id="cert-canvas" width="1400" height="1980" />
        <div className="cert-actions">
          <a className="end-btn primary" id="cert-dl" download="rakhi-certificate-diii.png" href="#">download 📜</a>
          <button className="end-btn" id="cert-close" type="button">wapas →</button>
        </div>
      </div>
      <div id="flicker" aria-hidden="true" />
    </>
  );
}
