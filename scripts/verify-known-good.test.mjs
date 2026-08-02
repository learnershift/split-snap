/* global process */
import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'split-snap-known-good-'))
const record = join(directory, 'record.json')
await writeFile(record, JSON.stringify({ source_sha: 'a'.repeat(40), dist_tree_sha256: 'b'.repeat(64), live_verify: 'PASS' }))
const result = spawnSync(process.execPath, ['scripts/verify-known-good.mjs', '--record', record, '--source-sha', 'a'.repeat(40), '--dist-sha', 'b'.repeat(64)], { encoding: 'utf8' })
assert.equal(result.status, 0, result.stderr)
