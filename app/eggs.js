// ═══════ EASTER EGGS (react-friendly) ═══════
export function initEggs({ sfx, onGallery }) {
  const toast = (msg, ms = 2400) => {
    let el = document.getElementById('egg-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'egg-toast';
      el.style.cssText = 'position:fixed;bottom:76px;left:50%;transform:translate(-50%,20px);' +
        'background:#151525;border:1px solid #D9A441;color:#F2E8D5;padding:12px 22px;border-radius:999px;' +
        'font-family:monospace;font-size:.78rem;z-index:99;opacity:0;transition:all .4s;pointer-events:none;max-width:86vw;text-align:center';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = 'translate(-50%,0)'; });
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = 0; el.style.transform = 'translate(-50%,20px)'; }, ms);
  };

  // moon tap ×5 → classified file
  let moonTaps = 0, moonT;
  document.addEventListener('click', (e) => {
    const m = e.target.closest('[data-moon]');
    if (!m) return;
    moonTaps++; clearTimeout(moonT);
    moonT = setTimeout(() => (moonTaps = 0), 1600);
    if (moonTaps === 3) toast('…continue 👀');
    if (moonTaps >= 5) { moonTaps = 0; sfx?.('whoosh'); toast('pics: deleted. all of them. forever. 🖤'); }
  });

  // type "chudail"
  let buf = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-10);
    if (buf.includes('chudail')) {
      buf = '';
      const f = document.getElementById('flicker');
      f.classList.add('on'); sfx?.('stamp');
      setTimeout(() => { f.classList.remove('on'); toast('kaun bola? 👀'); }, 800);
    }
  });

  // konami → halloween
  const konami = 'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a';
  let kbuf = [];
  document.addEventListener('keydown', (e) => {
    kbuf.push(e.key.toLowerCase()); kbuf = kbuf.slice(-10);
    if (kbuf.join(',') === konami) {
      document.body.classList.add('halloween');
      sfx?.('squeak');
      toast('asli roop — halloween mode 🎃 10 sec');
      setTimeout(() => document.body.classList.remove('halloween'), 10000);
    }
  });

  // tab blur
  const orig = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'wapas aa ja dayan 😾' : orig;
  });

  // mood label ×7
  let mTaps = 0;
  document.addEventListener('click', (e) => {
    if (e.target.closest('#mood-label') && ++mTaps >= 7) {
      mTaps = 0; toast('2:22 — dayan ka official time. 🌙');
    }
  });

  // protected content long-press
  let lpT;
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.pp')) lpT = setTimeout(() => toast('PROTECTED — didi ke messages, dil mein stored 🤍'), 900);
  }, { passive: true });
  document.addEventListener('touchend', () => clearTimeout(lpT));
}
