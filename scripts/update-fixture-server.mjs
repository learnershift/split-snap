/* global process, URL */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

let version = 1
const root = process.env.DIST_DIR ?? join(process.cwd(), 'dist')
const worker = () => `const version=${version};self.addEventListener('install',event=>{});self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('split-snap-static-')&&key!=='split-snap-static-v'+version)await caches.delete(key);await self.clients.claim()})()));self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});`
createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
  if (pathname === '/__reset-worker') { version = 1; response.end('ok'); return }
  if (pathname === '/__switch-worker') { version = 2; response.end('ok'); return }
  if (pathname === '/split-snap/sw.js') { response.setHeader('cache-control', 'no-store'); response.setHeader('content-type', 'application/javascript'); if (version === 1) { createReadStream(join(root, 'sw.js')).pipe(response); return }; response.end(worker()); return }
  const relative = pathname === '/split-snap' || pathname === '/split-snap/' ? 'index.html' : pathname.replace(/^\/split-snap\//, '')
  const path = join(root, relative === '' ? 'index.html' : relative)
  const file = existsSync(path) && statSync(path).isFile() ? path : join(root, 'index.html')
  response.setHeader('content-type', extname(file) === '.js' ? 'application/javascript' : extname(file) === '.css' ? 'text/css' : extname(file) === '.png' ? 'image/png' : 'text/html')
  createReadStream(file).pipe(response)
}).listen(4173, '127.0.0.1')
