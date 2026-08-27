'use client';
import * as C from '../content.js';
import { useReveals } from '../chrome.jsx';

export default function Dossier() {
  useReveals();
  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.FILE.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.FILE.head[0]}</span>
          <span className="flip shock">{C.FILE.head[1]}</span>
        </h2>
      </div>
      <div className="charge-roll hud-txt">
        {C.FILE.charges.map((c, i) => <span key={i}>⚠ {c}</span>)}
      </div>
      <div className="threat">
        <span className="hud-txt gold">THREAT LEVEL:</span>
        <div className="threat-bar"><i /></div>
        <span className="threat-val">MAXIMUM</span>
      </div>
      <div className="aliases">
        <p className="hud-txt gold mb">{C.ALIASES.tag}</p>
        <div className="alias-row">
          {C.ALIASES.list.map((a, i) => <span key={i} className="alias">{a}</span>)}
        </div>
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
      <div id="incidents">
        <p className="hud-txt gold mb center">{C.FILE.incidentsTag}</p>
        <div className="incidents">
          {C.FILE.incidents.map((t, i) => (
            <div className="incident" key={i}>
              <span className="inc-red hud-txt">[PHOTO REMOVED]</span>
              <span className="inc-t">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
