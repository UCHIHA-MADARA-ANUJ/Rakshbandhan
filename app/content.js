// ⭐ RAKHI PROTOCOL — ALL CONTENT (edit here, site changes)

export const PHOTOS = (s) => `assets/photos/${s}.webp`;

export const BOOT = {
  lines: [
    { t: '> ESTABLISHING SECURE LINK…', c: 'dim' },
    { t: '> ROUTE: GURUGRAM → MUMBAI · 1,424 KM', c: 'dim' },
    { t: '> TARGET: DIDI.EXE — LOCATED', c: '' },
    { t: '> THREAT SCAN: DAYAN DETECTED · LEVEL: MAXIMUM', c: 'shock' },
    { t: '> COUNTERMEASURE: RAKHI PROTOCOL — ARMED', c: '' },
    { t: '> PROTECTION: LIFETIME · TERMINATION: NEVER', c: 'gold' },
    { t: '> BOOTING RAKHI.PROTOCOL…', c: '' },
    { t: '> CONNECTION: ETERNAL ✓', c: 'gold' },
  ],
  bigWord: 'RAKHI',
  skip: '[ SKIP SEQUENCE ]',
  duration: 8600,
};

export const HERO = {
  hud: {
    tl1: 'RAKHI.PROTOCOL v2.8',
    tl2: 'SRC: GURUGRAM · 28.4595° N',
    tl3: 'DEST: MUMBAI · 19.0760° N',
    tr1: 'THREAD_STATUS: INTACT',
    tr2: 'MOON: SHARED · 1',
    br: 'SCROLL TO INITIATE SEQUENCE',
    bl1: 'ONE-TIME DEPLOYMENT',
    bl2: 'FOR: DIDI ONLY',
  },
  line1: 'SAME SKY.',
  line2: 'ONE THREAD.',
  sub: 'a raksha bandhan transmission · 28.08.2026',
};

export const GATE = {
  tag: 'SECURITY CHECK',
  q: '> IDENTIFY YOURSELF',
  placeholder: 'enter codename…',
  wrong: ['> ACCESS DENIED.', '> HINT: HAUNTS MY PHONE AT 2 AM.', '> STARTS WITH D. ENDS WITH DAYAN.'],
  accept: {
    dayan:   { keys: ['dayan', 'dayaan', 'dayn'], resp: '> ACCESS GRANTED — WELCOME, DAYAN.', stamp: true },
    chudail: { keys: ['chudail', 'witch'], resp: '> SELF-IDENTIFIED. RESPECT. ENTER.', stamp: true },
    dii:     { keys: ['diii', 'didi', 'di'], resp: '> SOFT ACCESS — GRANTED, DIII 🌙', stamp: false },
    real:    { keys: ['mital', 'mitu', 'mintu'], resp: '> REAL NAME DETECTED. HERE YOU ARE DAYAN. ENTER.', stamp: true },
    eyiz:    { keys: ['eyiz', 'eyez', 'eyis'], resp: '> RARE USER — GRANTED 🥹', stamp: false },
  },
};

export const FILE = {
  tag: 'SUBJECT FILE 001',
  head: ['THE FILE:', 'DAYAN'],
  cards: [
    { n: '18', l: 'AGE — RECORDED', d: 'adult by law. menace by nature.' },
    { n: 'MUMBAI', l: 'LAST KNOWN LOCATION', d: 'base of operations. mirror selfies at 2:22 AM.' },
    { n: '∞', l: '2 AM CALLS LOGGED', d: 'chronic. incurable. accepted.' },
    { n: '100%', l: 'TEASING EFFICIENCY', d: 'no known defense exists.' },
  ],
  charges: [
    'driving her brother insane — daily',
    'looking cute while angry — unfair tactics',
    'telepathic call timing (always during dinner)',
    'spotted cleaning a fan ONCE — rare footage',
  ],
  exhibitsTag: 'EVIDENCE LOCKER',
  exhibits: [
    { slug: 'alien', tag: 'EXHIBIT A', cap: 'true form — caught on camera' },
    { slug: 'funny-face', tag: 'EXHIBIT B', cap: '"what did I do?" — every time' },
    { slug: 'teasing', tag: 'EXHIBIT C', cap: 'occupation: teasing' },
    { slug: 'pankha', tag: 'EXHIBIT D', cap: 'RARE — dayan working' },
    { slug: 'dayumm', tag: 'EXHIBIT E', cap: 'impressed herself. valid.' },
    { slug: 'mirror-selfie', tag: 'EXHIBIT F', cap: 'mumbai · 2:22 AM' },
    { slug: 'style', tag: 'EXHIBIT G', cap: 'main character energy' },
  ],
};

export const SCAN = {
  tag: 'FACIAL RECOGNITION',
  head: ['SCANNING', 'SUBJECT…'],
  moods: [
    { slug: 'eyes', label: 'ANALYZING…' },
    { slug: 'eyiz-smile', label: 'EYIZ + SMILE — RARE COMBO' },
    { slug: 'eyiz-nose', label: 'EYIZ + NOSE — ANATOMY CH.2' },
    { slug: 'edited-eyes', label: 'SELF-EDITED — SKILLS: MID' },
    { slug: 'straight-eyes', label: 'DIRECT EYE CONTACT — ULTRA RARE' },
    { slug: 'left-side', label: 'ANGLE #47' },
    { slug: 'smile', label: 'SAVE THIS ONE' },
    { slug: 'full-face', label: 'FULL POWER' },
    { slug: 'normal', label: '"NORMAL" — CITATION NEEDED' },
    { slug: 'idk', label: 'IDK × 1000' },
    { slug: 'blushing', label: 'SHY MODE — REAL STORY STARTS HERE' },
  ],
  verdict: 'MATCH: 100% · SUBJECT: DAYAN · STATUS: MY SISTER',
  foot: 'yes, real photos. my phone is full of these. drag to scan.',
};

export const TX = {
  tag: 'INCOMING TRANSMISSION',
  head: ['MY PHONE IS', 'A MUSEUM OF HER'],
  phone: [
    { slug: 'insta-pfp', label: 'INSTA' },
    { slug: 'wa-pfp', label: 'WHATSAPP' },
    { slug: 'lock-screen', label: 'LOCK SCREEN' },
    { slug: 'phone-wallpaper', label: 'WALLPAPER' },
    { slug: 'my-wallpaper', label: 'MY WALLPAPER' },
    { slug: 'wallpaper', label: 'BACKUP' },
    { slug: 'randomly-received', label: '2 AM FILE — MUMBAI', big: true },
    { slug: 'rendem-again', label: '"RENDEM" SERIES' },
  ],
  chatMeta: 'TRANSMISSION — THE BIRTHDAY',
  // ⚠️ BHAJI: replace with her real messages (side: 'her' | 'me')
  chat: [
    { side: 'her', text: 'HAPPY BIRTHDAY BHAI 🎂', time: '00:02' },
    { side: 'her', text: 'i love you yaar' },
    { side: 'her', text: 'god bless. always smiling, ok?' },
  ],
  turn: ['she only writes like this when nobody\'s watching.', 'so i built this.'],
};

export const DIST = {
  tag: 'GEO-DATA',
  kmMax: 1424,
  thesis: ['THE DISTANCE NEVER', 'BROKE US.'],
  thesis2: 'IT JUST MADE THE THREAD LONGER.',
  cards: [
    { n: 'APR 2026', l: 'WHERE IT STARTED', d: 'one random month. one not-so-random person.' },
    { n: '2', l: 'CITIES', d: 'gurugram ↔ mumbai. one sky over both.' },
    { n: '1,424 KM', l: 'DISTANCE', d: 'measured. irrelevant. the thread is longer.' },
    { n: '1', l: 'MOON', d: 'shared asset. look up tonight. i am too.' },
  ],
};

export const RAKHI = {
  tag: 'PROTOCOL EXECUTION',
  handSlug: 'hand-jwellery',
  handAlt: 'the wrist — protocol target',
  lines: ['THREAD DEPLOYED', 'TO WRIST.'],
  sub: 'no network issues. no expiry date. tied by code, meant by heart.',
  stamp: 'SECURED · 28.08.2026',
};

export const LETTER = {
  tag: 'FINAL TRANSMISSION',
  flipWords: ['CHOSEN.', 'NOT GIVEN.'],
  body: [
    'Diii,',
    'writing this because i stop halfway every time i try to say it out loud.',
    'april 2026. you appeared out of nowhere. now you matter more than most things that were always here.',
    'there\'s no blood between us — and that\'s the best part. we chose this. every single day, i\'d choose it again.',
    'i still have the screenshot of your birthday message. i re-read it sometimes.',
    'mumbai is far. but it\'s the same moon up there, right? look up tonight — i\'m looking too.',
    'happy raksha bandhan, dayan.',
  ],
  sign: '— your brother (15, gurugram)',
  ps: 'P.S. the roasting never stops. stay ready.',
};

export const FINALE = {
  kicker: 'SEQUENCE COMPLETE — SAY IT PROPERLY',
  title: ['HAPPY', 'RAKSHA', 'BANDHAN'],
  name: 'DIDI 🌙',
  credit: ['— your 15-year-old brother', 'built at 2 AM. remember that.'],
  // TODO(bhai): tel:+91XXXXXXXXXX + https://wa.me/91XXXXXXXXXX
  call: 'call kar abhi',
  cert: 'rakhi certificate 📜',
  reply: 'reply likh do',
  footer: 'NO BLOOD RELATION DETECTED · CHOSEN FAMILY CONFIRMED · RAKHI.PROTOCOL © 2026',
  certData: {
    title: 'RAKHI CERTIFICATE',
    id: 'ID: DAYAN-2808 · OFFICIAL',
    lines: [
      'This is to certify that',
      'D I I I',
      '(a.k.a. THE DAYAN · Mumbai)',
      'has performed sister duties at an',
      'EXCELLENT level since April 2026,',
      'and is entitled to:',
      'lifetime brother protection',
      'unlimited roast insurance',
      '2 AM call rights — forever',
    ],
    sign: '— your brother',
    footer: '28.08.2026 · valid: permanently · rakhi protocol',
  },
};

export const ALL_SLUGS = [
  'alien', 'funny-face', 'teasing', 'pankha', 'dayumm', 'mirror-selfie', 'style',
  'eyes', 'eyiz-smile', 'eyiz-nose', 'edited-eyes', 'straight-eyes', 'left-side',
  'smile', 'full-face', 'fulll-pic', 'normal', 'idk', 'blushing',
  'insta-pfp', 'wa-pfp', 'lock-screen', 'phone-wallpaper', 'my-wallpaper', 'wallpaper',
  'randomly-received', 'rendem', 'rendem-again',
  'with-soft-toy', 'again-with-soft-toy', 'grouped', 'again-grouped',
  'hand-jwellery', 'hand-smile', 'my-pfp', 'blurry', 'mystery',
];

// ── multi-route mission map ──
export const ROUTES = [
  { path: '/', tag: 'SIGNAL', short: 'SIGNAL' },
  { path: '/dossier', tag: 'DOSSIER', short: 'DOSSIER' },
  { path: '/scanner', tag: 'SCANNER', short: 'SCANNER' },
  { path: '/transmission', tag: 'TRANSMISSION', short: 'TX' },
  { path: '/distance', tag: 'DISTANCE', short: 'DISTANCE' },
  { path: '/ritual', tag: 'RITUAL', short: 'RITUAL' },
  { path: '/letter', tag: 'LETTER', short: 'LETTER' },
  { path: '/finale', tag: 'FINALE', short: 'FINALE' },
];

export const LANDING = {
  kicker: 'INCOMING TRANSMISSION · 28.08.2026 · ONE RECIPIENT',
  line1: 'SAME SKY.',
  line2: 'ONE THREAD.',
  sub: 'a raksha bandhan protocol · deployed from gurugram → mumbai',
  gateTag: 'VERIFY RECIPIENT',
  gateQ: '> WHO IS THIS FOR?',
  placeholder: 'her codename…',
  granted: '> RECIPIENT VERIFIED — PROCEED, DAYAN',
  wrong: ['> NOT HER. TRY AGAIN.', '> HINT: HAUNTS MY PHONE AT 2 AM.', '> STARTS WITH D. ENDS WITH DAYAN.'],
  fine: '> …fine. come in anyway. you are obviously her.',
  gridTag: 'SELECT SEQUENCE',
};

export const RITUAL = {
  tag: 'PROTOCOL 05 — THE RITUAL',
  head: ['NOW TIE IT', 'YOURSELF.'],
  sub: 'press and hold. the thread knows the way from here.',
  hold: 'HOLD TO TIE',
  releasing: 'DON\'T LET GO…',
  tiedTitle: 'THREAD SECURED.',
  tiedSub: 'tied by you, from 1,424 km away. no network issues. no expiry. lifetime warranty.',
  tiedNext: 'read the letter →',
  stamp: 'SECURED · 28.08.2026 · LIFETIME',
  hint: 'hold the button — watch the wrist',
};

export const ARCHIVE = {
  tag: 'CLASSIFIED ARCHIVE — DECLASSIFIED',
  head: ['THE FULL', 'COLLECTION.'],
  sub: 'every file my phone holds. yes, all of them. no, i will not apologize.',
};
