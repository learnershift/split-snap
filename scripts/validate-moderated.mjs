/* global process */
import { readFile } from 'node:fs/promises'

const checkIndex = process.argv.indexOf('--check')
if (checkIndex === -1 || !process.argv[checkIndex + 1]) throw new Error('--check is required')
const file = process.argv[checkIndex + 1]
const summary = JSON.parse(await readFile(file, 'utf8'))
const required = ['AC-U01', 'AC-U02', 'AC-U03', 'AC-U04', 'AC-U05']
if (summary.overall !== 'PASS' || required.some((key) => summary.results?.[key] !== 'PASS')) {
  throw new Error('moderated validation is not PASS')
}
