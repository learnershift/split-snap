/* global fetch, process */
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { URL } from 'node:url'

const argument = (name) => process.argv[process.argv.indexOf(name) + 1]
const base = argument('--base-url')
const directory = argument('--dir')
const expected = argument('--sha')
if (!base || !directory || !expected) throw new Error('--base-url, --dir, and --sha are required')
const manifest = await readFile(join(directory, 'dist-tree-manifest.txt'), 'utf8')
if (createHash('sha256').update(manifest).digest('hex') !== expected) throw new Error('local sealed digest mismatch')
for (const line of manifest.trimEnd().split('\n')) {
  const [hash, relative] = line.split('  ')
  const response = await fetch(new URL(relative, base))
  if (!response.ok) throw new Error(`live resource unavailable: ${relative}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (createHash('sha256').update(bytes).digest('hex') !== hash) throw new Error(`live resource differs: ${relative}`)
}
process.stdout.write(`${expected}\n`)
