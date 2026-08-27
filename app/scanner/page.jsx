'use client';
import { useEffect, useRef, useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';

export default function Scanner() {
  const [mood, setMood] = useState(0);
  const [pct, setPct] = useState(0);
  const touched = useRef(false);
  useReveals();

  // auto-scan until she grabs it
  useEffect(() => {
    const iv = setInterval(() => {
      if (touched.current) { clearInterval(iv); return; }
      setMood((m) => (m + 1) % C.SCAN.moods.length);
    }, 1700);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 3000);
      setPct(Math.round((1 - Math.pow(1 - p, 2)) * (88 + Math.random() * 10)));
      if (p < 1) requestAnimationFrame(step); else setPct(100);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const moodDrag = (() => {
    let sx = null, acc = 0;
    return {
      down: (e) => { touched.current = true; sx = e.clientX; acc = 0; try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} },
      move: (e) => {
        if (sx == null) return;
        acc += e.clientX - sx; sx = e.clientX;
        while (Math.abs(acc) > 42) {
          const d = acc > 0 ? 1 : -1;
          setMood((m) => Math.max(0, Math.min(C.SCAN.moods.length - 1, m + d)));
          getAudio()?.sfx('tick');
          acc = 0;
        }
      },
      up: () => { sx = null; },
    };
  })();

  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.SCAN.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.SCAN.head[0]}</span>
          <span className="flip shock">{C.SCAN.head[1]}</span>
        </h2>
      </div>
      <div className="scanner">
        <div className="scan-topline">
          <span className="hud-txt">SUBJECT_LOCK: {(pct)}%</span>
          <span className="hud-txt gold">CAM_01 · LIVE</span>
        </div>
        <div className="mood-stack"
          onPointerDown={moodDrag.down} onPointerMove={moodDrag.move}
          onPointerUp={moodDrag.up} onPointerCancel={moodDrag.up}>
          {C.SCAN.moods.map((m, i) => (
            <img key={m.slug} src={C.PHOTOS(m.slug)} alt={m.label} loading="lazy"
              className={i === mood ? 'on' : ''} draggable={false} />
          ))}
          <i className="scan-beam" />
          <i className="scan-grid" />
          <i className="scan-corners" />
        </div>
        <div className="mood-label hud-txt">{C.SCAN.moods[mood]?.label}</div>
        <div className="verdict hud-txt gold">{C.SCAN.verdict}</div>
        <p className="scan-foot">{C.SCAN.foot}</p>
      </div>
    </main>
  );
}
