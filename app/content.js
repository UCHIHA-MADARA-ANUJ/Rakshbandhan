// ⭐ ALL WORDS = BHAI'S OWN VOICE. edit anything here, site changes.

export const PHOTOS = (s) => `/assets/photos/${s}.webp`;

export const ROUTES = [
  { path: '/', tag: 'SIGNAL', short: 'SIGNAL' },
  { path: '/timeline', tag: 'ORIGIN', short: 'ORIGIN' },
  { path: '/dossier', tag: 'DOSSIER', short: 'DOSSIER' },
  { path: '/scanner', tag: 'SCANNER', short: 'SCANNER' },
  { path: '/transmission', tag: 'TX', short: 'TX' },
  { path: '/distance', tag: 'DISTANCE', short: 'DISTANCE' },
  { path: '/ritual', tag: 'RITUAL', short: 'RITUAL' },
  { path: '/letter', tag: 'LETTER', short: 'LETTER' },
  { path: '/finale', tag: 'FINALE', short: 'FINALE' },
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
  exhibitsTag: 'EVIDENCE. SORRY NOT SORRY',
  exhibits: [
    { slug: 'alien', tag: 'EXHIBIT A', cap: 'the true form. i have proof.' },
    { slug: 'funny-face', tag: 'EXHIBIT B', cap: 'the "what did i do" face. classic.' },
    { slug: 'teasing', tag: 'EXHIBIT C', cap: 'job: teasing. full time.' },
    { slug: 'pankha', tag: 'EXHIBIT D', cap: 'she cleaned a fan once. frame it.' },
    { slug: 'dayumm', tag: 'EXHIBIT E', cap: 'impressed herself. valid tbh.' },
    { slug: 'mirror-selfie', tag: 'EXHIBIT F', cap: 'the mirror selfie. a daily ritual.' },
    { slug: 'style', tag: 'EXHIBIT G', cap: "thinks she's the main character. she is." },
  ],
};

export const ALIASES = {
  tag: 'KNOWN ALIASES',
  list: ['DAYAN', 'CHUDAIL', 'DIII', 'DIDIIII', 'EYIZ 💀', 'M_____ (hidden)'],
};

export const SCAN = {
  tag: 'FACE SCAN',
  head: ['SCANNING', 'YOU…'],
  moods: [
    { slug: 'eyes', label: 'looking…' },
    { slug: 'eyiz-smile', label: 'the eyiz one 💀' },
    { slug: 'eyiz-nose', label: 'eyiz + nose. why.' },
    { slug: 'edited-eyes', label: "she edits these and thinks we can't tell" },
    { slug: 'straight-eyes', label: 'direct eye contact. rare.' },
    { slug: 'left-side', label: 'angle #47 of 47' },
    { slug: 'smile', label: 'this one. saving this one.' },
    { slug: 'full-face', label: 'full power mode' },
    { slug: 'normal', label: '"normal" (unverified)' },
    { slug: 'idk', label: 'idk. literally idk.' },
    { slug: 'blushing', label: "ok she's cute here. moving on." },
  ],
  verdict: 'RESULT: 100% dayan. unfortunately my sister. stuck with me forever.',
  foot: 'yes these are real. my phone is 40% your face. drag it.',
};

export const TX = {
  tag: 'EVIDENCE: MY PHONE',
  head: ['MY PHONE IS', 'A MUSEUM OF YOU'],
  phone: [
    { slug: 'insta-pfp', label: 'INSTA' },
    { slug: 'wa-pfp', label: 'WHATSAPP' },
    { slug: 'lock-screen', label: 'LOCK SCREEN' },
    { slug: 'phone-wallpaper', label: 'WALLPAPER' },
    { slug: 'my-wallpaper', label: 'MY WALLPAPER' },
    { slug: 'wallpaper', label: 'BACKUP' },
    { slug: 'randomly-received', label: 'RANDOM FILE FROM PUNE', big: true },
    { slug: 'rendem-again', label: 'THE "RENDEM" SERIES' },
  ],
  chatMeta: 'MY DRAFTS TO HER · NEVER SENT (TIL NOW)',
  chat: [
    { side: 'me', text: 'didi', time: '02:14' },
    { side: 'me', text: 'u asleep? obviously u are. its 2. u sleep at 10 like a hero', time: '02:14' },
    { side: 'me', text: 'u came in april and somehow the whole year became about u. idk how u did that', time: '02:16' },
    { side: 'me', text: 'u were asleep obviously. u sleep at 10. so i am typing into the void', time: '02:19' },
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
  handSlug: 'hand-jwellery',
  handAlt: 'the wrist. you know what to do.',
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
  tag: 'HOW IT HAPPENED',
  head: ['FOUR MONTHS.', 'ZERO BLOOD.', 'FULL SIBLINGS.'],
  sub: 'april to rakhi. quickly.',
  nodes: [
    { date: 'APR 2026', title: 'FIRST CONTACT', d: "met her in april. didn't think she'd stay this long lol", slug: 'grouped' },
    { date: 'MAY 2026', title: 'THE ROAST ERA', d: 'she found out teasing me is fun. it never stopped.', slug: 'teasing' },
    { date: 'JUN–JUL', title: 'THE CALL ERA', d: 'actual calls. normal hours. she sleeps early like a normal person. i was up anyway.', slug: 'mirror-selfie' },
    { date: '28 AUG', title: 'THREAD TIED', d: 'she tied it herself. from pune. over a website. 2026 is wild.', slug: 'hand-smile' },
  ],
  tail: '— season 2 starts tomorrow —',
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

export const ARCHIVE = {
  tag: 'ALL OF IT. YES, ALL.',
  head: ['THE FULL', 'COLLECTION.'],
  sub: 'every single pic i have of you. i am not apologizing. tap any.',
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
