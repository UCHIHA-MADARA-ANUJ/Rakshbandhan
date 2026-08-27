'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from './content.js';
import { useReveals, getAudio } from './chrome.jsx';
import { setAudioLevel } from './particles.jsx';

const DESC = {
  '/timeline': 'april 2026 → today. the whole story.',
  '/dossier': 'subject file: dayan — charges, evidence, threat level',
  '/scanner': 'facial recognition — 11 moods indexed',
  '/transmission': 'her phone. her words. the birthday.',
  '/distance': '1,424 km — and why it lost',
  '/ritual': 'tie the rakhi yourself. hold to tie.',
  '/letter': 'the part i can\'t say out loud',
  '/finale': 'the final transmission',
};

export default function Landing() {
  const [gateResp, setGateResp] = useState('');
  const [ok, setOk] = useState(false);
  const wrong = useRef(0);
  const inputRef = useRef(null);
  useReveals();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const check = () => {
    const v = inputRef.current?.value.trim().toLowerCase();
    if (!v || ok) return;
    for (const g of Object.values(C.GATE.accept)) {
      if (g.keys.some((k) => v.includes(k))) {
        setOk(true);
        setGateResp(C.LANDING.granted);
        getAudio()?.sfx('stamp');
        setAudioLevel(1); setTimeout(() => setAudioLevel(0.2), 900);
        return;
      }
    }
    if (wrong.current >= 2) {
      setOk(true); setGateResp(C.LANDING.fine); return;
    }
    setGateResp(C.LANDING.wrong[wrong.current % C.LANDING.wrong.length]);
    wrong.current++;
    inputRef.current.value = '';
  };

  return (
    <main className="page landing">
      <div className="hud">
        <div className="hud-txt tl">
          <span className="gold pulse">■ SIGNAL: STRONG</span>
          <span>SRC: GURUGRAM · 28.4595° N</span>
          <span>DEST: MUMBAI · 19.0760° N</span>
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
          <span className="pulse">SELECT SEQUENCE BELOW</span>
          <i className="hud-line" />
        </div>
        <i className="corner c1" /><i className="corner c2" />
      </div>

      <p className="hud-txt gold center kicker-top">{C.LANDING.kicker}</p>

      {/* the rakhi that ties itself */}
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

      {/* verify */}
      <div className={`glass-terminal gate-box ${ok ? 'ok' : ''}`}>
        <p className="hud-txt gold mb">{C.LANDING.gateTag}</p>
        <h2 className="gate-q">{ok ? C.LANDING.granted : C.LANDING.gateQ}</h2>
        {!ok && (
          <>
            <input ref={inputRef} type="text" autoComplete="off" spellCheck="false"
              placeholder={C.LANDING.placeholder} aria-label="verify recipient"
              onKeyDown={(e) => e.key === 'Enter' && check()} />
            <button className="gate-btn" onClick={check}>SUBMIT ↵</button>
          </>
        )}
        <p className="gate-resp hud-txt">{gateResp}</p>
      </div>

      {/* sequence grid */}
      <p className="hud-txt gold center grid-tag">{C.LANDING.gridTag}</p>
      <div className={`seqgrid ${ok ? 'ok' : 'locked'}`}>
        {C.ROUTES.slice(1).map((r, i) => (
          <a key={r.path} href={r.path} className="seqcard gcard">
            <i className="shine" />
            <span className="seq-n hud-txt gold">0{i + 1}</span>
            <span className="seq-t">{r.tag}</span>
            <span className="seq-d hud-txt">{DESC[r.path]}</span>
            <span className="seq-a gold">ENTER →</span>
            {!ok && <span className="lock">🔒</span>}
          </a>
        ))}
        <a href="/archive" className="seqcard gcard secret">
          <i className="shine" />
          <span className="seq-n hud-txt">??</span>
          <span className="seq-t dim">[REDACTED]</span>
          <span className="seq-d hud-txt">classified archive · 37 files</span>
          <span className="seq-a gold">CRACK →</span>
        </a>
      </div>
    </main>
  );
}
