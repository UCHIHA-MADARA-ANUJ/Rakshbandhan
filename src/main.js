// ═══════ EK HI CHAAND — boot ═══════
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';

import { Baarishein } from './audio.js';
import { render, initStory, setAudioRef } from './director.js';
import { initGate } from './gate.js';
import { initEggs } from './eggs.js';
import * as C from './content.js';

const $ = (s) => document.querySelector(s);

(async function boot() {
  render();
  const audio = new Baarishein();
  setAudioRef(audio);

  // ── preloader ──
  const ring = $('#moon-ring-fg'), lines = $('#pre-lines'), btn = $('#enter-btn'), hint = $('#pre-hint');
  C.PRELOADER.lines.forEach((l) => {
    const p = document.createElement('p');
    if (l.cls) p.className = l.cls;
    p.textContent = l.t; lines.appendChild(p);
  });
  const paras = [...lines.children];
  paras.forEach((p, i) => setTimeout(() => p.classList.add('on'), 500 + i * 1300));
  let prog = 0;
  const ringT = setInterval(() => {
    prog = Math.min(96, prog + 3 + Math.random() * 7);
    ring.style.strokeDashoffset = 327 - (327 * prog) / 100;
  }, 130);
  try { await document.fonts.ready; } catch {}
  setTimeout(() => {
    clearInterval(ringT);
    ring.style.strokeDashoffset = 0;
    btn.classList.remove('hidden'); hint.classList.remove('hidden');
  }, Math.max(2400, 500 + C.PRELOADER.lines.length * 1300 + 600));

  // ── enter → audio unlock → gate ──
  btn.addEventListener('click', async () => {
    await audio.unlock();
    audio.setEnergy(0.06);
    audio.sfx('whoosh');
    $('#preloader').classList.add('gone');
    setTimeout(() => $('#preloader').remove(), 1000);
    $('#gate').classList.remove('hidden');
    $('#gate-input').focus();
  }, { once: true });

  initGate(async () => {
    $('#mute').hidden = false;
    initStory();
    audio.sfx('stamp');
    // optional mp3 override + voice note support
    const hasMusic = await audio.attachMusic('audio/music.mp3');
    if (hasMusic) audio.startMusic();
    try {
      const r = await fetch('audio/voice.m4a', { method: 'HEAD' });
      if (r.ok) {
        const vb = $('#voice-btn');
        vb.classList.remove('hidden');
        const el = new Audio('audio/voice.m4a');
        el.addEventListener('ended', () => { vb.classList.remove('playing'); audio.duck(false); });
        vb.addEventListener('click', () => {
          if (el.paused) { el.play(); vb.classList.add('playing'); vb.textContent = '▶ chal rahi hai… sun lo'; audio.duck(true); }
          else { el.pause(); vb.classList.remove('playing'); vb.textContent = '▶ sun lo — bhai ki awaaz'; audio.duck(false); }
        });
      }
    } catch {}
  });

  // ── mute ──
  const muteBtn = $('#mute'), muteIco = $('#mute-ico');
  const syncMute = () => { muteIco.textContent = audio.muted ? '🔇' : '🔊'; };
  syncMute();
  muteBtn.addEventListener('click', () => { audio.setMuted(!audio.muted); syncMute(); });

  initEggs(audio);
})();
