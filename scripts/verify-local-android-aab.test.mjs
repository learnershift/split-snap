import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = readFileSync(path.join(root, 'scripts/build-local-android-aab.mjs'), 'utf8');
const eslintConfig = readFileSync(path.join(root, 'eslint.config.mjs'), 'utf8');
const toolchain = JSON.parse(readFileSync(path.join(root, 'android/local-toolchain.json'), 'utf8'));

assert.equal(toolchain.gradle.version, '8.7');
assert.equal(toolchain.android_gradle_plugin.version, '8.6.1');
assert.equal(toolchain.offline_only, true);
assert.equal(toolchain.credentials_or_signing, 'forbidden');
assert.match(build, /--offline/);
assert.match(build, /:app:bundleRelease/);
assert.match(build, /Two clean offline AAB builds must be byte-identical/);
assert.match(build, /local-android-aab-provenance\.json/);
assert.match(build, /source: \{ tree_sha256: sourceSha256 \}/, 'AAB provenance must bind the immutable source content tree');
assert.match(build, /git', \['ls-files', '--cached'\]/, 'AAB provenance must exclude untracked runtime debris');
assert.doesNotMatch(build, /git', \['ls-files', '-co'/, 'AAB provenance must not include untracked files');
assert.doesNotMatch(build, /git', \['rev-parse', 'HEAD'\]/, 'AAB provenance must not require a self-referential current commit SHA');
assert.match(eslintConfig, /android\/app\/build\/\*\*/);

console.log('local Android AAB build contract passes');
