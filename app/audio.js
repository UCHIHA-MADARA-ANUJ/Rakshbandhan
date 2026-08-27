// ═══════════════════════════════════════════════════════════
//  BAARISHEEN ENGINE — live generative score (WebAudio, 0 KB)
//  rain noise + Karplus-Strong plucked strings + soft pad.
//  inspired-by, not copied. every playthrough = slightly different.
// ═══════════════════════════════════════════════════════════
export class Baarishein {
  constructor() {
    this.ctx = null; this.master = null;
    this.energy = 0;          // 0 = rain only … 1 = full song
    this.targetEnergy = 0;
    this.muted = localStorage.getItem('rk_mute') === '1';
    this.started = false;
    this.step = 0;
    this.timer = null;
    this.musicEl = null;      // optional mp3 override
    // gentle, Baarishein-coded progression (Maj7 family, ~72bpm)
    this.prog = [
      { root: 'C3',  chord: ['C3','G3','B3','E4'] },
      { root: 'A2',  chord: ['A2','E3','G3','C4'] },
      { root: 'F2',  chord: ['F2','C3','E3','A3'] },
      { root: 'G2',  chord: ['G2','D3','F#3','B3'] },
    ];
    this.freqs = this.buildFreqs();
  }

  buildFreqs() {
    const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const f = {};
    for (let oct = 1; oct <= 5; oct++) for (let i = 0; i < 12; i++) {
      const midi = 12 * (oct + 1) + i;
      f[names[i] + oct] = 440 * Math.pow(2, (midi - 69) / 12);
    }
    return f;
  }

  note(n) { return this.freqs[n] || 261.6; }

  async unlock() {
    if (this.started) { if (this.ctx.state === 'suspended') await this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 1;
    this.master.connect(this.ctx.destination);
    this.buildRain();
    this.buildPad();
    this.started = true;
    // lookahead scheduler
    this.nextT = this.ctx.currentTime + 0.2;
    this.timer = setInterval(() => this.schedule(), 240);
  }

  setMuted(m) {
    this.muted = m; localStorage.setItem('rk_mute', m ? '1' : '0');
    if (this.master) this.master.gain.linearRampToValueAtTime(m ? 0 : 1, this.ctx.currentTime + 0.3);
    if (this.musicEl) this.musicEl.volume = m ? 0 : 0.85;
  }

  // ── rain: filtered noise, two layers ──────────────
  buildRain() {
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { // pinkish
      const w = Math.random() * 2 - 1;
      last = 0.98 * last + 0.02 * w;
      d[i] = last * 3.2;
    }
    const mk = (type, freq, q, gain, lfoRate) => {
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = this.ctx.createGain(); g.gain.value = gain;
      src.connect(f); f.connect(g); g.connect(this.master); src.start();
      if (lfoRate) {
        const lfo = this.ctx.createOscillator(); lfo.frequency.value = lfoRate;
        const lg = this.ctx.createGain(); lg.gain.value = gain * 0.4;
        lfo.connect(lg); lg.connect(g.gain); lfo.start();
      }
      return g;
    };
    this.rainBase = mk('lowpass', 900, 0.5, 0.045, 0.07);   // body of rain
    this.rainHi  = mk('bandpass', 3400, 0.8, 0.02, 0.13);   // sparkle drops
  }

  // ── pad: two slow detuned sines per chord root ────
  buildPad() {
    this.padGain = this.ctx.createGain(); this.padGain.gain.value = 0;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    this.padGain.connect(lp); lp.connect(this.master);
    this.padOscs = [];
    [-4, 0, 3].forEach((det) => {
      const o = this.ctx.createOscillator(); o.type = 'triangle';
      o.detune.value = det * 1.5;
      const g = this.ctx.createGain(); g.gain.value = 0.05;
      o.connect(g); g.connect(this.padGain); o.start();
      this.padOscs.push(o);
    });
  }

  setPadChord(freq) {
    if (!this.padOscs) return;
    this.padOscs[0].frequency.linearRampToValueAtTime(freq / 2, this.ctx.currentTime + 0.8);
    this.padOscs[1].frequency.linearRampToValueAtTime(freq, this.ctx.currentTime + 0.8);
    this.padOscs[2].frequency.linearRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.8);
  }

  // ── pluck: Karplus-Strong via feedback delay ──────
  pluck(freq, when, vel = 0.5, damp = 2800) {
    if (this.musicEl) return; // mp3 override active
    const c = this.ctx;
    const burst = c.createBufferSource();
    const bl = Math.ceil(c.sampleRate * 0.018);
    const b = c.createBuffer(1, bl, c.sampleRate);
    const bd = b.getChannelData(0);
    for (let i = 0; i < bl; i++) bd[i] = (Math.random() * 2 - 1) * (1 - i / bl);
    burst.buffer = b;
    const delay = c.createDelay(0.05);
    delay.delayTime.value = 1 / freq;
    const fb = c.createGain(); fb.gain.value = 0.972;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = damp;
    const out = c.createGain();
    out.gain.setValueAtTime(0, when);
    out.gain.linearRampToValueAtTime(vel, when + 0.008);
    out.gain.exponentialRampToValueAtTime(0.0001, when + 2.6);
    burst.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay);
    delay.connect(out); out.connect(this.master);
    burst.start(when);
    if (this.onPulse) {
      const delay = Math.max(0, (when - this.ctx.currentTime) * 1000);
      setTimeout(() => { try { this.onPulse(vel); } catch {} }, delay);
    }
  }

  // ── scheduler: arpeggio at 72bpm, density by energy ─
  schedule() {
    if (!this.started) return;
    this.energy += (this.targetEnergy - this.energy) * 0.04;
    if (this.padGain) this.padGain.gain.setTargetAtTime(0.028 * this.energy, this.ctx.currentTime, 1.2);
    if (this.rainBase) this.rainBase.gain.setTargetAtTime(0.045 + 0.02 * this.energy, this.ctx.currentTime, 2);
    if (this.musicEl || this.energy < 0.08) return;
    const beat = 60 / 72;
    while (this.nextT < this.ctx.currentTime + 0.6) {
      const t = this.nextT;
      const bar = Math.floor(this.step / 8) % this.prog.length;
      const { chord, root } = this.prog[bar];
      const i = this.step % 8;
      if (i === 0) this.setPadChord(this.note(root));
      // pattern: steady arpeggio + ghost notes at higher energy
      const n = chord[i % chord.length];
      const v = 0.32 + 0.18 * this.energy + Math.random() * 0.06;
      this.pluck(this.note(n) * (i === 4 && Math.random() < this.energy ? 2 : 1), t, v * (i % 2 ? 0.7 : 1));
      if (i === 6 && Math.random() < this.energy * 0.6) { // sparkle octave
        this.pluck(this.note(chord[(i + 2) % chord.length]) * 2, t + beat * 0.5, 0.16 * this.energy, 3600);
      }
      this.step++;
      this.nextT += beat / 2; // 8th notes
    }
  }

  setEnergy(e) { this.targetEnergy = Math.max(0, Math.min(1, e)); }

  // optional: play an mp3 instead of generative plucks
  async attachMusic(url) {
    try {
      const r = await fetch(url, { method: 'HEAD' });
      if (!r.ok) return false;
      this.musicEl = new Audio(url);
      this.musicEl.loop = true; this.musicEl.volume = this.muted ? 0 : 0.85;
      return true;
    } catch { return false; }
  }
  startMusic() { if (this.musicEl) this.musicEl.play().catch(() => {}); }

  // ── sfx ───────────────────────────────────────────
  sfx(kind) {
    if (!this.ctx || this.muted) return;
    const c = this.ctx, t = c.currentTime;
    const g = c.createGain(); g.connect(this.master);
    if (kind === 'stamp') {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(g); o.start(t); o.stop(t + 0.3);
    } else if (kind === 'tick') {
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = 1900;
      g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      o.connect(g); o.start(t); o.stop(t + 0.06);
    } else if (kind === 'squeak') {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(620, t); o.frequency.linearRampToValueAtTime(980, t + 0.12);
      o.frequency.linearRampToValueAtTime(700, t + 0.24);
      g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g); o.start(t); o.stop(t + 0.32);
    } else if (kind === 'whoosh') {
      const len = c.sampleRate * 0.6, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = c.createBufferSource(); s.buffer = b;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.1;
      f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.5);
      g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      s.connect(f); f.connect(g); g.connect(this.master); s.start(t);
    }
  }

  duck(on) { // under voice note
    if (!this.master || this.musicEl) return;
    const target = (this.muted ? 0 : 1) * (on ? 0.25 : 1);
    this.master.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.4);
    if (this.musicEl) this.musicEl.volume = (this.muted ? 0 : 0.85) * (on ? 0.2 : 1);
  }
}
