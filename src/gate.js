// THE GATE — she must prove who she is 😈
import * as C from './content.js';

export function initGate(onGranted) {
  const gate = $('#gate'), input = $('#gate-input'), resp = $('#gate-resp'), stamp = $('#gate-stamp');
  let wrongCount = 0, done = false;

  const grant = (line, useStamp) => {
    if (done) return; done = true;
    input.disabled = true;
    if (useStamp) {
      stamp.classList.remove('hidden');
      requestAnimationFrame(() => stamp.classList.add('on'));
      setTimeout(() => { resp.textContent = line; }, 500);
    } else resp.textContent = line;
    setTimeout(() => {
      gate.classList.add('gone');
      document.body.classList.remove('locked');
      onGranted();
      setTimeout(() => gate.remove(), 1200);
    }, useStamp ? 1700 : 1400);
  };

  const check = () => {
    const v = input.value.trim().toLowerCase();
    if (!v) return;
    for (const g of Object.values(C.GATE.accept)) {
      if (g.keys.some(k => v.includes(k))) {
        grant(g.resp || C.GATE.grantedLine, g.stamp);
        return;
      }
    }
    resp.textContent = C.GATE.wrong[wrongCount % C.GATE.wrong.length];
    wrongCount++;
    input.value = '';
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
  };

  input.addEventListener('keydown', (e) => e.key === 'Enter' && check());
  input.addEventListener('blur', () => done || setTimeout(() => input.focus(), 40));
}
const $ = (s) => document.querySelector(s);
