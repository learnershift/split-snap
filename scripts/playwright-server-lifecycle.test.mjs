import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = readFileSync(path.join(root, 'playwright.config.ts'), 'utf8');

assert.match(config, /exec node scripts\/update-fixture-server\.mjs/);
console.log('fixture-server process replacement contract passes');
