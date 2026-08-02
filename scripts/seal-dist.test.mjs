/* global process */
import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'split-snap-seal-'))
await writeFile(join(directory, 'z.txt'), 'z')
await writeFile(join(directory, 'a.txt'), 'a')
const result = spawnSync(process.execPath, ['scripts/seal-dist.mjs', '--dir', directory], { encoding: 'utf8' })
assert.equal(result.status, 0, result.stderr)
