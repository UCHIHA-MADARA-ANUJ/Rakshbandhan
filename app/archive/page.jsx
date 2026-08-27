'use client';
import { useEffect, useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';

export default function Archive() {
  const [open, setOpen] = useState(-1);
  useReveals();

  useEffect(() => {
    const k = (e) => {
      if (open < 0) return;
      if (e.key === 'ArrowRight') setOpen((o) => Math.min(C.ALL_SLUGS.length - 1, o + 1));
      if (e.key === 'ArrowLeft') setOpen((o) => Math.max(0, o - 1));
      if (e.key === 'Escape') setOpen(-1);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [open]);

  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.ARCHIVE.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.ARCHIVE.head[0]}</span>
          <span className="flip gold-t">{C.ARCHIVE.head[1]}</span>
        </h2>
        <p className="dist-sub">{C.ARCHIVE.sub}</p>
      </div>
      <div className="archive-grid">
        {C.ALL_SLUGS.map((s, i) => (
          <figure className="evcard" key={s} onClick={() => { setOpen(i); getAudio()?.sfx('tick'); }}>
            <img loading="lazy" src={C.PHOTOS(s)} alt={`file ${i + 1}`} />
            <figcaption><b className="gold">FILE {String(i + 1).padStart(2, '0')}</b><span>dayan_incident_{String(i + 1).padStart(2, '0')}.webp</span></figcaption>
          </figure>
        ))}
      </div>

      {open >= 0 && (
        <div className="lightbox" onClick={() => setOpen(-1)}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <img src={C.PHOTOS(C.ALL_SLUGS[open])} alt={`file ${open + 1}`} />
            <div className="lb-bar">
              <button className="fbtn" onClick={() => setOpen((o) => Math.max(0, o - 1))}>← PREV</button>
              <span className="hud-txt gold">FILE {String(open + 1).padStart(2, '0')} / {C.ALL_SLUGS.length}</span>
              <button className="fbtn" onClick={() => setOpen((o) => Math.min(C.ALL_SLUGS.length - 1, o + 1))}>NEXT →</button>
            </div>
          </div>
          <button className="lb-close" onClick={() => setOpen(-1)}>CLOSE ✕</button>
        </div>
      )}
    </main>
  );
}
