# SplitSnap

A mobile-first, local-only PWA for splitting a single bill exactly among 2–8 people, including tax, tip, unequal shares, deterministic rounding, and a plain-text result.

## Status

Product definition and implementation planning are present under `product/`. Application implementation is in progress.

## Product boundaries

- No account, backend, payment initiation, analytics, ads, or third-party tracking.
- Bill data remains on-device unless the user explicitly copies or shares plaintext.
- Core use works offline after the first successful load.
- Every smallest monetary unit must reconcile deterministically.

## Development contract

Once implementation files exist, the repository must expose reproducible `test`, `build`, and local `start` commands and document them here.
