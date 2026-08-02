/* global process */
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'split-snap-verify-'))
await writeFile(join(directory, 'index.html'), '<main>sealed</main>')
const sealed = spawnSync(process.execPath, ['scripts/seal-dist.mjs', '--dir', directory], { encoding: 'utf8' })
assert.equal(sealed.status, 0, sealed.stderr)
const digest = sealed.stdout.trim()
const verified = spawnSync(process.execPath, ['scripts/verify-dist.mjs', '--dir', directory, '--sha', digest], { encoding: 'utf8', env: { ...process.env, SPLIT_SNAP_SKIP_GATES: '1' } })
assert.equal(verified.status, 0, verified.stderr)
assert.equal(verified.stdout.trim(), digest)

const bin = await mkdtemp(join(tmpdir(), 'split-snap-fake-npm-'))
const calls = join(bin, 'calls.txt')
await writeFile(join(bin, 'npm'), `#!/bin/sh\nprintf '%s\\n' "$*" >> '${calls}'\n`)
await (await import('node:fs/promises')).chmod(join(bin, 'npm'), 0o755)
const gated = spawnSync(process.execPath, ['scripts/verify-dist.mjs', '--dir', directory, '--sha', digest], {
  encoding: 'utf8',
  env: { ...process.env, SPLIT_SNAP_NPM_COMMAND: join(bin, 'npm') },
})
assert.equal(gated.status, 0, gated.stderr)
assert.deepEqual((await readFile(calls, 'utf8')).trim().split('\n'), [
  'run test:e2e', 'run test:offline', 'run test:install', 'run test:a11y', 'run test:privacy',
])
