import sharp from 'sharp';
const stars = Array.from({ length: 60 }, () => {
  const cx = (Math.random() * 1200).toFixed(0), cy = (Math.random() * 630).toFixed(0);
  const r = (1 + Math.random() * 2.4).toFixed(1), o = (0.15 + Math.random() * 0.6).toFixed(2);
  return `<circle cx='${cx}' cy='${cy}' r='${r}' fill='#D9A441' fill-opacity='${o}'/>`;
}).join('');
const og = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
<rect width='1200' height='630' fill='#000'/>
${stars}
<circle cx='600' cy='290' r='170' fill='#F2E8D5'/>
<circle cx='676' cy='232' r='152' fill='#000'/>
<path d='M0,540 C 350,470 750,300 1200,140' stroke='#FF2E4D' stroke-width='6' fill='none'/>
<path d='M0,560 C 350,490 750,320 1200,160' stroke='#D9A441' stroke-width='2' fill='none' opacity='.6'/>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
console.log('og ✓');
