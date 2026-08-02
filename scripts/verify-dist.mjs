/* global process */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const argument = (name) => process.argv[process.argv.indexOf(name) + 1]
const directory = argument('--dir')
const expected = argument('--sha')
if (!directory || !expected) throw new Error('--dir and --sha are required')
const digest = expected

async function verifyTree() {
  const manifest = await readFile(join(directory, 'dist-tree-manifest.txt'), 'utf8')
  const digest = createHash('sha256').update(manifest).digest('hex')
  if (digest !== expected) throw new Error(`sealed digest mismatch: expected ${expected}, got ${digest}`)
  for (const line of manifest.trimEnd().split('\n')) {
    const [fileHash, relative] = line.split('  ')
    const bytes = await readFile(join(directory, relative))
    const actual = createHash('sha256').update(bytes).digest('hex')
    if (actual !== fileHash) throw new Error(`sealed file changed: ${relative}`)
  }
}
await verifyTree()
for (const script of process.env.SPLIT_SNAP_SKIP_GATES === '1' ? [] : ['test:e2e', 'test:offline', 'test:install', 'test:a11y', 'test:privacy']) {
  const result = spawnSync(process.env.SPLIT_SNAP_NPM_COMMAND ?? 'npm', ['run', script], { stdio: 'inherit', env: { ...process.env, DIST_DIR: directory } })
  if (result.status !== 0) throw new Error(`${script} failed`)
}
await verifyTree()
process.stdout.write(`${digest}\n`)
