'use client';
import { useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';

export default function Scanner() {
  const [mood, setMood] = useState(0);
  useReveals();

  const moodDrag = (() => {
    let sx = null, acc = 0;
    return {
      down: (e) => { sx = e.clientX; acc = 0; try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} },
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
        <div className="mood-label hud-txt">{C.SCAN.moods[mood]?.label}</div>
        <div className="verdict hud-txt gold">{C.SCAN.verdict}</div>
        <p className="scan-foot">{C.SCAN.foot}</p>
      </div>
    </main>
  );
}
