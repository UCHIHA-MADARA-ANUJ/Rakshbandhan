'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';

export default function Lie() {
  const [verdict, setVerdict] = useState('');
  const [running, setRunning] = useState(false);
  const [needle, setNeedle] = useState(0);
  const runningRef = useRef(false);
  const cvRef = useRef(null);
  useReveals();

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const fit = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    fit(); addEventListener('resize', fit);
    let t = 0, amp = 0.25;
    window._lieAmp = 0.25;
    (function loop() {
      t += 0.03;
      amp += ((window._lieAmp || 0.25) - amp) * 0.08;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.lineWidth = 2;
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        ctx.strokeStyle = pass ? 'rgba(217,164,65,.85)' : 'rgba(255,46,77,.5)';
        for (let x = 0; x <= cv.width; x += 3) {
          const y = cv.height / 2
            + Math.sin(x * 0.045 + t * 3 + pass) * 8 * amp
            + Math.sin(x * 0.012 - t * 2) * 16 * amp
            + (Math.random() - 0.5) * 6 * amp * (runningRef.current ? 2.2 : 1);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      requestAnimationFrame(loop);
    })();
    return () => removeEventListener('resize', fit);
  }, []);

  const run = (item) => {
    if (runningRef.current) return;
    runningRef.current = true; setRunning(true); setVerdict(''); window._lieAmp = 1;
    getAudio()?.sfx('whoosh');
    const t0 = performance.now();
    const osc = setInterval(() => {
      const el = performance.now() - t0;
      setNeedle((Math.sin(el / 160) * 0.5 + 0.5) * item.danger);
      if (el > 2100) {
        clearInterval(osc);
        setNeedle(item.danger);
        setVerdict(item.v);
        runningRef.current = false; setRunning(false); window._lieAmp = 0.25;
        getAudio()?.sfx('stamp');
        try { navigator.vibrate?.(50); } catch {}
      }
    }, 90);
  };

  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.LIE.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.LIE.head[0]}</span>
          <span className="flip shock">{C.LIE.head[1]}</span>
        </h2>
        <p className="dist-sub">{C.LIE.sub}</p>
      </div>
      <div className="lie-box glass-terminal">
        <canvas ref={cvRef} id="lie-wave" aria-hidden="true" />
        <div className="lie-needle-wrap">
          <div className="lie-scale hud-txt"><span>TRUTH</span><span>LIE??</span></div>
          <div className="lie-meter"><i style={{ width: `${needle}%` }} /></div>
        </div>
        <div className="lie-qrow">
          {C.LIE.questions.map((item, i) => (
            <button key={i} className="lie-q" onClick={() => run(item)} disabled={running}>
              <span className="hud-txt">Q{i + 1}</span> {item.q}?
            </button>
          ))}
        </div>
        <div className={`lie-verdict ${verdict ? 'on' : ''}`}>{verdict || (running ? 'ANALYZING…' : 'AWAITING QUESTION')}</div>
      </div>
    </main>
  );
}
