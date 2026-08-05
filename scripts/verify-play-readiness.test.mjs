import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const output = execFileSync(globalThis.process.execPath, ['scripts/verify-play-readiness.mjs'], {
  cwd: root,
  encoding: 'utf8',
});

assert.match(output, /PLAY_READINESS: PASS/);
assert.match(output, /versionName=1\.0\.0/);
assert.match(output, /versionCode=1/);
assert.match(output, /dataSafety=NO_DATA_COLLECTED/);
assert.match(output, /networkPermission=ABSENT/);
assert.match(output, /signing=UNCONFIGURED/);
assert.match(output, /featureGraphic=1024x500/);

console.log('verify-play-readiness contract passes');
