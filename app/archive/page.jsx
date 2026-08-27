'use client';
import * as C from '../content.js';
import { useReveals } from '../chrome.jsx';

export default function Archive() {
  useReveals();
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
          <figure className="evcard" key={s}>
            <img loading="lazy" src={C.PHOTOS(s)} alt={`file ${i + 1}`} />
            <figcaption><b className="gold">FILE {String(i + 1).padStart(2, '0')}</b><span>dayan_incident_${String(i + 1).padStart(2, '0')}.webp</span></figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
