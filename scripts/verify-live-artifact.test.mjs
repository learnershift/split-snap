/* global process */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'split-snap-live-'))
await writeFile(join(directory, 'index.html'), 'live')
const sealed = spawnSync(process.execPath, ['scripts/seal-dist.mjs', '--dir', directory], { encoding: 'utf8' })
const server = createServer((_, response) => response.end('live'))
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
const result = await new Promise((resolve) => {
  const child = spawn(process.execPath, ['scripts/verify-live-artifact.mjs', '--base-url', `http://127.0.0.1:${address.port}/`, '--dir', directory, '--sha', sealed.stdout.trim()])
  let stderr = ''
  child.stderr.on('data', (chunk) => { stderr += chunk })
  child.on('close', (status) => resolve({ status, stderr }))
})
server.close()
assert.equal(result.status, 0, result.stderr)
