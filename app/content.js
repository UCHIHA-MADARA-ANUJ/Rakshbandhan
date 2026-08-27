// ⭐ BHAJI — YE EK FILE MEIN SAB LIKHA HAI. yahan badlo, site badlegi.
// (voice note: public/audio/voice.m4a · photos: public/assets/photos/<slug>.webp)

export const PHOTOS = (s) => `assets/photos/${s}.webp`;

export const PRELOADER = {
  lines: [
    { t: 'yeh website nahi hai.', cls: '' },
    { t: 'ye reply hai.', cls: '' },
    { t: '28 · 08 · 2026', cls: 'mono' },
  ],
  enter: 'andar aao',
  hint: '🔊 sound on — headphones better',
};

export const GATE = {
  question: 'kaun ho tum?',
  placeholder: 'jo bhai bulata hai',
  wrong: ['nahi.', 'hint: raat 2 baje kaun yaad aata hai?', 'D se shuru. dayan.'],
  accept: {
    dayan:   { keys: ['dayan', 'dayaan', 'dayn'], resp: '', stamp: true },
    chudail: { keys: ['chudail', 'witch'], resp: 'theek hai. khud bola. andar aa jao.', stamp: true },
    dii:     { keys: ['diii', 'didi', 'di'], resp: 'diii 🌙 andar aa jao.', stamp: false },
    real:    { keys: ['mital', 'mitu', 'mintu'], resp: 'formal naam yahan nahi chalega. yahan tum dayan ho.', stamp: true },
    eyiz:    { keys: ['eyiz', 'eyez', 'eyis'], resp: 'eyiz 🥹 andar.', stamp: false },
  },
  grantedLine: 'aaja.',
};

export const ACT1 = {
  caption: '28 august · gurugram · 2:22 am',
  wanted: {
    meta: '18 · mumbai · khatra level: didi',
    charges: [
      'bhai ko roz pagal banaana — 100% success rate',
      'raat 2 baje call karna — chronic',
      'gusse mein bhi pyaari lag jaana — unfair',
      'pankha saaf karti hue pakdi gayi (rare)',
    ],
    foot: 'evidence neeche hai. scroll.',
  },
};

export const ACT2 = {
  head: ['dayan ki file', 'kholdi gayi.'],
  exhibits: [
    { slug: 'alien',         tag: 'EXHIBIT A', cap: 'real roop. proof.' },
    { slug: 'funny-face',    tag: 'EXHIBIT B', cap: '"maine kya kiya?" — har baar yehi' },
    { slug: 'teasing',       tag: 'EXHIBIT C', cap: 'asli kaam: teasing' },
    { slug: 'pankha',        tag: 'EXHIBIT D', cap: 'RARE — dayan working' },
    { slug: 'dayumm',        tag: 'EXHIBIT E', cap: 'khud se impressed. valid.' },
    { slug: 'mirror-selfie', tag: 'EXHIBIT F', cap: 'mumbai · 2:22 am' },
    { slug: 'style',         tag: 'EXHIBIT G', cap: 'main character' },
  ],
  moodLabel: 'MOOD INDEX — v4.2',
  moods: [
    { slug: 'eyes',          label: 'analyzing…' },
    { slug: 'eyiz-smile',    label: 'eyiz + smile — rare combo' },
    { slug: 'eyiz-nose',     label: 'eyiz + nose — anatomy ch. 2' },
    { slug: 'edited-eyes',   label: 'self-edit skills: okayish' },
    { slug: 'straight-eyes', label: 'direct eye contact — very rare' },
    { slug: 'left-side',     label: 'angle #47' },
    { slug: 'smile',         label: 'save this one' },
    { slug: 'full-face',     label: 'full power' },
    { slug: 'normal',        label: '"normal" — needs citation' },
    { slug: 'idk',           label: 'idk × 1000' },
    { slug: 'blushing',      label: 'sharma gayi — ab asli story' },
  ],
  moodFoot: ['real photos. bhai ka phone bhar rakha hai.', 'scroll karo — dayan react karegi.'],
};

export const ACT3 = {
  head: ['mera phone', 'yaadon ka godown hai.'],
  phone: [
    { slug: 'insta-pfp',      label: 'insta', big: false },
    { slug: 'wa-pfp',         label: 'whatsapp', big: false },
    { slug: 'lock-screen',    label: 'lock screen', big: false },
    { slug: 'phone-wallpaper',label: 'wallpaper', big: false },
    { slug: 'my-wallpaper',   label: 'bhai ka wallpaper', big: false },
    { slug: 'wallpaper',      label: 'backup', big: false },
    { slug: 'randomly-received', label: '2 AM FILE — mumbai', big: true },
    { slug: 'rendem-again',   label: '"rendem" series', big: false },
  ],
  phoneCap: 'sab kuch tumhara hai. wallpapers tak.',
  // ⚠️ BHAJI: asli birthday messages yahan daal (side: 'her' | 'me')
  chatMeta: 'birthday wala din',
  chat: [
    { side: 'her', text: 'HAPPY BIRTHDAY BHAI 🎂', time: '00:02' },
    { side: 'her', text: 'i love you yaar' },
    { side: 'her', text: 'god bless. always smiling, ok?' },
  ],
  turnLines: ['aisi cheezein tum sirf mujhe likhti ho.', 'isliye ye bana.'],
};

export const ACT4 = {
  stats: ['<b>APR 2026</b> — start', '<b>2</b> sheher', '<b>1</b> chand', '<b>~1,400</b> km', '<b>1</b> dayan'],
  thesis: ['doori ne humein toota nahi.', 'rakhi ka thread lamba kar diya. bas.'],
  kmMax: 1424,
};

export const ACT5 = {
  handSlug: 'hand-jwellery',
  handAlt: 'diii ka haath — rakhi yahan',
  lines: ['thread ab wrist pe hai.', 'network issue nahi hota isme.'],
  dateStamp: '28 · 08 · 2026',
};

export const ACT6 = {
  letter: [
    'Diii,',
    'likh raha hoon, kyunki bolte hue ruk jaata hoon.',
    'april 2026. tum aayi thi random. ab sabse important ho.',
    'khoon ka rishta nahi hai humaara — wahi best part hai. ye humne choose kiya. aur main roz phir choose karunga.',
    'birthday wala message screenshot ke saath rakha hai. kabhi kabhi padh leta hoon.',
    'mumbai door hai. par chand ek hi hai na? wahi dekh lena. main bhi dekh raha hoon.',
    'happy raksha bandhan, dayan.',
  ],
  sign: '— tumhara bhai (15, gurugram)',
  ps: 'P.S. bada hoke bhi roast karunga. taiyaar rehna.',
  end: {
    kicker: 'bol hi dete hain',
    title: ['HAPPY', 'RAKSHA', 'BANDHAN'],
    name: 'Diii 🌙',
    credit: ['— tumhara 15-saal ka bhai', 'raat 2 baje bana tha. yaad rakhna.'],
    // TODO(bhai): number bhar — tel:+91XXXXXXXXXX aur https://wa.me/91XXXXXXXXXX
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
    sign: '— tumhara bhai',
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
