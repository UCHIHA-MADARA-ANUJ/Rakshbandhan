// ⭐ ALL WORDS = BHAI'S OWN VOICE. edit anything here, site changes.

// no photos of her. anywhere. bhai's final word.
export const ROUTES = [
  { path: '/', tag: 'SIGNAL', short: 'SIGNAL' },
  { path: '/timeline', tag: 'ORIGIN', short: 'ORIGIN' },
  { path: '/dossier', tag: 'DOSSIER', short: 'DOSSIER' },
  { path: '/lie', tag: 'LIE TEST', short: 'LIE' },
  { path: '/transmission', tag: 'TX', short: 'TX' },
  { path: '/distance', tag: 'DISTANCE', short: 'DISTANCE' },
  { path: '/ritual', tag: 'RITUAL', short: 'RITUAL' },
  { path: '/letter', tag: 'LETTER', short: 'LETTER' },
  { path: '/finale', tag: 'FINALE', short: 'FINALE' },
  { path: '/love', tag: 'I LOVE YOU', short: 'ILY ❤️' },
];

export const INTRO = {
  // ~30 second opening film. his voice. lowercase.
  beats: [
    { at: 500,  t: '28 august 2026.', cls: 'mono' },
    { at: 4000, t: "raksha bandhan. and a problem.", cls: 'mono' },
    { at: 7500, t: 'bhai is in gurugram. didi is in pune.', cls: '' },
    { at: 11500, t: "can't be there in person. so.", cls: '' },
    { at: 14500, t: 'he stayed up stupidly late', cls: '' },
    { at: 17500, t: 'and built this instead.', cls: 'big' },
    { at: 21500, t: 'GURUGRAM ————————— PUNE', cls: 'thread mono' },
    { at: 25000, t: 'one sky. one thread. 1,450 km.', cls: '' },
    { at: 28500, t: 'for one person only.', cls: 'big' },
  ],
  total: 31500,
  skip: 'skip >>',
  gateLine: "> ok. prove you're her.",
  gateTag: 'ONLY ONE NAME (OR TWO) OPENS THIS',
  wrong: ['nope.', "that's not it.", 'two names work. mine for her: DAYAN. hers for herself: CHUDAIL.'],
};

export const LANDING = {
  kicker: '28.08.2026 · made in gurugram. for pune.',
  line1: 'OK FINE.',
  line2: 'I MADE THIS.',
  sub: 'a whole website. for you. yes really.',
  gridTag: 'PICK ANY ORDER. I MADE ALL OF IT',
};

export const GATE = {
  // ONLY these open the site. case does not matter.
  accept: {
    dayan:   { keys: ['dayan', 'dayaan', 'dayn'],   resp: "> correct. come in.", stamp: true },
    chudail: { keys: ['chudail', 'chudayl', 'witch'], resp: '> self-identified as chudail. respect. come in.', stamp: true },
  },
};

export const FILE = {
  tag: 'SUBJECT FILE 001',
  head: ['THE FILE:', 'DAYAN'],
  cards: [
    { n: '18', l: 'AGE (APPARENTLY)', d: 'adult on paper. behaviour still pending.' },
    { n: 'PUNE', l: 'LAST SEEN', d: 'where the mirror selfies come from. daily.' },
    { n: '10PM', l: 'BEDTIME (HERS)', d: 'she sleeps early. like a responsible adult. i built this at 2am. we are not the same.' },
    { n: '100%', l: 'TEASING RATE', d: 'mostly in front of people. thanks for that.' },
  ],
  charges: [
    'roasting me in front of everyone. always',
    'acting innocent right after. every time',
    'sends pics labelled "rendem". to this day idk what it means',
    'was seen cleaning a fan ONCE. we keep proof',
  ],
  incidentsTag: 'SELECTED INCIDENTS — VISUAL EVIDENCE: REMOVED BY ORDER OF BHAI',
  incidents: [
    '001 — the fan incident. it happened. the proof is gone. trust me.',
    "002 — 'rendem'. two files. still unexplained.",
    '003 — mirror selfie frequency: daily. location: pune.',
    '004 — eyiz. no further comment at this time.',
    '005 — the soft toy. classified.',
    '006 — public roasting of bhai: ongoing since may.',
    "007 — goes offline at 10pm. like a shop.",
  ],
};

export const ALIASES = {
  tag: 'KNOWN ALIASES',
  list: ['DAYAN', 'CHUDAIL', 'DIII', 'DIDIIII', 'EYIZ 💀', 'M_____ (hidden)'],
};

export const LIE = {
  tag: 'POLYGRAPH · ACCURACY 100% (TRUST ME)',
  head: ['LIE', 'DETECTOR.'],
  sub: 'pick a statement. the machine already knows.',
  questions: [
    { q: 'she is a dayan', v: 'TRUE. MAXIMUM DAYAN CONFIRMED.', danger: 92 },
    { q: 'she teases him in public', v: 'TRUE. 47 INCIDENTS ON RECORD.', danger: 78 },
    { q: 'she is cute when angry', v: 'TRUE. UNFORTUNATELY PROVEN.', danger: 64 },
    { q: 'she will cry on this website', v: 'INCONCLUSIVE. CHECK AFTER THE LETTER.', danger: 40 },
    { q: 'bhai loves her', v: 'ERROR. VALUE OFF THE CHART.', danger: 100 },
  ],
};

export const TX = {
  tag: 'THE PHONE VAULT',
  head: ['MY PHONE IS', 'A MUSEUM OF YOU'],
  vaultLabel: 'IMAGE VAULT: SEALED',
  vaultNote: 'every pic removed. by order of me. the gallery stays full tho.',
  chatMeta: 'MY DRAFTS TO HER · NEVER SENT (TIL NOW)',
  chat: [
    { side: 'me', text: 'didi', time: '02:14' },
    { side: 'me', text: 'u asleep? obviously u are. its 2. u sleep at 10 like a hero', time: '02:14' },
    { side: 'me', text: 'u came in april and somehow the whole year became about u. idk how u did that', time: '02:16' },
    { side: 'me', text: 'i never say stuff properly so. typing it here at 2am like an idiot', time: '02:19' },
    { side: 'me', text: 'my gallery is 40% ur pics. my wallpaper too. no i will not apologize', time: '02:21' },
    { side: 'me', text: 'thanks for staying ok thats it gn', time: '02:22' },
  ],
  turn: ['typed at 2am. never sent.', 'today i am sending everything.'],
};

export const DIST = {
  tag: 'THE DISTANCE THING',
  kmMax: 1450,
  thesis: ['1,450 KM', 'AND STILL ANNOYING.'],
  thesis2: 'distance tried. distance failed.',
  cards: [
    { n: 'APR 2026', l: 'START', d: 'random month. random person. now this.' },
    { n: '2', l: 'CITIES', d: 'gurugram ↔ pune. same sky tho.' },
    { n: '1,450 KM', l: 'DISTANCE', d: 'checked. irrelevant. the thread is longer.' },
    { n: '1', l: 'MOON', d: 'look up tonight. i am looking too. deal?' },
  ],
};

export const RAKHI = {
  wrist: 'the wrist. you know what to do.',
};

export const RITUAL = {
  tag: 'THE MAIN PART',
  head: ['NOW YOU', 'TIE IT.'],
  sub: "i can't come to pune rn so. hold the button and tie it yourself ok.",
  hold: 'HOLD TO TIE',
  releasing: "don't let go…",
  tiedTitle: 'TIED. DONE.',
  tiedSub: "u just tied a rakhi from 1,450 km away. tell me that's not cool.",
  tiedNext: 'ok now the letter →',
  stamp: 'DONE · 28.08.2026 · FOREVER',
  hint: 'hold it. watch the wrist.',
};

export const TIMELINE = {
  tag: 'SYSTEM LOG \u00b7 2026 \u00b7 LIVE',
  head: ['HOW IT', 'HAPPENED.'],
  sub: 'four months. zero blood. full siblings. pulled from the records.',
  entries: [
    { d: 'APR 01', t: 'NEW PERSON DETECTED', l: 'appeared out of nowhere. refused to leave. respectfully.' },
    { d: 'APR 14', t: 'FIRST ROAST RECEIVED', l: 'damage: moderate. recovery: never completed.' },
    { d: 'MAY 09', t: 'TEASING MODE: ENABLED', l: 'has not been switched off since. will not be.' },
    { d: 'JUN 21', t: 'CALL FREQUENCY: HIGH', l: 'she talks. i listen. best deal i ever made.' },
    { d: 'JUL 17', t: 'GALLERY TAKEOVER: 40%', l: 'my wallpaper too. no i will not apologize.' },
    { d: 'AUG 28', t: 'PROTOCOL: RAKHI', l: 'thread tied from 1,450 km away. system status: family.' },
  ],
  tail: '\u2014 log continues. forever, apparently \u2014',
};

export const LETTER = {
  tag: 'THE PART I CANNOT SAY OUT LOUD',
  flipWords: ['NOT BLOOD.', 'STILL FAMILY.'],
  body: [
    'ok so.',
    "i can't say things properly in person. you know this about me. so i made a whole website instead. yes. an entire website.",
    "here's the thing. we're not blood related at all. zero. and you're still the most sister anyone has ever been to me. i think that's bigger.",
    'april was 4 months ago. now my gallery, my wallpaper, my phone. all you.',
    "your birthday text? still saved. i read it sometimes. don't act cool about it.",
    'pune is far but the moon is the same one. look at it sometimes. i am on the other side doing the same dumb thing.',
    'happy raksha bandhan didi. the roasting never stops. that is a threat and a promise.',
  ],
  sign: '— your bhai (15, sleep-deprived, gurugram)',
  ps: 'P.S. if you screenshot this to make fun of me, the certificate gets revoked.',
};

export const FINALE = {
  kicker: 'ok. finally. say it properly —',
  title: ['HAPPY', 'RAKSHA', 'BANDHAN'],
  name: 'DIDI 🌙',
  credit: ['— your bhai', 'made at 2am. on a school night. remember that.'],
  call: 'call. u have my number',
  callJoke: 'RULE 1: dayan calls first 😤',
  cert: 'get ur certificate 📜',
  reply: 'copy ur reply 📋',
  replyDone: 'copied. now go paste it to him.',
  footer: 'no blood relation detected · chosen family confirmed · © bhai, 2026',
  certData: {
    title: 'RAKHI CERTIFICATE',
    id: 'ID: DAYAN-2808 · 100% OFFICIAL',
    lines: [
      'This is to certify that',
      'D I D I',
      '(a.k.a. THE DAYAN · Pune)',
      'has been doing sister duties at an',
      'UNREASONABLY GOOD level since April 2026,',
      'and therefore gets:',
      'lifetime brother protection',
      'unlimited roast insurance',
      'phone call rights. forever.',
    ],
    sign: '— your bhai',
    footer: '28.08.2026 · valid forever · no refunds',
  },
};

export const FINALE_REPLY = "I SAW EVERYTHING.\nthe file?? the scanner?? THE CERTIFICATE?? 😭\nhappy raksha bandhan bhai. you built a WHOLE website at 2am. i'm telling everyone.";

export const LOVE = {
  kicker: 'one last thing. then u can roast me forever —',
  words: ['I LOVE', 'YOU'],
  name: 'DIDI 🌙🤍',
  said: "ok. i said it. one time only. don't make it weird.",
  deny: '(if u screenshot this i will deny everything)',
  tapHeart: 'tap the heart. i dare u.',
  heartBoom: "🤍 ok that felt good. one time only, i said.",
  footer: '— your bhai. forever. 28.08.2026 · ek hi chand 🌙',
};
