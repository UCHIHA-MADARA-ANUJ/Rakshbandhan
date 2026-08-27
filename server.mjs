// tiny static server for the exported site — node server.mjs out 8080
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';

const root = normalize(join(process.cwd(), process.argv[2] || 'out'));
const port = Number(process.argv[3] || 8080);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
  '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.map': 'application/json', '.wasm': 'application/wasm',
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let file = normalize(join(root, p));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    let data;
    try { data = await readFile(file); }
    catch {
      try { data = await readFile(file + '.html'); }
      catch {
        try { data = await readFile(join(file, 'index.html')); }
        catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404'); return; }
      }
    }
    const ext = extname(file) === '' ? '.html' : extname(file);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404');
  }
}).listen(port, '0.0.0.0', () => console.log(`ekhichaand → http://0.0.0.0:${port} (${root})`));
