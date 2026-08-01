/* global process */
import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

let version = 1
const root = join(process.cwd(), 'dist')
const worker = () => `const version=${version};self.addEventListener('install',event=>{if(version===1)event.waitUntil(self.skipWaiting())});self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});`
createServer((request, response) => {
  if (request.url === '/__switch-worker') { version = 2; response.end('ok'); return }
  if (request.url === '/split-snap/sw.js') { response.setHeader('content-type', 'application/javascript'); response.end(worker()); return }
  const path = join(root, request.url?.replace(/^\/split-snap\//, '') || 'index.html')
  const file = existsSync(path) ? path : join(root, 'index.html')
  response.setHeader('content-type', extname(file) === '.js' ? 'application/javascript' : extname(file) === '.css' ? 'text/css' : 'text/html')
  createReadStream(file).pipe(response)
}).listen(4173, '127.0.0.1')
