# SplitSnap implementation-plan review 1

Reviewer identity and fresh context: independent reviewer 1; Orca terminal handle `term_36504df1-afb4-4911-9264-22f40dfb18f3`. This review used only the three permitted frozen inputs: `product/implementation-plan.md`, `product/implementation-plan-review-packet.md`, and `product/implementation-plan-freeze.json`. It did not read workflow state, repository status/tree, problem artifacts, prior reviews, or other files.

Reviewed at (UTC): `2026-08-01T06:54:24Z`

## Freeze and authority evidence

- Expected candidate digest: `7db3b8aa5a6c488ae14e3fdf4ef6537c813531d8311d102b960891b25b0e1b3f`.
- Recomputed pre-review artifact records, in required bytewise-ASCII path order:
  - `product/implementation-plan-review-packet.md`: 25,134 bytes; SHA-256 `b0be69b0125cf4c8259816a894af5537b56b0dd9bc6177b1fa54cd818a3be3e6`.
  - `product/implementation-plan.md`: 62,504 bytes; SHA-256 `e8302c7c79b978aade85881a92b5706a9c44439f231a1d2add58a4a7dc89d874`.
- Reconstructed UTF-8 manifest used exactly two ASCII spaces and a final LF after each line:

  ```text
  b0be69b0125cf4c8259816a894af5537b56b0dd9bc6177b1fa54cd818a3be3e6  product/implementation-plan-review-packet.md
  e8302c7c79b978aade85881a92b5706a9c44439f231a1d2add58a4a7dc89d874  product/implementation-plan.md
  ```

  Its SHA-256 is `7db3b8aa5a6c488ae14e3fdf4ef6537c813531d8311d102b960891b25b0e1b3f`, exactly matching the freeze record and supplied candidate digest.
- The freeze schema, UTF-8/SHA-256 declaration, exactly-two-artifact set, required order, byte lengths, and hashes all PASS.
- The embedded problem manifest reconstructs to `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`, matching the attestation, freeze authority digest, and plan header. The schema version, ordered distinct review numbers 1–3, PASS verdicts, and stated drafting-boundary booleans PASS.

## Adversarial rubric findings

### Blocking findings

1. **FAIL — prerequisite attestation does not meet the packet's executable review-candidate requirement.** Packet §2 step 2 requires “every review candidate equal to the problem digest.” The three objects in `problem_strict_serial_gate.reviews` contain `review_number`, artifact, bytes, SHA-256, terminal, time, and verdict, but no per-review `candidate_digest`. The enclosing gate-level `candidate_digest` cannot prove that each individual review is bound to the authority digest. This fails the explicit frozen prerequisite check; it is not repaired by the three `PASS` verdict strings. Smallest correction: add `candidate_digest: "adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd"` to each of the three review objects, then issue a new freeze candidate and restart the required review sequence.

2. **FAIL — seven calculation invariants are neither enumerated nor individually asserted.** Packet §3 requires all seven calculation invariants to be asserted, and §5 requires every generated valid case to assert every invariant. Plan §3 “Money and rational model” names only aggregate/result checks (subtotal/addition/grand-total equality, allocation-sum equality, payer-owed equality, nonnegative owed, and stable recipient order); it does not define a complete numbered set of seven invariants. Plan §6 then says the matrix asserts “all seven invariants” without supplying their identities. This leaves implementers and reviewers unable to determine the missing assertions and makes the matrix non-deterministically auditable. Smallest correction: enumerate all seven invariant IDs with exact predicates in the plan, bind each to canonical and generated tests, and retain the explicit failure behavior before re-freezing.

### Passing findings

- **Architecture and scope:** PASS except for the invariant defect above. Plan §§1–3 choose a proportionate static React/TypeScript/Vite stack; restrict runtime dependencies to React/React DOM; lock npm dependencies; prohibit server/accounts/payment/FX/OCR/networking/secrets; require reviewed substitutions and full-SHA Actions pins; and consistently bind `/split-snap/` across base, manifest, scoped navigation, Pages artifact checks, and live tests.
- **Domain and fixture determinism:** PASS except for the invariant defect above. Plan §§3 and 6 specify direct text-to-`bigint` monetary parsing, precision/separator/Unicode limits, exact rationals and half-up percentage rounding, both entitlement formulae, exact zero-subtotal repairs, deterministic largest-remainder allocation, F1–F4 including F3 fixed `0.010`, all listed F4 mutations, and a fixed-order generated matrix.
- **Storage, PWA, privacy, accessibility:** PASS. Plan §§3 and 6 define local-only versioned string serialization, no persisted result, byte preservation on corrupt/unknown/quota failures, confirmed deletion scopes, precache/update/cache-data separation, no product networking or clipboard read, explicit copy/share disclosure, meta-CSP limitations, and automated plus manual accessibility evidence.
- **Strict vertical TDD:** PASS. Plan §§4–5 provide V00 toolchain-only isolation; exactly 56 contiguous, unique V01–V11 behavior rows; literal single anchored selectors; one missing-feature RED; minimal boundaries; one matching evidence path per ID; recorded RED/exit/output and later GREEN/full/refactor evidence; invalid-RED and unexpected-pass stops; no waiver/retry/snapshot loopholes; and V12/V13 behavior limits. Independent table check found 56 unique contiguous IDs, 56 exact evidence paths, and all selectors singly anchored.
- **Acceptance, Pages, operations, and stops:** PASS. Plan §§6–10 supplies the AC-C/P/O/X/U evidence route, moderated protocol and mechanical all-PASS launch stop, same-revision Pages DAG and live byte/UI/privacy/offline evidence, compatible rollback/fix-forward constraints, dependency/security controls, and explicit stop/escalation conditions.

## Material defects and verdict

Material defects are the missing per-review authority binding in the packet attestation and the undefined seven-invariant contract in the plan. The frozen bytes are intact, so this is a content verdict of FAIL rather than STALE. A conditional pass is not issued.

## Post-review freeze check

The only written artifact was this review report. The two candidate Markdown artifacts and freeze JSON were not modified. Recomputed post-review records and manifest digest remain exactly the expected digest: `7db3b8aa5a6c488ae14e3fdf4ef6537c813531d8311d102b960891b25b0e1b3f`.

VERDICT: FAIL
