'use client';
import * as C from '../content.js';
import { useReveals } from '../chrome.jsx';

export default function Timeline() {
  useReveals();
  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.TIMELINE.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.TIMELINE.head[0]}</span>
          <span className="flip gold-t">{C.TIMELINE.head[1]}</span>
        </h2>
        <p className="dist-sub">{C.TIMELINE.sub}</p>
      </div>

      <div className="tl">
        {C.TIMELINE.nodes.map((n, i) => (
          <div className="tl-node" key={i}>
            <div className="tl-marker"><i /><em /></div>
            <div className="tl-card gcard">
              <i className="shine" />
              <span className="hud-txt gold">{n.date}</span>
              <h3 className="tl-title">{n.title}</h3>
              <p className="tl-d">{n.d}</p>
            </div>
            <div className="tl-numeral">{n.date.split(' ')[0]}</div>
          </div>
        ))}
        <div className="tl-line" aria-hidden="true" />
      </div>
      <p className="hud-txt gold center tl-tail">{C.TIMELINE.tail}</p>
    </main>
  );
}
