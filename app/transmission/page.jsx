'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as C from '../content.js';
import { useReveals } from '../chrome.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Transmission() {
  useReveals();
  useEffect(() => {
    gsap.fromTo('.tline', { y: 30, opacity: 0, filter: 'blur(6px)' }, {
      y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, stagger: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: '.turn-lines', start: 'top 85%' },
    });
  }, []);
  return (
    <main className="page">
      <div className="sec-head">
        <p className="hud-txt gold mb">{C.TX.tag}</p>
        <h2 className="giant md">
          <span className="flip">{C.TX.head[0]}</span>
          <span className="flip shock">{C.TX.head[1]}</span>
        </h2>
      </div>
      <div className="phone-zone">
        <div className="phone">
          <i className="phone-notch" />
          <div className="phone-screen vault">
            <div className="vault-shimmer" />
            <span className="vault-seal">🔒</span>
            <span className="vault-label hud-txt gold">{C.TX.vaultLabel}</span>
            <span className="vault-note">{C.TX.vaultNote}</span>
          </div>
        </div>
      </div>
      <div className="turn">
        <div className="glass-terminal chat">
          <div className="term-dots"><i /><i /><i /></div>
          <p className="hud-txt dim mb">{C.TX.chatMeta} · 🔒</p>
          {C.TX.chat.map((m, i) => (
            <div key={i} className={`bub ${m.side}`}>
              {m.text}{m.time ? <span className="t hud-txt">{m.time}</span> : null}
            </div>
          ))}
        </div>
        <div className="turn-lines">
          <p className="tline" style={{ opacity: 0 }}>{C.TX.turn[0]}</p>
          <p className="tline soft" style={{ opacity: 0 }}>{C.TX.turn[1]}</p>
        </div>
      </div>
    </main>
  );
}
