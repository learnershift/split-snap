# SplitSnap frozen problem-definition review 1

## Reviewer identity and independence

- Role: fresh independent reviewer 1 of the strictly serial three-pass problem gate
- Reviewer: Codex primary reviewer in a fresh SplitSnap review context
- Orca terminal handle: `term_afb5e3f5-e0fd-4446-8e70-97537424317c`
- Review timestamp: `2026-08-01T03:57:06Z` (`2026-08-01T12:57:06+09:00`)
- Independence statement: no prior SplitSnap review report or verdict was consulted or relied on, and no subagent was used. The review was performed from the three frozen inputs named by the owner, independent arithmetic, and the cited primary/official evidence sources.
- Write boundary: only this report was created. The candidate artifacts, `product/problem-freeze.json`, and `product/workflow-state.json` were not edited.

## Frozen-bundle integrity

The two Markdown files were read as raw bytes. Both decode as UTF-8 and end in LF. The manifest was reconstructed in lexicographic path order using exactly two ASCII spaces between each hash and path and one LF after each path.

| Artifact | Recorded bytes | Recomputed bytes | Recorded SHA-256 | Recomputed SHA-256 | Result |
|---|---:|---:|---|---|---|
| `product/problem-definition.md` | 20460 | 20460 | `e8894bce7b6147c4aa34d0f56dbb01a81faa848a48c2317087e05104438c1042` | `e8894bce7b6147c4aa34d0f56dbb01a81faa848a48c2317087e05104438c1042` | PASS |
| `product/problem-review-packet.md` | 14813 | 14813 | `0906a6d1e4850f76b7f210058de0301dde006a34e9c2402d16845e3b3046345b` | `0906a6d1e4850f76b7f210058de0301dde006a34e9c2402d16845e3b3046345b` | PASS |

Exact reconstructed manifest bytes, rendered as one escaped UTF-8 string:

`e8894bce7b6147c4aa34d0f56dbb01a81faa848a48c2317087e05104438c1042  product/problem-definition.md\n0906a6d1e4850f76b7f210058de0301dde006a34e9c2402d16845e3b3046345b  product/problem-review-packet.md\n`

- Freeze-record digest: `0bb919869f7a78bfeffe9d135c1f533d453942e5f96dbd6b02a4614af4c63864`
- Owner-expected digest: `0bb919869f7a78bfeffe9d135c1f533d453942e5f96dbd6b02a4614af4c63864`
- Recomputed manifest digest: `0bb919869f7a78bfeffe9d135c1f533d453942e5f96dbd6b02a4614af4c63864`
- Integrity result: PASS. The candidate is current rather than STALE.

## Evidence and claim audit

Official/primary sources were checked at review time, within the packet's deliberately bounded claims.

| Check | Evidence observed | Result |
|---|---|---|
| E1 | Splitwise's official product/help pages present trips and equal, unequal, percentage, and share splits. Its currency help distinguishes per-expense currency labels from Pro currency conversion. | PASS |
| E2 | Tricount's official product/help pages present travel/group expenses, offline tracking, multiple currencies, and equal/part/custom splits. “21 million” remains visibly a vendor claim, not an independently verified fact. | PASS |
| E3 | GDPR Article 5(1)(c) states that personal data must be adequate, relevant, and limited to what is necessary, identifying this as data minimisation. The definition uses it only as a design principle. | PASS |
| E4 | MDN explains service-worker-backed offline capability and variation in PWA installation behavior by browser/platform. The definition correctly treats this as feasibility, not finished-product proof. | PASS |
| E5 | WCAG 2.2 is a W3C Recommendation and defines the cited A/AA areas, including keyboard access, contrast, resize/reflow, focus, errors, and target size. The definition states a future test target, not present conformance. | PASS |

Packet section 4 evidence-to-claim checklist:

- E1-E5 observable at the cited official/primary sources: PASS.
- Vendor usage labeled as vendor-reported: PASS.
- No proven preference claimed for the local-only/manual/single-device trade-off: PASS.
- A1-A7 each state a test and failure signal: PASS.
- “Global” is narrowed to globally accessible English V1, Unicode input, arbitrary label/precision, and no FX/localization claim: PASS.
- GDPR is not used as a blanket compliance claim: PASS.
- PWA feasibility is not represented as tested behavior: PASS.
- WCAG 2.2 AA is an acceptance target rather than a conformance claim: PASS.

## Criteria, coherence, and fixture audit

### User problem, owner intent, and scope

- The coordinator, 2-8-person temporary bill, one-device operating context, inspectable obligations, copied-text recipient, and excluded user groups are concrete and mutually consistent: PASS.
- The owner-intent trace preserves privacy-first/offline, arbitrary monetary label, tax/tip, unequal shares, deterministic reconciliation, installability, and no account/backend/payment. “Launch today” is correctly prevented from bypassing evidence and acceptance gates: PASS.
- Evidence is separated from inference and open assumptions. The definition remains `REVIEWABLE, NOT YET VALIDATED` and does not turn competitor positioning into user preference evidence: PASS.
- Non-goals, privacy disclosures, storage-loss limitations, hosting-metadata qualification, and explicit plaintext sharing boundary do not contradict the proposed V1: PASS.

### Canonical fixtures

- F1 independently recomputes to exact cent entitlements `56126/75`, `104867/75`, and `60557/75`; floors are 748, 1398, and 807 cents with remainders `26/75`, `17/75`, and `32/75`. Cy receives the sole cent, producing 7.48, 13.98, and 8.08; total 29.54 and amount owed 22.06: PASS.
- F2 is an exact three-way tie at `100/3`; visible order assigns the remaining unit to Dee, producing 34, 33, and 33 and amount owed 66: PASS.
- F3's raw tax is `50.25` configured smallest units and rounds to 50; grand total is 1065 units and each exact entitlement is `1065/2`. Visible order assigns the remaining unit to Gia, producing 0.533 and 0.532: PASS.
- F4's stated exclusion and validation cases are binary and consistent with the positive-integer-share and over-precision rules: PASS for the cases it actually states.
- The listed fixtures are arithmetically deterministic. AC-C02 and AC-C03 are appropriately future execution tests, not evidence that a build already exists or passes: PASS for testability of the listed cases.

### Falsifiability and quality boundaries

- A1-A7, the 4/5 success thresholds, the immediate stop signals, and the explicit `inconclusive` region distinguish validation, falsification, and insufficient evidence: PASS.
- AC-C01-C06 specify observable calculation/result/copy outcomes; AC-P01-P06 specify network, permission, copy, deletion, and disclosure evidence; AC-O01-O06 specify offline/restart/update/install testing; AC-X01-X08 specify accessibility and Unicode/number behavior; AC-U01-U05 specify observed user validation. None substitutes a future test for present user evidence: PASS, subject to the blocking input-domain defect below.
- Privacy/local-only, offline-after-first-load, persistence-loss, installation variance, WCAG 2.2 AA, keyboard/screen-reader/reflow/contrast, Unicode, decimal precision, and no-FX boundaries are explicit and falsifiable: PASS.
- Packet section 7 risk/non-goal questions all answer “no” on the frozen text: no account/backend/live link/sync/payment implication; no FX/mixed-currency implication; no anonymity or backup overclaim; no OCR/analytics/remote-code requirement; no localization/global-compliance overclaim; no preference claim from a test; and no architecture, implementation sequence, code, or launch authorization: PASS.

## Material defect

### M1 — accepted zero-subtotal input leaves allocation undefined

Blocking locations: problem definition V1 scope and invariants (lines describing quick/itemized pre-tax input, fixed tax/tip, weighted pre-tax entitlement, and deterministic output); packet owner-intent trace; F4 validation boundary; AC-C03.

The definition permits fixed tax and tip and says they follow each participant's weighted pre-tax entitlement. It rejects negative items and negative fixed additions, but nowhere requires the pre-tax subtotal to be positive or rejects a zero pre-tax subtotal. Therefore this input is not excluded:

- two participants with positive shares;
- quick pre-tax total `0.00` (or an itemized bill whose items total `0.00`);
- fixed tax or tip greater than zero.

Every participant's pre-tax monetary entitlement and the total pre-tax entitlement are then zero. The prescribed proportional allocation requires division by zero (`0/0`). Participant order cannot resolve this because no discarded fractional remainders have been defined. Multiple ad hoc allocations could satisfy the sum invariant, but the frozen contract does not select one, so normative invariant 6 and the packet's deterministic/binary acceptance promise are not defined for an input the contract currently accepts.

This is a definition-level calculation ambiguity, not an implementation detail. It blocks unconditional PASS even though F1-F3 are correct and the bundle digest is current.

Smallest sufficient correction: add an explicit validation rule that calculation is blocked unless the pre-tax subtotal is greater than zero (with a field-specific repair message). If zero-subtotal bills are intended to remain valid, the definition must instead specify a deterministic allocation basis for positive fixed additions in both quick-total and itemized modes, plus a canonical fixture for that case.

## Unconditional verdict

FAIL. Freeze integrity and the evidence, owner-intent, privacy, offline, accessibility, falsifiability, and listed-fixture checks pass, but M1 leaves a valid-looking bill without a defined deterministic allocation. Conditional PASS is not issued.

VERDICT: FAIL
