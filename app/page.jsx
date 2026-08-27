'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from './content.js';
import { useReveals, getAudio } from './chrome.jsx';
import { setAudioLevel } from './particles.jsx';

const DESC = {
  '/timeline': 'april 2026 to today. the whole story.',
  '/dossier': 'subject file: dayan. charges included.',
  '/scanner': 'face scan. 11 moods. all dumb.',
  '/transmission': 'my phone is a museum of you.',
  '/distance': '1,450 km. and why it lost.',
  '/ritual': 'tie the rakhi yourself. hold the button.',
  '/letter': 'the part i cannot say out loud',
  '/finale': 'the ending. obviously.',
  '/love': 'ok. one time only. look quick. ❤️',
};

const HOLD = 3600; // ms each line stays

// ── the 30 second opening film (one line at a time, crossfade) ──
function Intro({ onDone }) {
  const [now, setNow] = useState(0);
  const t0 = useRef(performance.now());

  useEffect(() => {
    let raf;
    const step = (t) => {
      const el = t - t0.current;
      setNow(el);
      if (el < C.INTRO.total) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // which line is on stage right now
  let cur = -1;
  C.INTRO.beats.forEach((b, i) => {
    if (now >= b.at && now < b.at + HOLD) cur = i;
  });
  const threadOn = cur === C.INTRO.beats.findIndex((b) => b.cls?.includes('thread'));

  return (
    <div id="intro">
      <div className="intro-stage">
        {C.INTRO.beats.map((b, i) => (
          <p key={i} className={`ibeat ${b.cls || ''} ${i === cur ? 'on' : ''}`}>{b.t}</p>
        ))}
        <svg className={`intro-thread ${threadOn ? 'draw' : ''}`} viewBox="0 0 300 40" aria-hidden="true">
          <circle className="it-dot a" cx="10" cy="20" r="4" />
          <circle className="it-dot b" cx="290" cy="20" r="4" />
          <path className="it-line" pathLength="100" d="M18,20 C 90,8 210,32 282,20" />
          <text className="it-label" x="150" y="12" textAnchor="middle">1,450 KM</text>
        </svg>
      </div>
      <div className="intro-progress"><i /></div>
      <button className="intro-skip" onClick={onDone}>{C.INTRO.skip}</button>
      <p className="intro-sound hud-txt">🎧 sound on, volume low</p>
    </div>
  );
}

// ── the strict gate ──
function Gate({ onPass }) {
  const [resp, setResp] = useState('');
  const [shake, setShake] = useState(false);
  const [stamp, setStamp] = useState(false);
  const wrong = useRef(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const check = () => {
    const v = (inputRef.current?.value || '').trim().toLowerCase();
    if (!v) return;
    for (const g of Object.values(C.GATE.accept)) {
      if (g.keys.some((k) => v.includes(k))) {
        setResp(g.resp); setStamp(true);
        getAudio()?.sfx('stamp');
        setAudioLevel(1); setTimeout(() => setAudioLevel(0.2), 800);
        try { navigator.vibrate?.(60); } catch {}
        sessionStorage.setItem('rk_ok', '1');
        dispatchEvent(new Event('rk-unlocked'));
        setTimeout(onPass, 1500);
        return;
      }
    }
    setResp(C.INTRO.wrong[wrong.current % C.INTRO.wrong.length]);
    wrong.current++;
    inputRef.current.value = '';
    setShake(true); setTimeout(() => setShake(false), 450);
    getAudio()?.sfx('tick');
  };
  return (
    <div id="gate2">
      <p className="hud-txt gold mb">{C.INTRO.gateTag}</p>
      <h2 className="gate-q">{C.INTRO.gateLine}</h2>
      <input ref={inputRef} className={shake ? 'shake' : ''} type="text"
        autoComplete="off" spellCheck="false" placeholder="type it…" aria-label="the name"
        onKeyDown={(e) => e.key === 'Enter' && check()} />
      <button className="gate-btn" onClick={check}>ENTER ↵</button>
      <p className="gate-resp hud-txt">{resp}</p>
      {stamp && <div className="gate-stamp on">ACCESS GRANTED<br /><span>— DAYAN CONFIRMED —</span></div>}
    </div>
  );
}

export default function Landing() {
  const [stage, setStage] = useState('intro'); // intro → gate → site
  useReveals();

  useEffect(() => {
    if (sessionStorage.getItem('rk_ok') === '1') setStage('site');
  }, []);

  const toGate = () => { setStage('gate'); getAudio()?.sfx('whoosh'); };
  const toSite = () => {
    getAudio()?.sfx('whoosh');
    setStage('site');
    setTimeout(() => setAudioLevel(0.16), 600);
  };

  if (stage === 'intro') return <Intro onDone={toGate} />;
  if (stage === 'gate') return <Gate onPass={toSite} />;

  return (
    <main className="page landing">
      <div className="hud">
        <div className="hud-txt tl">
          <span className="gold pulse">■ SIGNAL: STRONG</span>
          <span>SRC: GURUGRAM · 28.4595° N</span>
          <span>DEST: PUNE · 18.5204° N</span>
        </div>
        <div className="hud-txt tr">
          <span>THREAD_STATUS: INTACT</span>
          <span>MOON: SHARED · 1</span>
        </div>
        <div className="hud-txt bl">
          <span>ONE-TIME DEPLOYMENT</span>
          <span className="gold">FOR: DIDI ONLY</span>
        </div>
        <div className="hud-txt br">
          <span className="pulse">PICK A SEQUENCE BELOW</span>
          <i className="hud-line" />
        </div>
        <i className="corner c1" /><i className="corner c2" />
      </div>

      <p className="hud-txt gold center kicker-top">{C.LANDING.kicker}</p>

      <div className="selfrakhi" aria-hidden="true">
        <svg viewBox="0 0 300 300">
          <path className="spiral" pathLength="100"
            d="M150,60 C205,60 245,98 245,150 C245,203 202,242 150,242 C99,242 58,203 58,150 C58,105 94,72 138,72 C182,72 226,104 226,150 C226,191 190,222 152,222" />
          <g className="medal">
            <circle className="m-outer" cx="150" cy="150" r="34" />
            <circle className="m-inner" cx="150" cy="150" r="20" />
          </g>
          {[['150', '58'], ['230', '104'], ['230', '196'], ['150', '242'], ['70', '196'], ['70', '104']].map(([x, y], i) => (
            <circle key={i} className="bead" style={{ animationDelay: `${2.5 + i * 0.14}s` }} cx={x} cy={y} r="6" />
          ))}
        </svg>
      </div>

      <h1 className="giant hero-t">
        <span className="flip outline">{C.LANDING.line1}</span>
        <span className="flip glow">{C.LANDING.line2}</span>
      </h1>
      <p className="hero-sub hud-txt">{C.LANDING.sub}</p>

      <p className="hud-txt gold center grid-tag">{C.LANDING.gridTag}</p>
      <div className="seqgrid ok">
        {C.ROUTES.slice(1).map((r, i) => (
          <a key={r.path} href={r.path} className="seqcard gcard">
            <i className="shine" />
            <span className="seq-n hud-txt gold">0{i + 1}</span>
            <span className="seq-t">{r.tag}</span>
            <span className="seq-d hud-txt">{DESC[r.path]}</span>
            <span className="seq-a gold">ENTER →</span>
          </a>
        ))}
        <a href="/archive" className="seqcard gcard secret">
          <i className="shine" />
          <span className="seq-n hud-txt">??</span>
          <span className="seq-t dim">[EVERYTHING]</span>
          <span className="seq-d hud-txt">all 37 pics. yes all.</span>
          <span className="seq-a gold">OPEN →</span>
        </a>
      </div>
    </main>
  );
}
