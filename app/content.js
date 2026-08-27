// ⭐ ALL WORDS LIVE HERE — edit this file, site changes. (photos: public/assets/photos/<slug>.webp)

export const PHOTOS = (s) => `assets/photos/${s}.webp`;

export const PRELOADER = {
  lines: [
    { t: 'this is not a website.', cls: '' },
    { t: "it's a reply.", cls: '' },
    { t: '28 · 08 · 2026', cls: 'mono' },
  ],
  enter: 'initialize',
  hint: '🔊 sound required — headphones recommended',
};

export const GATE = {
  question: 'who are you?',
  placeholder: 'what he calls you',
  wrong: ['no.', 'hint: who haunts my phone at 2 AM?', 'starts with D. ends with dayan.'],
  accept: {
    dayan:   { keys: ['dayan', 'dayaan', 'dayn'], resp: '', stamp: true },
    chudail: { keys: ['chudail', 'witch'], resp: 'you said it yourself. come in.', stamp: true },
    dii:     { keys: ['diii', 'didi', 'di'], resp: 'diii 🌙 come in.', stamp: false },
    real:    { keys: ['mital', 'mitu', 'mintu'], resp: 'real name has no power here. here, you are dayan.', stamp: true },
    eyiz:    { keys: ['eyiz', 'eyez', 'eyis'], resp: 'eyiz 🥹 come in.', stamp: false },
  },
  grantedLine: 'enter.',
};

export const ACT1 = {
  caption: '28 august · gurugram · 2:22 am',
  wanted: {
    meta: '18 · mumbai · threat level: didi',
    charges: [
      'driving her brother insane — daily, 100% success rate',
      'calling at 2 AM like a ghost with a phone plan',
      'looking cute while angry — clearly unfair tactics',
      'spotted cleaning a fan once (rare footage)',
    ],
    foot: 'evidence below. scroll.',
  },
};

export const ACT2 = {
  head: ['the dayan files', 'now open.'],
  exhibits: [
    { slug: 'alien',         tag: 'EXHIBIT A', cap: 'true form. caught on camera.' },
    { slug: 'funny-face',    tag: 'EXHIBIT B', cap: '"what did I do?" — every single time' },
    { slug: 'teasing',       tag: 'EXHIBIT C', cap: 'occupation: teasing' },
    { slug: 'pankha',        tag: 'EXHIBIT D', cap: 'RARE — dayan actually working' },
    { slug: 'dayumm',        tag: 'EXHIBIT E', cap: 'impressed herself. honestly, valid.' },
    { slug: 'mirror-selfie', tag: 'EXHIBIT F', cap: 'mumbai mirror · 2:22 am' },
    { slug: 'style',         tag: 'EXHIBIT G', cap: 'main character energy' },
  ],
  moodLabel: 'MOOD INDEX — v4.2',
  moods: [
    { slug: 'eyes',          label: 'analyzing…' },
    { slug: 'eyiz-smile',    label: 'eyiz + smile — rare combo' },
    { slug: 'eyiz-nose',     label: 'eyiz + nose — anatomy ch. 2' },
    { slug: 'edited-eyes',   label: 'self-edited. skills: mid.' },
    { slug: 'straight-eyes', label: 'direct eye contact — ultra rare' },
    { slug: 'left-side',     label: 'angle #47' },
    { slug: 'smile',         label: 'save this one' },
    { slug: 'full-face',     label: 'full power' },
    { slug: 'normal',        label: '"normal" — citation needed' },
    { slug: 'idk',           label: 'idk × 1000' },
    { slug: 'blushing',      label: 'shy mode — real story starts here' },
  ],
  moodFoot: ['yes, real photos. my phone is full of these.', 'scroll or drag — she reacts.'],
};

export const ACT3 = {
  head: ['my phone is', 'a museum of her.'],
  phone: [
    { slug: 'insta-pfp',      label: 'insta', big: false },
    { slug: 'wa-pfp',         label: 'whatsapp', big: false },
    { slug: 'lock-screen',    label: 'lock screen', big: false },
    { slug: 'phone-wallpaper',label: 'wallpaper', big: false },
    { slug: 'my-wallpaper',   label: 'my wallpaper', big: false },
    { slug: 'wallpaper',      label: 'backup', big: false },
    { slug: 'randomly-received', label: '2 AM FILE — mumbai', big: true },
    { slug: 'rendem-again',   label: '"rendem" series', big: false },
  ],
  phoneCap: "everything's hers. even the wallpapers.",
  // ⚠️ BHAJI: real birthday messages go here (side: 'her' | 'me') — English or Hinglish, as she wrote it
  chatMeta: 'the birthday',
  chat: [
    { side: 'her', text: 'HAPPY BIRTHDAY BHAI 🎂', time: '00:02' },
    { side: 'her', text: 'i love you yaar' },
    { side: 'her', text: 'god bless. always smiling, ok?' },
  ],
  turnLines: ["she only writes like this when nobody's watching.", 'so I built this.'],
};

export const ACT4 = {
  stats: ['<b>APR 2026</b> — where it started', '<b>2</b> cities', '<b>1</b> moon', '<b>~1,400</b> km', '<b>1</b> dayan'],
  thesis: ['the distance never broke us.', 'it just made the thread longer.'],
  kmMax: 1424,
};

export const ACT5 = {
  handSlug: 'hand-jwellery',
  handAlt: 'diii ka haath — rakhi yahan',
  lines: ['the thread is on your wrist now.', 'no network issues in this one.'],
  dateStamp: '28 · 08 · 2026',
};

export const ACT6 = {
  letter: [
    'Diii,',
    'writing this because I stop halfway every time I try to say it out loud.',
    'april 2026. you appeared out of nowhere. now you matter more than most things that were always here.',
    "there's no blood between us — and that's the best part. we chose this. every single day, I'd choose it again.",
    'I still have the screenshot of your birthday message. I re-read it sometimes.',
    "mumbai is far. but it's the same moon up there, right? look up tonight — I'm looking too.",
    'happy raksha bandhan, dayan.',
  ],
  sign: '— your brother (15, gurugram)',
  ps: 'P.S. the roasting never stops. stay ready.',
  end: {
    kicker: 'say it properly, finally —',
    title: ['HAPPY', 'RAKSHA', 'BANDHAN'],
    name: 'Diii 🌙',
    credit: ['— your 15-year-old brother', 'built at 2 AM. remember that.'],
    // TODO(bhai): your number — tel:+91XXXXXXXXXX and https://wa.me/91XXXXXXXXXX
    callHref: 'tel:',
    replyHref: 'https://wa.me/',
  },
  cert: {
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
    footer: '28.08.2026 · valid: permanently · ek hi chand',
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
