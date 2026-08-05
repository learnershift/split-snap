# Release manifest — local readiness tranche

- **App / package:** SplitSnap / `com.learnershift.splitsnap`
- **Source version:** `package.json` `1.0.0`; Android `versionName` `1.0.0`, `versionCode` `1`
- **Channel:** Google Play (not configured, not submitted)
- **Artifact state:** A local unsigned AAB was built twice with byte-identical output: `android/app/build/outputs/bundle/release/app-release.aab`, SHA-256 `0aee1c49de6fd8ae17d0c3ac9f50cb0cc5d5b01a26813bf47d6fc8053ac6c860`, 570,921 bytes. No signing key is configured and no upload was performed.
- **Deterministic local gates:** `npm run verify:play-readiness`, `npm run verify:local-android-aab`, `npm run verify`, and `npm run android:aab:local`.
- **Web artifact prerequisite:** `npm run verify` produces and seals `dist/`; Android consumes that directory as packaged assets. The verified payload tree SHA-256 is recorded in `product/evidence/release/local-android-aab-provenance.json`.
- **Pinned no-credential local bundle command:** `npm run android:aab:local`. It checks Gradle 8.7, JDK 17, SDK 35, AGP 8.6.1 digests and invokes Gradle with `--offline`; release signing is explicitly `null`. It builds twice and writes the unsigned AAB, source-content-tree, payload, and offline provenance. Source provenance is an immutable file-content tree digest, not a parent/current Git commit SHA, so it remains truthful when the evidence file itself changes.

## Release blockers

1. The local unsigned AAB is verified only as a deterministic offline build; it is not a signed, store-uploadable release artifact.
2. No project Gradle wrapper is committed. The local command instead uses a digest-pinned preinstalled Gradle 8.7 launcher and the available offline dependency closure; it performs no download.
3. No release keystore, alias, or signing configuration exists (intentionally; do not add credentials to source control).
4. No emulator/device install, Android accessibility run, or Android offline validation exists; these remain device-only validation boundaries.
5. Play Console account setup, app registration, developer contact, audience/rating/content declarations, and country selection remain owner/console actions.
6. `play-listing/privacy-policy.md` is a draft, not a public policy URL. Screenshots also remain pending device capture.
7. Moderated AC-U01 through AC-U05 validation remains unavailable per the existing workflow gate.

## Explicitly not performed

No deployment, hosting enablement, signing, AAB upload, Play Console submission, publication, or launch.
