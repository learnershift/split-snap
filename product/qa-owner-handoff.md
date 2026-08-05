# QA and owner handoff — local draft

## Deterministic evidence to run before an owner release decision

1. `npm run verify`
2. `node scripts/verify-play-readiness.test.mjs`
3. With a provisioned Android SDK, build an unsigned local candidate using `gradle -p android bundleRelease` after `npm run verify`.
4. Install only on a local emulator/device and perform the existing offline, install, accessibility, privacy, quick, and itemized flows against the Android package. Record device/API level and results.

## Owner decisions required before any Play Console action

- Confirm app name, listing copy, category, countries, developer contact details, and legal/privacy-policy publication URL.
- Supply or authorize secure creation of a release signing key outside Git; confirm key custody and rotation/recovery owner.
- Review final AAB version code, screenshots, content rating, target audience, data-safety answers, and declarations in Play Console.
- Give fresh, action-specific approval that names the target (for example, internal testing or production) before signing, uploading, submitting, publishing, enabling hosting, or launching.

## Handoff boundary

This repository contains only local preparation. Passing the deterministic checks does not establish independent review PASS, store compliance, Android-device compatibility, signing readiness, or publication approval.
