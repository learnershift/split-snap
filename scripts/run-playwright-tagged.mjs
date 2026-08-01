/* global process */

import { spawnSync } from 'node:child_process'

const [tag, ...arguments_] = process.argv.slice(2)
const grepIndex = arguments_.indexOf('--grep')
const selector = grepIndex === -1 ? undefined : arguments_[grepIndex + 1]
const forwarded = grepIndex === -1
  ? ['test', `tests/e2e/${tag.slice(1)}.spec.ts`]
  : ['test', '--grep', selector.replace(/^\^|\$$/g, '')]
const result = spawnSync('npx', ['playwright', ...forwarded], { stdio: 'inherit' })

process.exit(result.status ?? 1)
