/* global process */
import { readFile } from 'node:fs/promises'

const file = process.argv[process.argv.indexOf('--check') + 1]
if (!file) throw new Error('--check is required')
const summary = JSON.parse(await readFile(file, 'utf8'))
const required = ['AC-U01', 'AC-U02', 'AC-U03', 'AC-U04', 'AC-U05']
if (summary.overall !== 'PASS' || required.some((key) => summary.results?.[key] !== 'PASS')) {
  throw new Error('moderated validation is not PASS')
}
