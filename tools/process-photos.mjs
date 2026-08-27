// drop real photos → site photos. run: node tools/process-photos.mjs /path/to/photos
// also picks up voice.m4a / music.mp3 from the same folder (or ./public/audio/)
import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = resolve(process.argv[2] || '/home/user/uploads');
const outDir = resolve(root, 'public/assets/photos');
const audioDir = resolve(root, 'public/audio');
mkdirSync(outDir, { recursive: true }); mkdirSync(audioDir, { recursive: true });

if (!existsSync(srcDir)) { console.error(`✗ folder nahi mila: ${srcDir}`); process.exit(1); }
const map = JSON.parse(readFileSync(resolve(root, 'tools/photomap.json'), 'utf8'));
const files = new Map(readdirSync(srcDir).map(f => [f.toLowerCase(), join(srcDir, f)]));

let ok = 0, miss = [];
for (const [orig, slug] of Object.entries(map)) {
  const f = files.get(orig.toLowerCase());
  if (!f) { miss.push(orig); continue; }
  await sharp(f)
    .rotate()
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .modulate({ saturation: 0.88, brightness: 1.02 })
    .webp({ quality: 82 })
    .toFile(join(outDir, `${slug}.webp`));
  ok++;
}
console.log(`✓ ${ok} photos processed → public/assets/photos`);

// audio drop-ins
for (const name of readdirSync(srcDir)) {
  if (/^voice\.(m4a|mp3|wav|aac)$/i.test(name)) { copyFileSync(join(srcDir, name), join(audioDir, 'voice.m4a')); console.log('✓ voice note installed'); }
  if (/^music\.mp3$/i.test(name)) { copyFileSync(join(srcDir, name), join(audioDir, 'music.mp3')); console.log('✓ music override installed'); }
}
if (miss.length) console.log('⚠ nahi mile (photo names changed?):', miss.join(' | '));
