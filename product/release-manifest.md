# Release manifest — local readiness tranche

- **App / package:** SplitSnap / `com.learnershift.splitsnap`
- **Source version:** `package.json` `1.0.0`; Android `versionName` `1.0.0`, `versionCode` `1`
- **Channel:** Google Play (not configured, not submitted)
- **Artifact state:** No AAB built; no signing key configured; no upload performed.
- **Deterministic local gates:** `npm run verify:play-readiness`, `npm run verify:local-android-aab`, and `npm run verify`.
- **Web artifact prerequisite:** `npm run verify` produces and seals `dist/`; Android consumes that directory as packaged assets. The verified payload tree SHA-256 is recorded in `product/evidence/release/local-android-aab-provenance.json`.
- **Pinned no-credential local bundle command:** `npm run android:aab:local`. It checks Gradle 8.7, JDK 17, SDK 35, AGP 8.6.1 digests and invokes Gradle with `--offline`; release signing is explicitly `null`. It will build twice and write AAB/source/payload/offline provenance only when the complete pinned offline dependency closure exists.

## Release blockers

1. The pinned local SDK 35 and JDK 17 are present, but the pinned Android Gradle Plugin 8.6.1 dependency closure is incomplete in Gradle's local cache. The `--offline` build is blocked before task execution by missing `org.jetbrains.kotlin:kotlin-reflect:1.9.20`, `org.jetbrains.kotlin:kotlin-stdlib:1.9.20`, and `org.jetbrains:annotations:23.0.0`; the exact command and provenance are in `product/evidence/release/local-android-aab-provenance.json`.
2. No project Gradle wrapper is committed. The replacement is a digest-pinned, preinstalled Gradle 8.7 launcher path, but a complete preinstalled/cached AGP closure remains required; the local command will not download it.
3. No release keystore, alias, or signing configuration exists (intentionally; do not add credentials to source control).
4. No locally built/signed AAB, emulator/device install, Android accessibility run, or Android offline validation exists.
5. Play Console account setup, app registration, developer contact, audience/rating/content declarations, and country selection remain owner/console actions.
6. `play-listing/privacy-policy.md` is a draft, not a public policy URL. Screenshots also remain pending device capture.
7. Moderated AC-U01 through AC-U05 validation remains unavailable per the existing workflow gate.

## Explicitly not performed

No deployment, hosting enablement, signing, AAB upload, Play Console submission, publication, or launch.
