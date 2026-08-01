# SplitSnap implementation-plan strict serial review 3

- Reviewer: fresh independent reviewer 3
- Runtime terminal: `term_8af96e95-d3d0-4f6a-9bc3-8c268c523c6c`
- Reviewed at (UTC): `2026-08-01T07:56:38Z`
- Expected candidate bundle digest: `087c33c64a99e98f133a5e879b7ff45583e699835dd124808269907671459b40`
- Recomputed pre-review digest: `087c33c64a99e98f133a5e879b7ff45583e699835dd124808269907671459b40`
- Recomputed post-review digest: `087c33c64a99e98f133a5e879b7ff45583e699835dd124808269907671459b40`
- Review inputs: exactly the three frozen candidate files named by the packet; no workflow state, Git state/history/tree, problem source, prior review, or other project file was read.

## Integrity and authority evidence

| Candidate input | Recomputed bytes | Recomputed SHA-256 | Result |
|---|---:|---|---|
| `product/implementation-plan-review-packet.md` | 27530 | `5faf3baa8df15267eeb41317f1a8db3afce68e361736f9e26aeab849aa5e2bc5` | PASS |
| `product/implementation-plan.md` | 65972 | `a4418fee31493f84e78eeb57c4c1e628d5f7387e67593e6a4af85b254a238600` | PASS |
| `product/implementation-plan-freeze.json` | 947 | `0eb16b4d2df74c11344f2707584c68f01c5cdd172b8c4b84ce954d4a77187822` | PASS |

The freeze requires bytewise ASCII path ordering, two ASCII spaces between hash and path, one final LF per line, and exclusion of the freeze JSON (freeze lines 19–24; packet lines 326–342). Reconstructing the exact two-line manifest in the required order—review packet first because `-` precedes `.`, then plan—produced `087c33c64a99e98f133a5e879b7ff45583e699835dd124808269907671459b40` both before and after the content review. The artifact set, order, byte counts, individual hashes, and bundle digest therefore pass the freeze contract.

The embedded problem manifest was independently reconstructed from the two attested artifact records (packet lines 34–50) and produced `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`. It equals the attested digest, all three attested review candidate digests and PASS verdicts (packet lines 51–87), the freeze authority digest (freeze line 4), and the plan header (plan line 5). The attestation has schema version 1, exactly ordered distinct reviews 1–3, and the drafting-boundary values required by packet lines 88–104. The plan correctly makes only future implementation/deployment claims (plan lines 3, 12–18, 576–578). Authority and prerequisite consistency pass.

## Adversarial audit result

The architecture and domain core are otherwise coherent: runtime dependencies are limited to React/React DOM and the toolchain is enumerated and lockfile-bound (plan lines 20–39); money is parsed directly to `bigint`, percentage math is exact rational with half-up rounding, zero-subtotal modes have exact repairs, and allocation uses largest remainder with visible-order ties (plan lines 120–144). `INV-1` through `INV-7` are present in the required order and predicates, with the shared all-seven helper, invalid-case no-result rule, and `calculation_invariant_violation` failure boundary (plan lines 132–142). F1–F4 inputs and numeric outputs, including F3 fixed tip `0.010`, are complete (plan lines 285–348).

Local-only persistence, original-byte preservation, distinct confirmed deletion scopes, service-worker/data separation, prompt-update save protection, no product networking, meta-CSP limits, explicit write-only clipboard/share gestures, and privacy canaries are specified (plan lines 146–173, 375–396). Responsive and WCAG evidence covers automated states plus keyboard, focus, VoiceOver/TalkBack, 320 CSS px, 200% zoom, contrast, 44×44 targets, and reduced motion (plan lines 261–266, 383–388). The base, manifest, precache, offline restart, real-device install checks, same-run Pages digest checks, moderated launch stop, content-addressed recovery, schema compatibility, fix-forward, and repeated live recovery gates are substantially defined (plan lines 157–165, 398–443, 445–528).

The behavior inventory mechanically contains 56 unique rows, V01-B01 through V11-B05, each with an anchored literal selector and its required unique `product/evidence/implementation/tdd/<ID>.json` path (plan lines 202–283). The general RED/GREEN/refactor evidence protocol rejects invalid RED, unexpected pass, skipped/waived/flaky tests, and requires narrow plus full checks. That mechanical completeness does not cure the blocking packet-level gaps below.

## Blocking findings

### B1 — Generated invariant matrix omits required dimensions

**Blocking criterion:** The packet requires the deterministic generated matrix itself to span exclusions and tie/non-tie remainders in addition to precision, participant count, modes, share shapes, addition types, and zero/positive subtotal; each valid case must report the full seven-ID vector (packet line 212; AC-C03 at packet line 224).

**Finding:** The plan's generated-matrix contract lists precision 0–3, 2–8 participants, quick/itemized, equal/unequal weights, fixed/percentage additions, and zero/positive subtotal, but it does not include exclusions or tie/non-tie remainder classes as generated dimensions (plan line 356). The preceding general domain bullet mentions exclusions and remainder examples (plan line 355), but does not bind them to the generated matrix or its case/count evidence. An implementation can satisfy the literal generated-matrix bullet while omitting two dimensions expressly required by the packet.

**Smallest correction:** Amend the generated-matrix contract and evidence schema to require explicit exclusion and tie/non-tie remainder case classes, with case IDs/counts and ordered `INV-1`–`INV-7` results for every valid case, then refreeze.

### B2 — AC-C06 does not require F2 and F3 copied-text reconstruction

**Blocking criterion:** Copied text for F1, F2, and F3 must independently reconstruct the bill without the app (packet line 227), and exact plaintext preview/disclosure is required (packet line 158).

**Finding:** The only single-behavior formatter packet is explicitly F1 (`V07-B01`, plan line 252). The broader domain list merely says “copied-output arithmetic reconstruction” without naming F1–F3 or their required fields (plan line 358), while the blinded recipient protocol also uses only F1 (plan lines 423–426). The acceptance trace says “Exact preview/output” but supplies no F2/F3 assertion (plan line 541). Thus F2 and F3 copy output can remain untested or omit payer/owed/total/rounding reconstruction while the literal plan still passes.

**Smallest correction:** Add exact F1–F3 copied-text contract tests (without adding a new product behavior), requiring payer, allocations/owed amounts, grand total, monetary label/precision, and rounding recipient/reason to be reconstructable from each plaintext output; bind them to the existing V07/V12 checks and refreeze.

### B3 — The packaged Pages artifact is not the immutable artifact exercised by automated browser checks

**Blocking criterion:** Deployment must package an immutable tested Pages artifact, with deterministic unit/e2e/a11y/build checks and same-run artifact lineage; package/deploy must not substitute an untested rebuild (packet lines 286–292 and the review request's immutable-tested-artifact requirement).

**Finding:** The `test` job runs `npm run verify`, including a production build/preview, then the downstream `build` job performs a separate checkout, install, and build and uploads that new `dist/` (plan lines 465–469). `validation` and `package_pages` hash and carry the second build, but the plan never runs the full e2e/offline/install/a11y/privacy browser suites against that uploaded `dist/`. The plan also explicitly permits build-byte differences caused by timestamps/tool metadata (plan line 395). Source/lock equality and later hashing prove lineage and integrity, not that the exact packaged bytes received the automated browser checks.

**Smallest correction:** Build once into a content-addressed internal artifact, make all automated browser/static and release validation jobs download and test that exact immutable artifact, and make `package_pages` upload the same verified bytes without rebuilding; then refreeze.

### B4 — V04 remainder/tie sequencing cannot guarantee the required feature-missing RED

**Blocking criterion:** Every behavior must begin with a feature-missing RED; an unexpectedly passing test stops work, and one packet's minimal boundary may not already implement a sibling packet (packet lines 165–175 and 195).

**Finding:** V04-B03 adds deterministic floor/remainder ranking (plan line 241), while V04-B04 expects a later RED for visible-order tie resolution (plan line 242). In JavaScript, a remainder sort that returns equality for equal remainders is stable, so participants already remain in visible input order; a straightforward minimal B03 implementation therefore makes canonical F2 in B04 pass before B04 production work. Deliberately choosing a different tie rule merely to force RED would contradict the frozen allocation rule (plan line 130) and introduce knowingly wrong behavior. The sequence therefore does not provide an executable, guaranteed missing-feature RED for B04.

**Smallest correction:** Reslice remainder reconciliation so the first behavior includes the normative tie rule, or choose an earlier test boundary whose observable assertion cannot already satisfy the later tie packet; preserve one-behavior RED evidence and refreeze the inventory.

## Explicit verdict criteria

Integrity is not stale, and the authority attestation is internally valid. However, each of B1–B4 independently leaves a frozen acceptance requirement unproven or makes the strict RED sequence non-executable. The packet defines any such checklist failure as blocking and permits no conditional PASS (packet lines 161, 310–319). No implementation, deployment, or launch claim is inferred from this review.

VERDICT: FAIL
