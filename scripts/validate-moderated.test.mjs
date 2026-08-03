/* global process */
import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'split-snap-moderated-'))
const summary = join(directory, 'summary.json')
await writeFile(summary, JSON.stringify({ overall: 'INCONCLUSIVE', results: { 'AC-U01': 'INCONCLUSIVE' } }))
const result = spawnSync(process.execPath, ['scripts/validate-moderated.mjs', '--check', summary], { encoding: 'utf8' })
assert.notEqual(result.status, 0)
assert.match(result.stderr, /moderated validation is not PASS/)

const missingCheck = spawnSync(process.execPath, ['scripts/validate-moderated.mjs'], { encoding: 'utf8' })
assert.notEqual(missingCheck.status, 0)
assert.match(missingCheck.stderr, /--check is required/)
