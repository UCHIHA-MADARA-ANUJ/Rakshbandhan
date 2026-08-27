// ═══════ EASTER EGGS ═══════
export function initEggs(audio) {
  const toast = (msg, ms = 2400) => {
    let el = document.getElementById('egg-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'egg-toast';
      el.style.cssText = 'position:fixed;bottom:26px;left:50%;transform:translate(-50%,20px);' +
        'background:#151525;border:1px solid #D9A441;color:#F2E8D5;padding:12px 22px;border-radius:999px;' +
        'font-family:"Space Mono",monospace;font-size:.78rem;z-index:99;opacity:0;transition:all .4s;pointer-events:none;max-width:86vw;text-align:center';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = 'translate(-50%,0)'; });
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translate(-50%,20px)'; }, ms);
  };

  // 1. moon tap ×5 → full classified file
  let moonTaps = 0, moonT;
  document.addEventListener('click', (e) => {
    const m = e.target.closest('[data-moon]');
    if (!m) return;
    moonTaps++; clearTimeout(moonT);
    moonT = setTimeout(() => moonTaps = 0, 1600);
    if (moonTaps === 3) toast('…continue 👀');
    if (moonTaps >= 5) {
      moonTaps = 0; audio?.sfx('whoosh');
      document.getElementById('gallery').classList.remove('hidden');
    }
  });
  document.getElementById('gallery-close').addEventListener('click', () =>
    document.getElementById('gallery').classList.add('hidden'));

  // 2. type "chudail" anywhere
  let buf = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-10);
    if (buf.includes('chudail')) {
      buf = '';
      const f = document.getElementById('flicker');
      f.classList.add('on'); audio?.sfx('stamp');
      setTimeout(() => { f.classList.remove('on'); toast('kaun bola? 👀'); }, 800);
    }
  });

  // 3. soft toy — dont touch (in gallery)
  document.getElementById('gallery-grid').addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (img && (img.alt.includes('soft-toy'))) {
      img._t = (img._t || 0) + 1;
      audio?.sfx('squeak');
      if (img._t >= 3) { toast('usko mat chhed. wo mere side ka hai. 🧸'); img._t = 0; }
    }
  });

  // 4. long-press phone pfp → protected content
  let lpT;
  document.getElementById('phone-screen')?.addEventListener('touchstart', (e) => {
    const pp = e.target.closest('.pp'); if (!pp) return;
    lpT = setTimeout(() => toast('PROTECTED CONTENT — didi ke messages, dil mein stored 🤍'), 900);
  });
  document.addEventListener('touchend', () => clearTimeout(lpT));
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.pp')) toast('PROTECTED CONTENT — didi ke messages, dil mein stored 🤍');
  });

  // 5. konami → halloween mode 10s
  const konami = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
  let kbuf = [];
  document.addEventListener('keydown', (e) => {
    kbuf.push(e.key.toLowerCase()); kbuf = kbuf.slice(-10);
    if (kbuf.join(',') === konami) {
      document.body.classList.add('halloween');
      audio?.sfx('squeak');
      toast('asli roop — halloween mode 🎃 10 sec ke liye');
      setTimeout(() => document.body.classList.remove('halloween'), 10000);
    }
  });

  // 6. tab blur → title change
  const orig = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'wapas aa ja dayan 😾' : orig;
  });

  // 7. 2:22 — mood wall label tap reveals tiny secret
  let mTaps = 0;
  document.getElementById('mood-label')?.addEventListener('click', () => {
    mTaps++;
    if (mTaps >= 7) { mTaps = 0; toast('2:22 — dayan ka official time. ab mahino se. 🌙'); }
  });
}
