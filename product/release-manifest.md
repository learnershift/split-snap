# Release manifest — local readiness tranche

- **App / package:** SplitSnap / `com.learnershift.splitsnap`
- **Source version:** `package.json` `1.0.0`; Android `versionName` `1.0.0`, `versionCode` `1`
- **Channel:** Google Play (not configured, not submitted)
- **Artifact state:** No AAB built; no signing key configured; no upload performed.
- **Deterministic local gate:** `node scripts/verify-play-readiness.test.mjs`
- **Web artifact prerequisite:** `npm run verify` produces and seals `dist/`; Android consumes that directory as packaged assets.
- **Android bundle command, when an owner-provided Android SDK and Gradle 8.7 wrapper/toolchain are available:** `npm run verify && gradle -p android bundleRelease`

## Release blockers

1. Android SDK command-line tools/platform `android-35` and build tools are not installed in this environment.
2. No project Gradle wrapper is committed; a pinned Gradle 8.7 installation is required to execute the configuration.
3. No release keystore, alias, or signing configuration exists (intentionally; do not add credentials to source control).
4. No locally built/signed AAB, emulator/device install, Android accessibility run, or Android offline validation exists.
5. Play Console account setup, app registration, developer contact, audience/rating/content declarations, and country selection remain owner/console actions.
6. `play-listing/privacy-policy.md` is a draft, not a public policy URL. Screenshots also remain pending device capture.
7. Moderated AC-U01 through AC-U05 validation remains unavailable per the existing workflow gate.

## Explicitly not performed

No deployment, hosting enablement, signing, AAB upload, Play Console submission, publication, or launch.
