// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
//  EK HI CHAAND — CONTENT (bhai, ye EK file edit karke sab badal sakte ho)
//  Photos: public/assets/photos/<slug>.webp  ·  Voice: public/audio/voice.m4a
//  Real photos aane tak placeholders chal rahe hain — swap = file overwrite.
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

export const PHOTOS = (s) => `assets/photos/${s}.webp`;

export const GATE = {
  question: 'kaun ho tum?',
  placeholder: 'jo wo mujhe bulata hai…',
  wrong: [
    'nahi. try again.',
    'hint: raat 2 baje kaun yaad aata hai?',
    'arre — simple si cheez hai. D se shuru, jaadu se khatam.',
    'gussa nahi hona. bas naam likho jo main bulata hoon. 👀',
  ],
  accept: {
    // matched by substring (lowercase)
    dayan:   { keys: ['dayan', 'dayaan', 'dayn'],   resp: '', stamp: true },
    chudail: { keys: ['chudail', 'chudayl', 'witch'], resp: 'waah. khud ko khud hi expose kar diya. respect. 🙏', stamp: true },
    dii:     { keys: ['diii', 'didi', 'di'],        resp: 'diii bolna kabhi kabhi. aaja didi. 🌙', stamp: false },
    real:    { keys: ['mital', 'mitu', 'mintu'],    resp: 'formal? cute. par is site pe wo naam nahi chalega — DAYAN hi rahegi. 😤', stamp: true },
    eyiz:    { keys: ['eyiz', 'eyez', 'eyis'],      resp: 'eyiz… 🥹 theek hai, andar aa ja.', stamp: false },
  },
  grantedLine: 'aaja. gift start ho raha hai.',
};

export const PRELOADER = {
  lines: [
    { t: 'yeh website nahi hai.', cls: '' },
    { t: 'ye reply hai.', cls: '' },
    { t: '28 · 08 · 2026 — khaas din, khaas file', cls: 'mono' },
  ],
  enter: 'ok, dikhao',
  hint: '🔊 sound on karo — headphones pehen lo = 🤌',
};

export const ACT1 = {
  caption: '28 August · Gurugram · 2:22 AM',
  wanted: {
    meta: 'umar: 17 going 18 · sheher: Mumbai · khatra: MAXIMUM',
    charges: [
      'bhai ko publically cute-cute names se bulana',
      'telepathy: tabhi call karti hai jab main khana kha raha hota hoon',
      'gusse mein bhi cute lag jaana — unfair practice',
      'shaam ko “so rahi hoon” kehna, aur raat 2 baje reels bhejna',
    ],
    foot: 'evidence neeche hai. scroll kar.',
  },
};

export const ACT2 = {
  head: ['dayan ki file,', 'kholdi gayi.'],
  exhibits: [
    { slug: 'alien',        tag: 'EXHIBIT A', cap: 'dayan ka real roop — camera ne pakad liya' },
    { slug: 'funny-face',   tag: 'EXHIBIT B', cap: '“maine kya kiya?” face. hamesha yehi face.' },
    { slug: 'teasing',      tag: 'EXHIBIT C', cap: 'dayan, apne asli kaam mein busy' },
    { slug: 'pankha',       tag: 'EXHIBIT D', cap: 'RARE FOOTAGE: dayan kaam karte hue — scientists shocked' },
    { slug: 'dayumm',       tag: 'EXHIBIT E', cap: 'khud se hi impress ho gayi. honestly, valid.' },
    { slug: 'mirror-selfie',tag: 'EXHIBIT F', cap: 'Mumbai mirror — 2:22 AM' },
    { slug: 'style',        tag: 'EXHIBIT G', cap: 'dayan fashion week — episode 4' },
  ],
  moodLabel: 'MOOD INDEX — v4.2',
  moods: [
    { slug: 'eyes',         label: 'mode: analyzing — “kal raat soya kya?”' },
    { slug: 'eyiz-smile',   label: 'mode: eyiz + smile — rare combo 🥹' },
    { slug: 'eyiz-nose',    label: 'mode: eyiz + nose — anatomy ka naya chapter' },
    { slug: 'edited-eyes',  label: 'mode: self-edited — didi ke photoshop skills' },
    { slug: 'straight-eyes',label: 'mode: seedha dekh rahi hai (camera se darr gayi)' },
    { slug: 'left-side',    label: 'mode: artistic angle #47' },
    { slug: 'smile',        label: 'mode: muskurahat — save this one' },
    { slug: 'full-face',    label: 'mode: full power dialed to 100' },
    { slug: 'normal',       label: 'mode: “normal” — citation needed' },
    { slug: 'idk',          label: 'mode: IDK × 1000' },
    { slug: 'blushing',     label: 'mode: sharma gayi — asli story yahin se shuru hoti hai' },
  ],
  moodFoot: ['haan, real photos hain. bhai ka phone bhar rakha hai in se.', 'scroll karte raho — dayan react karegi.'],
};

export const ACT3 = {
  head: ['mera phone,', 'yaadon ka godown hai.'],
  phone: [
    { slug: 'insta-pfp',     label: 'INSTA PFP — main character energy', big: false },
    { slug: 'wa-pfp',        label: 'WA PFP — same dayan, new light', big: false },
    { slug: 'lock-screen',   label: 'LOCK SCREEN — bilkul soft. proven.', big: false },
    { slug: 'phone-wallpaper',label: 'WALLPAPER — mauke pe chaukni', big: false },
    { slug: 'my-wallpaper',  label: 'BHAI KA WALLPAPER — godown, bola tha', big: false },
    { slug: 'wallpaper',     label: 'SPARE — backup dayan', big: false },
    { slug: 'randomly-received', label: '2 AM FILE — randomly received from Mumbai', big: true },
    { slug: 'rendem-again',  label: '“rendem” series — continued', big: false },
  ],
  phoneCap: 'sab kuch iska hai. wallpapers tak.',
  // ⚠️⚠️ BHAJI: ye chat DEFAULT hai — REAL birthday wali chat ka screenshot bhejna,
  // ya asli messages yahan likh dena (side:'her'|'me', time optional)
  chatMeta: 'WHATSAPP — birthday wala din',
  chat: [
    { side: 'her', text: 'HAPPY BIRTHDAY MERI JAAN 🎂🎉', time: '00:02' },
    { side: 'her', text: 'party kab hai?? aur mera gift? 👀' },
    { side: 'her', text: 'kidding. god bless you so so much bhai.' },
    { side: 'her', text: 'happy birthday. i love you ❤️' },
  ],
  turnLines: [
    'dayan aise likhti hai jab koi dekh nahi raha hota.',
    'isliye ye site ban rahi thi.',
  ],
};

export const ACT4 = {
  stats: ['<b>APR 2026</b> — the beginning', '<b>2</b> sheher', '<b>1</b> chaand', '<b>~1,400</b> km', '<b>1</b> dayan — high value'],
  thesis: ['doori ne humein toota nahi.', 'bas rakhi ka thread lamba kar diya.'],
  kmMax: 1424,
};

export const ACT5 = {
  handSlug: 'hand-jwellery',
  handAlt: 'diii ka haath — rakhi yahan bandhi hai',
  lines: ['thread ab wrist pe hai.', 'isme network issue nahi hota.'],
  dateStamp: '28 · 08 · 2026',
};

export const ACT6 = {
  // ✉️ LETTER — kal subah tum apne shabdon se replace kar sakte ho, ya ye hi chalega
  letter: [
    'Diii,',
    'suno — ek baat kehne thi. bolte bolte ruk jaata hoon, toh socha likh deta hoon. code mein likha hua bolna aasan lagta hai mujhe.',
    'April 2026. ek random mahina tha. tum random nahi thi. 4 mahine mein itna space le liya hai ki ab tumse pehle ka time yaad nahi padta.',
    'khoon ka rishta nahi hai humaara. aur wahi sabse khaas baat hai — kyunki ye rishta humne CHOOSE kiya hai. maine. tumne. aur main roz phir se choose karunga.',
    'birthday pe tumne jo likha tha — screenshot leke rakha hai. kabhi kabhi padh leta hoon. log gift dete hain: headphones, shoes, games. tumne ek message likha tha jo sabse bada gift tha.',
    'Mumbai door hai, theek hai. par upar wala chand ek hi hai na? mann kare toh dekh lena. idhar se bhi dikh raha hoga — aur us chand ke neeche, main. roast ready.',
    'Happy Raksha Bandhan, Dayan. officially. permanently.',
    'aur ek cheez jo kabhi bola nahi: thank you. literally sab ke liye.',
  ],
  sign: '— tumhara 15-saal ka bhai',
  ps: 'P.S. bada hoke roz aaunga roast karne. taiyaar rehna.',
  end: {
    kicker: 'finally — bol hi dete hain',
    title: ['HAPPY', 'RAKSHA', 'BANDHAN'],
    name: 'Diii 🌙',
    credit: ['— tumhara 15-saal ka bhai', 'raat 2 baje ye bana raha tha. yaad rakhna.'],
    // TODO(bhai): apna number daal — wa.me/<10-digit without +> aur tel:+91XXXXXXXXXX
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
      'has been performing sister duties at an',
      'EXCELLENT level since April 2026,',
      'and is hereby entitled to:',
      'lifetime brother protection',
      'unlimited roast insurance',
      '2 AM call rights — forever',
    ],
    sign: '— tumhara 15-saal ka bhai',
    footer: '28.08.2026 · valid: permanently · ek hi chand ®',
  },
};

// easter-egg gallery = saari photos, jaise bheji thi
export const ALL_SLUGS = [
  'alien','funny-face','teasing','pankha','dayumm','mirror-selfie','style',
  'eyes','eyiz-smile','eyiz-nose','edited-eyes','straight-eyes','left-side',
  'smile','full-face','fulll-pic','normal','idk','blushing',
  'insta-pfp','wa-pfp','lock-screen','phone-wallpaper','my-wallpaper','wallpaper',
  'randomly-received','rendem','rendem-again',
  'with-soft-toy','again-with-soft-toy','grouped','again-grouped',
  'hand-jwellery','hand-smile','my-pfp','blurry','mystery',
];
