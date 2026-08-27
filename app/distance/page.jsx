'use client';
import { useEffect, useState } from 'react';
import * as C from '../content.js';
import { useReveals } from '../chrome.jsx';

export default function Distance() {
  const [km, setKm] = useState(0);
  useReveals();
  useEffect(() => {
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 2400);
      setKm(Math.round((1 - Math.pow(1 - p, 3)) * C.DIST.kmMax));
      if (p < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <main className="page">
      <p className="hud-txt gold mb center">{C.DIST.tag}</p>
      <div className="km-wrap">
        <span className="km">{km.toLocaleString('en-IN')}</span>
        <span className="km-unit hud-txt">KM BETWEEN US</span>
      </div>
      <h2 className="giant md center-h">
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
    </main>
  );
}
