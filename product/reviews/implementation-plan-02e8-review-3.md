# SplitSnap implementation-plan review 3

- Reviewer: fresh independent reviewer 3 of 3
- Terminal: `term_895ecc88-2bd4-4444-be60-5ddc10fbc4a9`
- Reviewed at (UTC): `2026-08-01T08:58:40Z`
- Candidate bundle digest: `02e875d722bdac57b14e2bf4bac89ba52aa1e7f719a50dc913eea9f80a61cdea`
- Verdict basis: the three frozen inputs only.

## Freeze and prerequisite integrity — PASS

| Artifact | Bytes recomputed | SHA-256 recomputed | Freeze record |
|---|---:|---|---|
| `product/implementation-plan-review-packet.md` | 29578 | `790aaf06dfcd7349cb1520f8f2295e0b7118b06dbc8575258a0ba23540033552` | MATCH |
| `product/implementation-plan.md` | 74011 | `5ff9405e1fde0400890a0d988fc025ba29307c8f4fcaf0da7eff4125f6cb3a46` | MATCH |

The freeze artifact set has exactly the two required Markdown paths in bytewise ASCII order (packet before plan). Reconstructing `<sha256><two spaces><path><LF>` for those records yields `02e875d722bdac57b14e2bf4bac89ba52aa1e7f719a50dc913eea9f80a61cdea`, matching the freeze digest and supplied candidate digest. The plan header and freeze record both bind problem authority `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`.

The packet's fenced attestation is schema version 1, has three ordered, distinct reviews 1/2/3, all `PASS`, and every candidate equals the attested problem digest. Its stated drafting-boundary booleans are exactly false/absent as required. Reconstructing its embedded two-record problem manifest yields `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`; this agrees with the attestation, freeze, and plan header. Plan sections 1 and 10 describe future implementation/release work and explicitly do not claim runtime, deployment, or launch proof.

## Architecture, determinism, storage, privacy, accessibility — PASS

- **Scope/stack:** Plan sections 1–3 select static React/TypeScript/Vite, enumerate React/React DOM as the only runtime dependencies and locked npm dependencies, require `npm ci`, reviewed substitutions, full-SHA Actions, and exclude backend/API/account/payment/FX/OCR/analytics/remote code/secrets/paid services. The `/split-snap/` base is consistently specified for Vite, manifest start URL/scope, worker, artifact, and live tests.
- **Domain:** Section 3 parses monetary text directly to `bigint`; defines precision/separator/lexical rules, Unicode-safe label/name limits, exact normalized rationals, half-up percentage rounding, quick/itemized formulae, positive shares, exclusions, 2–8 limits, both exact zero-subtotal repairs despite positive additions, and descending-remainder/visible-order allocation.
- **Invariants:** Section 3 defines unrenamed `INV-1` through `INV-7` with the complete required predicates and requires one ordered-vector helper for F1/F2/F3/F4 base, all valid generated cases, and 100 repeats. Invalid cases require exact repair/no result. An invariant failure is `calculation_invariant_violation`, with no partial/copyable/persisted result or bill-value logging.
- **Storage/PWA/privacy/a11y:** Sections 3 and 6 require versioned local-only string-serialized integers; non-destructive corrupt/quota/unknown-schema handling; distinct confirmed deletion scopes; no derived-result persistence; generated precache/manifest/icons/offline restart/prompt update/save-before-activation/cache-data separation; no product networking or cross-origin cache; Pages-aware meta-CSP; explicit gesture/disclosed write-only copy/share; and automated plus manual WCAG 2.2 AA, keyboard/focus, screen-reader, reflow/zoom, contrast, target, reduced-motion, and Unicode evidence.

## Strict vertical TDD — PASS

Section 5 makes RED/GREEN/refactor observable: each behavior has one anchored selector, expected absent-feature failure, bounded production boundary, unique `product/evidence/implementation/tdd/<ID>.json` packet, recorded RED command/exit/output, identical GREEN rerun, full checks, and post-GREEN-only refactoring. Tooling/syntax/flaky failures and unexpected GREEN stop the sequence; retroactive/deleted/skipped/waived tests, retry-green, nonsemantic snapshots, and batch implementation are forbidden.

V00 is toolchain-only. V01–V11 contain exactly 56 behaviors with the required contiguous inventory and individual selectors/boundaries/evidence paths: V01 B01–B03 (3), V02 B01–B07 (7), V03 B01–B05 (5), V04 B01–B06 (6), V05 B01–B04 (4), V06 B01–B03 (3), V07 B01–B04 (4), V08 B01–B05 (5), V09 B01–B06 (6), V10 B01–B08 (8), V11 B01–B05 (5). The special separations required by the packet are preserved, including V03-B05 item-only exclusion, V04-B03 unresolved decomposition versus V04-B04 reconciliation/F2 tie, V07 exact three-fixture text, V09 manual assistive gate, and V10 update/cache packets. V12 and V13 add no product behavior and have only integration/artifact/live verification roles.

## Fixtures, generated matrix, and copied text — PASS

Section 6 contains complete ordered F1, F2, F3, F4-base, F4-Q0/I0, and every required F4 mutation (W0/WNEG/WFRAC/WBLANK/WTEXT/PREC/TAXNEG/TIPNEG/ITEMNEG/NOINCLUDE/DUPNAME/BLANKNAME/NINE), including F3's fixed `0.010` tip, exact outcomes/intermediates, field bindings, repairs, and no-result rules. The three normative UTF-8 F1/F2/F3 blocks have the required reconstructable fields and one-final-LF contract; V07-B01 and V12 require identity across preview, clipboard, and share payloads.

The matrix is the required ordered union: GM-C 448 (224 valid/224 invalid), GM-X 56 valid itemized-only exclusion cases, and GM-R 112 valid tie/non-tie remainder cases, total 616 (392 valid/224 invalid). Its ID grammars, dimension order, zero handling, no-quick-exclusion constraint, GM-X contribution/allocation proofs, GM-R predicates, no-skip/no-relabel rule, exact ordered invariant object, and invalid repair/no-result requirements are all specified.

## Acceptance, moderation, browser/PWA/Pages, operations, stops — PASS

- **Acceptance trace:** Packet section 6 and plan sections 6/8 trace AC-C01–AC-C06, AC-P01–AC-P06, AC-O01–AC-O06, AC-X01–AC-X08, and AC-U01–AC-U05 to automated/manual evidence. The plan supplies the exact five-coordinator/five-blinded-recipient protocol, consent/no-PII boundary, identity/timer/unassisted/F1 rules, schemas/hashes/counts, executable moderation validator, literal all-PASS deployment stop, and `problem_validated` boundary.
- **Browser/PWA/Pages:** Plan sections 3, 6, and 7 require Chromium/Firefox/WebKit plus Pixel 7/iPhone 13 emulation, real Chrome Android/Safari iOS installation evidence, production artifact worker/offline/reopen tests, complete update safety, scoped manifest/icons/precache 200 checks, and exactly one `pages.yml` DAG `resolve_source -> source_checks -> build_once -> verify_dist -> validation -> package_pages -> deploy -> live_verify` with the additional validation dependency for live verification. The plan prevents PR/push deployment, duplicate/rebuilt artifact substitution, unpinned/minimally-permitted deployment, unverified live bytes, guessed rollback, and client-data clearing.
- **Security/operations:** Sections 2–4, 6–7 require no secret/paid service, lockfile/deterministic install/full-SHA Actions/minimal permissions/dependency audit, bounded fixture-only failure evidence, no maps/tests/docs/env/PII in dist, same-origin resources, accurate meta-CSP limits, disclosed hosting/storage limits, and no destructive/commit/push/Pages/deploy action during plan writing.
- **Stops:** Section 9 explicitly stops/escalates each packet-required material condition: drift, invalid RED, arithmetic/scope ambiguity, data/update risk, privacy transmission, advisory, browser/accessibility failure, moderated evidence failure, source/artifact/live mismatch, Pages/live failure, unsafe rollback, missing authority, and flaky/skipped/waived testing. No conditional wording lowers a frozen criterion.

All packet audit criteria pass. No material correctness, privacy/security, accessibility, data-loss, or release-integrity defect was found.

VERDICT: PASS
