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

      <div className="syslog glass-terminal">
        <div className="term-dots"><i /><i /><i /></div>
        {C.TIMELINE.entries.map((e, i) => (
          <div className="logline" key={i} style={{ animationDelay: `${0.25 + i * 0.3}s` }}>
            <span className="log-ts hud-txt gold">[{e.d} · 2026]</span>
            <span className="log-t">{e.t}</span>
            <span className="log-l">{e.l}</span>
          </div>
        ))}
        <div className="logline live" style={{ animationDelay: `${0.25 + C.TIMELINE.entries.length * 0.3}s` }}>
          <span className="log-ts hud-txt gold">[NOW]</span>
          <span className="log-t">STATUS: <em className="pulse">READING THIS WEBSITE</em><i className="log-cursor" /></span>
        </div>
      </div>
      <p className="hud-txt gold center tl-tail">{C.TIMELINE.tail}</p>
    </main>
  );
}
