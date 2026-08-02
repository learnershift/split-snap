/* global process */
import { readFile } from 'node:fs/promises'

const value = (name) => process.argv[process.argv.indexOf(name) + 1]
const record = value('--record')
const source = value('--source-sha')
const dist = value('--dist-sha')
if (!record || !/^[0-9a-f]{40}$/.test(source ?? '') || !/^[0-9a-f]{64}$/.test(dist ?? '')) throw new Error('record, 40-hex source SHA, and 64-hex dist SHA are required')
const parsed = JSON.parse(await readFile(record, 'utf8'))
if (parsed.source_sha !== source || parsed.dist_tree_sha256 !== dist || parsed.live_verify !== 'PASS') throw new Error('known-good record does not bind this release')
