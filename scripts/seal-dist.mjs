/* global process */
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const directory = process.argv[process.argv.indexOf('--dir') + 1]
if (!directory) throw new Error('--dir is required')
async function files(path) {
  const entries = await readdir(path, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)]))).flat()
}
const paths = (await files(directory)).filter((path) => !path.endsWith('dist-tree-manifest.txt')).sort()
const lines = await Promise.all(paths.map(async (path) => `${createHash('sha256').update(await readFile(path)).digest('hex')}  ${relative(directory, path)}`))
const manifest = `${lines.join('\n')}\n`
const digest = createHash('sha256').update(manifest).digest('hex')
await writeFile(join(directory, 'dist-tree-manifest.txt'), manifest)
process.stdout.write(`${digest}\n`)
