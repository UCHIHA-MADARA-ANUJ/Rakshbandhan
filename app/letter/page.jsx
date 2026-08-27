'use client';
import { useEffect, useState } from 'react';
import * as C from '../content.js';
import { useReveals, getAudio } from '../chrome.jsx';

export default function Letter() {
  const [hasVoice, setHasVoice] = useState(false);
  useReveals();
  useEffect(() => {
    fetch('audio/voice.m4a', { method: 'HEAD' }).then((r) => r.ok && setHasVoice(true)).catch(() => {});
  }, []);
  return (
    <main className="page">
      <p className="hud-txt gold mb center">{C.LETTER.tag}</p>
      <div className="letter-grid">
        <h2 className="giant md">
          <span className="flip">{C.LETTER.flipWords[0]}</span>
          <span className="flip gold-t">{C.LETTER.flipWords[1]}</span>
        </h2>
        <div className="letter-col">
          <div className="letter-body">
            {C.LETTER.body.map((l, i) => <p key={i}>{l}</p>)}
            <p className="sign">{C.LETTER.sign}</p>
            <p className="ps">{C.LETTER.ps}</p>
          </div>
          {hasVoice && (
            <button className="voice-btn" onClick={() => {
              const el = new Audio('audio/voice.m4a');
              getAudio()?.duck(true);
              el.play(); el.addEventListener('ended', () => getAudio()?.duck(false));
            }}>▶ bhai ki awaaz</button>
          )}
        </div>
      </div>
    </main>
  );
}
