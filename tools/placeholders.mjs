// generates placeholder webp for every slug in photomap.json
// (until real photos land) + og-image.png — run: node tools/placeholders.mjs
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/assets/photos');
mkdirSync(outDir, { recursive: true });
const map = JSON.parse(readFileSync(resolve(root, 'tools/photomap.json'), 'utf8'));
const slugs = [...new Set(Object.values(map))];

const HUES = [14, 42, 210, 265, 340, 180]; // rakhi-red … moon-tint accents

async function make(slug, i) {
  const hue = HUES[i % HUES.length];
  const w = 800, h = 1000;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="hsl(${hue},30%,10%)"/>
        <stop offset="1" stop-color="hsl(${hue},25%,5%)"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <circle cx="${w / 2}" cy="${h / 2 - 40}" r="150" fill="none" stroke="hsl(${hue},70%,60%)" stroke-opacity=".5" stroke-width="2"/>
    <circle cx="${w / 2}" cy="${h / 2 - 40}" r="110" fill="hsl(${hue},60%,55%)" fill-opacity=".18"/>
    <path d="M0,${h * 0.82} Q ${w / 2},${h * 0.72} ${w},${h * 0.86}" stroke="hsl(${hue},70%,55%)" stroke-opacity=".45" stroke-width="3" fill="none"/>
    ${Array.from({ length: 14 }, (_, k) => `<circle cx="${60 + ((i * 97 + k * 57) % (w - 120))}" cy="${70 + ((i * 131 + k * 83) % 500)}" r="${2 + (k % 3)}" fill="#F2E8D5" fill-opacity="${0.15 + (k % 4) * 0.12}"/>`).join('')}
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile(resolve(outDir, `${slug}.webp`));
}

for (const [i, slug] of slugs.entries()) await make(slug, i);

// og image 1200x630 — moon + thread (no text; meta tags carry the words)
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#06060B"/>
  <circle cx="600" cy="300" r="180" fill="#F2E8D5"/>
  <circle cx="680" cy="240" r="160" fill="#06060B"/>
  <path d="M0,540 C 350,470 750,300 1200,140" stroke="#C4453A" stroke-width="5" fill="none"/>
  <path d="M0,560 C 350,490 750,320 1200,160" stroke="#D9A441" stroke-width="2" fill="none" stroke-opacity=".6"/>
  ${Array.from({ length: 40 }, () => `<circle cx="${Math.random() * 1200}" cy="${Math.random() * 630}" r="${1 + Math.random() * 2}" fill="#F2E8D5" fill-opacity="${0.2 + Math.random() * 0.5}"/>`).join('')}
</svg>`;
await sharp(Buffer.from(og)).png().toFile(resolve(root, 'public/og-image.png'));

console.log(`✓ ${slugs.length} placeholders + og-image.png`);
