import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const android = path.join(root, 'android');
const environment = globalThis.process.env;
const toolchain = JSON.parse(readFileSync(path.join(android, 'local-toolchain.json'), 'utf8'));
const defaultToolchainRoot = path.join(environment.HOME, '.cache/fridge-menu-android-toolchain');
const gradleHome = environment.SPLITSNAP_GRADLE_HOME ?? path.join(defaultToolchainRoot, 'gradle', 'gradle-8.7');
const javaHome = environment.SPLITSNAP_JAVA_HOME ?? path.join(defaultToolchainRoot, 'jdk', 'temurin-17.jdk', 'Contents', 'Home');
const sdkHome = environment.SPLITSNAP_ANDROID_SDK ?? path.join(defaultToolchainRoot, 'android-sdk');
const gradle = path.join(gradleHome, 'bin', 'gradle');
const aab = path.join(android, 'app/build/outputs/bundle/release/app-release.aab');
const report = path.join(root, 'product/evidence/release/local-android-aab-provenance.json');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const bytesDigest = (file) => sha256(readFileSync(file));
const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  ...options,
});
const requireFile = (file, label) => assert.ok(existsSync(file), `${label} is required and must already be installed: ${file}`);

assert.equal(toolchain.offline_only, true);
assert.equal(toolchain.credentials_or_signing, 'forbidden');
requireFile(gradle, 'Pinned Gradle launcher');
requireFile(path.join(javaHome, 'bin', 'java'), 'Pinned JDK');
requireFile(path.join(sdkHome, 'platforms', `android-${toolchain.compile_sdk}`, 'android.jar'), 'Pinned Android platform');
assert.equal(bytesDigest(gradle), toolchain.gradle.launcher_sha256, 'Pinned Gradle launcher digest drifted');
const gradleVersion = run(gradle, ['--version'], { env: { ...environment, JAVA_HOME: javaHome } });
assert.match(gradleVersion, new RegExp(`Gradle ${toolchain.gradle.version.replace('.', '\\.')}`));
assert.match(gradleVersion, new RegExp(`Revision: +${toolchain.gradle.revision}`));
const agpJar = path.join(environment.HOME, '.gradle/caches/modules-2/files-2.1/com.android.tools.build/gradle', toolchain.android_gradle_plugin.version, '39f7fafdf840259a73a7107af8c64109086ed429', `gradle-${toolchain.android_gradle_plugin.version}.jar`);
requireFile(agpJar, 'Pinned Android Gradle Plugin cache');
assert.equal(bytesDigest(agpJar), toolchain.android_gradle_plugin.jar_sha256, 'Pinned Android Gradle Plugin digest drifted');

// Build the web payload once from the existing deterministic verification contract.
run('npm', ['run', 'verify']);
const payloadSha256 = run('npm', ['run', '--silent', 'seal:dist', '--', '--dir', 'dist']).trim();
const sourceFiles = run('git', ['ls-files', '--cached']).split('\n')
  .filter(Boolean)
  .filter((file) => file !== 'product/evidence/release/local-android-aab-provenance.json')
  .sort();
const sourceSha256 = sha256(sourceFiles.map((file) => `${file}\0${bytesDigest(path.join(root, file))}\n`).join(''));
const env = {
  ...environment,
  ANDROID_HOME: sdkHome,
  ANDROID_SDK_ROOT: sdkHome,
  JAVA_HOME: javaHome,
  SOURCE_DATE_EPOCH: run('git', ['show', '-s', '--format=%ct', 'HEAD']).trim(),
};
const build = () => {
  rmSync(path.join(android, 'app', 'build'), { recursive: true, force: true });
  const output = run(gradle, ['--offline', '--no-daemon', '--console=plain', ':app:bundleRelease'], { cwd: android, env });
  requireFile(aab, 'Unsigned AAB');
  return { sha256: bytesDigest(aab), bytes: readFileSync(aab).length, output: output.trim() };
};

const first = build();
const second = build();
assert.equal(first.sha256, second.sha256, 'Two clean offline AAB builds must be byte-identical');
mkdirSync(path.dirname(report), { recursive: true });
writeFileSync(report, `${JSON.stringify({
  schema: 'split-snap-local-android-aab-provenance-v1',
  result: 'PASS',
  source: { tree_sha256: sourceSha256 },
  payload: { path: 'dist', tree_sha256: payloadSha256 },
  offline: { gradle_argument: '--offline', network_access: 'not_attempted' },
  toolchain,
  aab: { path: 'android/app/build/outputs/bundle/release/app-release.aab', unsigned: true, sha256: second.sha256, bytes: second.bytes, repeatable: first.sha256 === second.sha256 },
  runs: [{ sha256: first.sha256, bytes: first.bytes }, { sha256: second.sha256, bytes: second.bytes }],
}, null, 2)}\n`);
console.log(`LOCAL_ANDROID_AAB: PASS path=${aab} sha256=${second.sha256} source=${sourceSha256} payload=${payloadSha256} offline=--offline`);