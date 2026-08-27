'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';
import { setAudioLevel } from '../particles.jsx';

export default function Ritual() {
  const [prog, setProg] = useState(0);
  const [holding, setHolding] = useState(false);
  const [tied, setTied] = useState(false);
  const progRef = useRef(0);
  const holdRef = useRef(false);
  const tiedRef = useRef(false);
  useReveals();

  useEffect(() => {
    let raf; let last = performance.now();
    const step = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!tiedRef.current) {
        progRef.current = holdRef.current
          ? Math.min(100, progRef.current + dt * 30)
          : Math.max(0, progRef.current - dt * 26);
        if (progRef.current >= 100) {
          tiedRef.current = true; setTied(true);
          const a = getAudio();
          a?.rise(false);
          a?.sfx('stamp'); a?.sfx('whoosh');
          setAudioLevel(1);
          setTimeout(() => setAudioLevel(0.8), 1200);
          try { navigator.vibrate?.([50, 60, 120]); } catch {}
          document.body.classList.add('shake');
          setTimeout(() => document.body.classList.remove('shake'), 600);
        }
        setProg(progRef.current);
        getAudio()?.risePitch(progRef.current / 100);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); getAudio()?.rise(false); };
  }, []);

  const setHold = (on) => {
    holdRef.current = on; setHolding(on);
    getAudio()?.rise(on);
  };

  const wrapP = (i) => Math.max(0, Math.min(1, (prog - i * 30) / 26));
  const medal = tied || prog > 88;

  return (
    <main className="page ritual">
      <p className="hud-txt gold center">{C.RITUAL.tag}</p>
      <h2 className="giant md center-h">
        <span className="flip">{C.RITUAL.head[0]}</span>
        <span className="flip shock">{C.RITUAL.head[1]}</span>
      </h2>
      <p className="dist-sub">{C.RITUAL.sub}</p>

      <div className={`tie-stage ${tied ? 'tied' : ''}`}>
        <div className="hand-frame">
          <svg className="wrist-art" viewBox="0 0 300 300" aria-hidden="true">
            <path className="wr-line" d="M14,118 C 90,100 210,100 286,118" />
            <path className="wr-line" d="M14,182 C 90,200 210,200 286,182" />
            <path className="wr-line faint" d="M286,118 C 300,124 300,176 286,182" />
            <path className="wr-line faint" d="M22,130 C 30,150 30,150 22,170" />
          </svg>
          <svg className="rakhi" viewBox="0 0 300 300" aria-hidden="true">
            <ellipse className="rk-wrap" style={{ strokeDashoffset: 100 - wrapP(0) * 100 }} cx="150" cy="150" rx="98" ry="36" />
            <ellipse className="rk-wrap alt" style={{ strokeDashoffset: 100 - wrapP(1) * 100 }} cx="150" cy="150" rx="84" ry="30" />
            <ellipse className="rk-wrap" style={{ strokeDashoffset: 100 - wrapP(2) * 100 }} cx="150" cy="150" rx="70" ry="25" />
            <g className={`rk-center ${medal ? 'on' : ''}`}>
              <circle className="rk-outer" cx="150" cy="150" r="34" />
              <circle className="rk-inner" cx="150" cy="150" r="20" />
              <circle className="rk-dot" cx="150" cy="112" r="4" />
              <circle className="rk-dot" cx="184" cy="128" r="4" />
              <circle className="rk-dot" cx="184" cy="172" r="4" />
              <circle className="rk-dot" cx="150" cy="188" r="4" />
              <circle className="rk-dot" cx="116" cy="172" r="4" />
              <circle className="rk-dot" cx="116" cy="128" r="4" />
            </g>
          </svg>
          <i className="target-ring" />
          <div className="date-stamp hud-txt">{C.RITUAL.stamp}</div>
        </div>

        <div className="hold-zone">
          <button
            className={`hold-btn ${holding && !tied ? 'holding' : ''} ${tied ? 'done' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); setHold(true); }}
            onPointerUp={() => setHold(false)}
            onPointerLeave={() => setHold(false)}
            onPointerCancel={() => setHold(false)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <svg className="hring" viewBox="0 0 120 120">
              <circle className="hr-bg" cx="60" cy="60" r="54" />
              <circle className="hr-fg" cx="60" cy="60" r="54"
                style={{ strokeDashoffset: 339 - (tied ? 100 : prog) / 100 * 339 }} />
            </svg>
            <span>{tied ? C.RITUAL.tiedTitle : holding ? C.RITUAL.releasing : C.RITUAL.hold}</span>
          </button>
          <p className="hud-txt center">{tied ? C.RITUAL.tiedSub : C.RITUAL.hint}</p>
          {tied && <a className="fbtn primary" href="/letter">{C.RITUAL.tiedNext}</a>}
        </div>
      </div>
    </main>
  );
}
