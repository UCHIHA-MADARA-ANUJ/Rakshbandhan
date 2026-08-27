'use client';
import { useEffect, useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';

export default function Dossier() {
  const [open, setOpen] = useState(-1);
  useReveals();

  useEffect(() => {
    const k = (e) => {
      if (open < 0) return;
      if (e.key === 'ArrowRight') setOpen((o) => Math.min(C.FILE.exhibits.length - 1, o + 1));
      if (e.key === 'ArrowLeft') setOpen((o) => Math.max(0, o - 1));
      if (e.key === 'Escape') setOpen(-1);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [open]);

  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.FILE.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.FILE.head[0]}</span>
          <span className="flip shock">{C.FILE.head[1]}</span>
        </h2>
      </div>

      <div className="threat">
        <span className="hud-txt gold">THREAT LEVEL:</span>
        <div className="threat-bar"><i /></div>
        <span className="threat-val">MAXIMUM</span>
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

      <div className="aliases">
        <p className="hud-txt gold mb">{C.ALIASES.tag}</p>
        <div className="alias-row">
          {C.ALIASES.list.map((a, i) => <span key={i} className="alias">{a}</span>)}
        </div>
      </div>

      <div id="evidence">
        <p className="hud-txt gold mb center">{C.FILE.exhibitsTag}</p>
        <div className="filmstrip">
          {C.FILE.exhibits.map((e, i) => (
            <figure className="evcard" key={e.slug} onClick={() => { setOpen(i); getAudio()?.sfx('tick'); }}>
              <img loading="lazy" src={C.PHOTOS(e.slug)} alt={e.cap} />
              <figcaption>
                <b className="gold">{e.tag}</b>
                <span>{e.cap}</span>
                <em className="hud-txt">CASE 2026/{String(i + 1).padStart(3, '0')}</em>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="drag-hint hud-txt">← DRAG · TAP TO OPEN →</p>
      </div>

      <div className="withheld">
        <p className="hud-txt gold mb center">{C.FILE.withheldTag}</p>
        <div className="incidents">
          {C.FILE.withheld.map((t, i) => (
            <div className="incident" key={i}>
              <span className="inc-red hud-txt">[WITHHELD]</span>
              <span className="inc-t">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {open >= 0 && (
        <div className="lightbox" onClick={() => setOpen(-1)}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <img src={C.PHOTOS(C.FILE.exhibits[open].slug)} alt={C.FILE.exhibits[open].cap} />
            <div className="lb-bar">
              <button className="fbtn" onClick={() => setOpen((o) => Math.max(0, o - 1))}>← PREV</button>
              <span className="hud-txt gold">{C.FILE.exhibits[open].tag} — {C.FILE.exhibits[open].cap}</span>
              <button className="fbtn" onClick={() => setOpen((o) => Math.min(C.FILE.exhibits.length - 1, o + 1))}>NEXT →</button>
            </div>
          </div>
          <button className="lb-close" onClick={() => setOpen(-1)}>CLOSE ✕</button>
        </div>
      )}
    </main>
  );
}
