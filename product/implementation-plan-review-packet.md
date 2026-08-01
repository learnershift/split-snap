# SplitSnap implementation-plan review packet

Packet status: **ready to freeze with the implementation-plan candidate**  
Packet date: 2026-08-01  
Problem authority digest: `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`  
Plan artifact: `product/implementation-plan.md`  
Freeze record: `product/implementation-plan-freeze.json`

## 1. Review question and authority boundary

Does the exact frozen implementation plan provide a complete, deterministic, privacy-preserving, test-first route from the 3/3-passed problem definition to a verifiably installable/offline GitHub Pages PWA at `/split-snap/`, without adding hidden product scope, weakening an acceptance criterion, or claiming unexecuted implementation/launch evidence?

A PASS means only that implementation may begin under the owner’s existing implementation/public-launch authorization. It does not mean production code exists, tests pass, GitHub Pages is configured, the app is deployed, or launch is complete.

Review inputs are **exactly**:

1. `product/implementation-plan.md`
2. `product/implementation-plan-review-packet.md`
3. `product/implementation-plan-freeze.json`

The reviewer must not read workflow state, repository status/tree, problem/review artifacts, another plan review, or any mutable external governance file. Problem authority, prior problem gate, and drafting boundary are represented by the frozen attestations below. Serial scheduling and ledger updates are runtime-governance duties outside the content verdict; the reviewer receives its review number and candidate digest from the owner/runtime but does not inspect predecessor reports.

Each of the required three plan reviews must be fresh, independent, strictly serial, and bound by runtime authority to the unchanged plan digest. A FAIL resets the external successful streak to zero and requires a new frozen candidate after correction; this rule does not expand the allowed content inputs.

## 2. Executable frozen prerequisite attestations

The JSON block between the markers is the complete prerequisite attestation. It is not a pointer. Its bytes are covered by the review-packet file hash and therefore by the plan bundle digest.

<!-- SPLITSNAP_ATTESTATIONS_BEGIN -->
```json
{
  "schema_version": 1,
  "attested_at": "2026-08-01T05:03:55Z",
  "problem_authority": {
    "algorithm": "sha256",
    "manifest_contract": "<sha256><two ASCII spaces><path><LF>, bytewise lexicographic paths",
    "artifacts": [
      {
        "path": "product/problem-definition.md",
        "bytes": 20914,
        "sha256": "c177db044dfe0ccdbd6275a97a2f0f3f75c459fa5924e9678c8a4aedee5c6670"
      },
      {
        "path": "product/problem-review-packet.md",
        "bytes": 15525,
        "sha256": "ae184108aaf461065d22fe7d83a28a482ebc725b5ec01807b1a87c26eea16d15"
      }
    ],
    "digest": "adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd"
  },
  "problem_strict_serial_gate": {
    "required": 3,
    "verdict": "PASS",
    "candidate_digest": "adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd",
    "reviews": [
      {
        "review_number": 1,
        "candidate_digest": "adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd",
        "artifact": "product/reviews/problem-adb4-review-1.md",
        "bytes": 6444,
        "sha256": "d433899b3843aed80498656dd2160e9a190b5e2629ece103321febf51c306a81",
        "terminal": "term_ce87a338-4d81-42c5-b835-50f400a5569b",
        "reviewed_at": "2026-08-01T04:02:18Z",
        "verdict": "PASS"
      },
      {
        "review_number": 2,
        "candidate_digest": "adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd",
        "artifact": "product/reviews/problem-adb4-review-2.md",
        "bytes": 6619,
        "sha256": "ed1897b31077ce67af6460124d1e08898bf3b59202f030427a44e818e9ba2cf8",
        "terminal": "term_4a95e0fc-e187-44bf-b24f-e460c22b559a",
        "reviewed_at": "2026-08-01T04:23:38Z",
        "verdict": "PASS"
      },
      {
        "review_number": 3,
        "candidate_digest": "adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd",
        "artifact": "product/reviews/problem-adb4-review-3.md",
        "bytes": 6184,
        "sha256": "3778f6a401bf9f3442a273ad48d51d51a8a40252ca6e31efd16affe32a044f2f",
        "terminal": "term_74ee4344-5717-44a4-bf9c-eed0f7e2c868",
        "reviewed_at": "2026-08-01T04:29:27Z",
        "verdict": "PASS"
      }
    ]
  },
  "drafting_boundary": {
    "production_code_created": false,
    "deployment_performed": false,
    "dependencies_installed": false,
    "prohibited_paths_observed_absent": [
      ".github",
      "index.html",
      "package-lock.json",
      "package.json",
      "public",
      "scripts",
      "src",
      "tests"
    ],
    "implementation_complete": false,
    "launch_complete": false
  }
}
```
<!-- SPLITSNAP_ATTESTATIONS_END -->

Executable prerequisite procedure using only the three allowed files:

1. Recompute the two plan Markdown hashes/bytes and plan manifest digest from `implementation-plan-freeze.json`. Any difference is **STALE**.
2. Extract the fenced JSON located between `SPLITSNAP_ATTESTATIONS_BEGIN` and `SPLITSNAP_ATTESTATIONS_END`, parse it, require `schema_version == 1`, exactly three ordered distinct problem reviews numbered 1–3, every verdict `PASS`, every review candidate equal to the problem digest, and `drafting_boundary` booleans exactly as stated.
3. Reconstruct the attested problem manifest from the two embedded artifact records and require its digest equals both the attested problem digest, the freeze `problem_authority_digest`, and the plan header. This checks internal content-addressed consistency without opening the problem files.
4. Confirm the plan describes future files/actions only and contains no claim that the attestation itself proves runtime implementation/deployment. The reviewer does not inspect the repository to re-prove the attested snapshot.

The workflow candidate digest is deliberately not an attestation field because embedding the current plan digest inside a hashed plan artifact would be self-referential. Governance independently records the recomputed digest after freeze; it is not a content-review prerequisite.

## 3. Architecture decision audit

Mark every item PASS or FAIL with a file/section citation.

### Scope and stack

- [ ] Static React + TypeScript + Vite is proportionate to repeated dynamic forms, focus/error state, persistence, and browser testing.
- [ ] Runtime dependencies are only React/React DOM; build/test dependencies are enumerated and locked by `package-lock.json`.
- [ ] No server framework, API, account, payment, FX, OCR, analytics, remote resource, secret, paid service, or production database is introduced.
- [ ] Dependency additions/substitutions require review; CI uses `npm ci`; Actions are planned for reviewed full-SHA pins.
- [ ] `/split-snap/` is consistently the Vite base, manifest start URL/scope, service-worker scope, artifact path, and live-test path.

### Domain determinism

- [ ] Monetary input becomes `bigint` smallest units directly from text and never passes through `number`.
- [ ] Precision 0–3, decimal-separator behavior, malformed/over-precision rejection, 1–12-code-point monetary label, 1–40-code-point participant names, and Unicode-safe rendering are explicit.
- [ ] Percentages and entitlements are normalized exact rationals; percent additions round to the nearest unit with exact halves upward.
- [ ] Quick and itemized entitlement formulae, exclusions, positive integer weights, and 2–8 participant limits match the problem definition.
- [ ] Both zero-subtotal modes block with their exact repair messages, including with positive fixed additions.
- [ ] Grand-total allocation floors exact entitlements, ranks discarded remainders, and breaks exact ties by visible participant order.
- [ ] All seven calculation invariants and result-staleness behavior are asserted rather than assumed.

For the last item, use the plan's notation `S,T,U,G,q_i,a_i,o_i,k,w_ij,q_ij` and require these seven IDs and exact predicates—no renaming, omission, merging, or subset assertion:

1. `INV-1`: `S ∈ ℤ`, `S > 0`, and `T,U,G,a_i,o_i ∈ ℤ` in configured smallest units; invalid precision/parsing or `S <= 0` yields no result.
2. `INV-2`: per group, included `w_ij ∈ ℤ` and `w_ij > 0`; excluded `w_ij = 0` and `q_ij = 0`; `Σ_i w_ij > 0`; `q_i = Σ_j q_ij`, `q_i >= 0`, and `Σ_i q_i = S` as exact rationals.
3. `INV-3`: `T >= 0`, `U >= 0`, and `G = S + T + U` in integer units.
4. `INV-4`: each `a_i ∈ ℤ`, `a_i >= 0`, and `Σ_i a_i = G`.
5. `INV-5`: `o_k = 0`; for `i != k`, `o_i = a_i`; `Σ_i o_i = G - a_k`.
6. `INV-6`: with `x_i=q_i×G/S`, `b_i=floor(x_i)`, `r_i=x_i-b_i`, and `R=G-Σ_i b_i`, require `0 <= R < n`, `a_i=b_i+δ_i`, `δ_i∈{0,1}`, exactly `R` deltas equal `1`, recipients are descending `r_i` then ascending visible order, and identical ordered input repeats identical results/recipients.
7. `INV-7`: exactly one payer exists, `min_i(a_i) >= 0`, and `min_i(o_i) >= 0`; negative/refund/multiple-payer inputs yield no result.

The executable assertion is one shared helper that requires the complete ordered `INV-1`–`INV-7` vector for every valid F1, F2, F3, F4-base, generated-matrix, and 100-repeat case. Invalid F4/generated cases must assert exact field repair plus no result and must not be counted as invariant-bearing results. Any invariant breach must produce `calculation_invariant_violation`, no partial/copyable/persisted result, and no bill-value logging.

### Storage, PWA, privacy, and accessibility

- [ ] Draft/prefs are local-only, versioned, schema-safe, and serialize integer values as strings; derived result is not persisted.
- [ ] Unknown/corrupt/quota errors preserve original bytes; start-over and all-data deletion have distinct confirmed scopes.
- [ ] Generated precache, manifest/icons, offline restart, prompt update, save-before-activation, and cache/data separation are testable.
- [ ] No product networking API or cross-origin runtime cache is needed; CSP and privacy canary checks acknowledge GitHub Pages hosting metadata and meta-CSP limits.
- [ ] Clipboard read is prohibited; copy/share requires an explicit gesture and exact plaintext preview/disclosure.
- [ ] WCAG 2.2 AA, keyboard/focus, screen readers, reflow/zoom, contrast, targets, reduced motion, and Unicode have automated plus manual evidence requirements.

Any FAIL in this section is blocking.

## 4. Strict vertical TDD audit

The plan must make “test first” observable, not aspirational.

- [ ] V00 is toolchain-only and cannot render product behavior.
- [ ] V01–V11 contain exactly the frozen 56-behavior inventory below, and V12/V13 add no product behavior.
- [ ] Every behavior has its own ID, exact command with a single anchored test selector, one feature-missing RED, minimal production boundary, and unique evidence path.
- [ ] The protocol records RED command, exit code, and relevant output before production behavior.
- [ ] A syntax/config/path/flaky failure is explicitly invalid RED; an unexpectedly passing test causes a stop.
- [ ] GREEN reruns the identical narrow command and then `npm run check` plus the slice browser command.
- [ ] Refactoring is allowed only after GREEN and repeats narrow/full checks.
- [ ] No command selects a whole file, two fixtures, or a disjunction of missing features; a broad failure does not authorize batch implementation.
- [ ] Test deletion, retroactive tests, skipped/waived tests, retries-as-green, snapshots without semantic assertions, and deferred failures are forbidden.
- [ ] V12 runs complete canonical journeys; V13 contains deployment/artifact/live verification only and adds no product behavior.

Required contiguous behavior inventory:

| Slice | IDs | Count | Blocking review focus |
|---|---|---:|---|
| V01 | B01–B03 | 3 | Shell, first quick split, payer/label/precision are separate. |
| V02 | B01–B07 | 7 | Dot, comma, lexical reject, over-precision, format, rational, Unicode each select one test. |
| V03 | B01–B05 | 5 | Count, name, order/payer, share validity, exclusion are separate. |
| V04 | B01–B06 | 6 | Fixed and percentage are separate; B03 only decomposes floors/remainders/`R` and cannot finalize; B04 alone adds complete largest-remainder reconciliation including the normative F2 visible-order tie; complete F3 and quick-zero remain separate. |
| V05 | B01–B04 | 4 | Item rows, item entitlement, complete F1, itemized-zero are separate. |
| V06 | B01–B03 | 3 | Stale invalidation, required result fields, reconciliation are separate. |
| V07 | B01–B04 | 4 | Text, explicit copy, Web Share fallback, Unicode/control handling are separate. |
| V08 | B01–B05 | 5 | Restore, write failure, incompatible bytes, start-over, delete-all are separate. |
| V09 | B01–B06 | 6 | Axe shell, keyboard, focus restore, announcement, reflow, targets/cues/motion are separate. |
| V10 | B01–B08 | 8 | Manifest, precache, offline reopen, reject update, failed-save block, accept/controller/reload, incompatible draft, cache cleanup are separate. |
| V11 | B01–B05 | 5 | Canary, build resources, permission/clipboard, CSP, safe text/URL/log are separate. |
| **Total** |  | **56** | Any missing, duplicate, composite, or unanchored packet is FAIL. |

For each row in the plan’s behavior table, verify the literal command selects only the literal behavior title, the expected failure names the absent feature rather than tooling, the minimal boundary cannot implement a sibling ID, and the evidence path equals `product/evidence/implementation/tdd/<ID>.json`. Verify the evidence schema includes both RED and subsequent GREEN/full/refactor results. V09 manual assistive-technology evidence remains a later slice gate and does not authorize skipping its six RED packets.

## 5. Deterministic fixture audit

The plan’s canonical section is normative. Confirm every ordered input and expected output is present:

| Fixture | Complete input identity | Required output |
|---|---|---|
| F1 | `USD`, precision 2, itemized; order Ana/Bo/Cy; payer Ana; Noodles 10.00 shares Ana1/Bo1/Cy excluded; Curry 11.00 Ana excluded/Bo1/Cy1; Tea 4.00 all1; tax 8%; fixed tip 2.54. | Subtotal 25.00, tax 2.00, tip 2.54, total 29.54; Ana 7.48, Bo 13.98, Cy 8.08 with +0.01; owed 22.06. |
| F2 | `JPY`, precision 0, quick; order Dee/Eli/Fox; payer Dee; subtotal 100; shares 1/1/1; no tax/tip. | Dee 34 with visible-order +1, Eli 33, Fox 33; owed 66. |
| F3 | `KWD`, precision 3, quick; order Gia/Han; payer Gia; subtotal 1.005; shares 1/1; tax 5%; fixed tip 0.010. | Raw tax 0.05025→0.050, total 1.065; Gia 0.533 with +0.001, Han 0.532. |
| F4 base | `USD`, precision 2, itemized; order Jo/Kai; payer Jo; Solo 9.99 with Jo1/Kai excluded; no additions. | Jo 9.99, Kai 0.00, total 9.99, owed 0.00. |
| F4-Q0/I0 | Complete quick/itemized replacement packets include positive fixed addition with zero subtotal. | Exact mode-specific frozen messages and no result. |
| F4 validation variants | W0/WNEG/WFRAC/WBLANK/WTEXT/PREC/TAXNEG/TIPNEG/ITEMNEG/NOINCLUDE/DUPNAME/BLANKNAME/NINE each state one exact ordered mutation. | Field binding, specified error code/human repair, no result; no silent coercion/rounding. |

FAIL if a participant order, payer, mode, item description/amount, share/exclusion, addition type/value, label, precision, expected intermediate, or F4 mutation is missing. In particular F3 must include its fixed `0.010` tip.

The generated matrix is executable only if it equals the plan's ordered union: `GM-C` 448 cases (224 positive valid, 224 zero invalid), `GM-X` 112 valid exclusion cases (`LAST` and `ALT`), and `GM-R` 112 valid remainder-class cases (`TIE` and `NON`), for exactly 672 total = 448 valid + 224 invalid. Require every ID to match its frozen dimension grammar and every family/count to match. `GM-R/TIE` must have `R=1`, at least two equal maximal discarded remainders, and the earliest visible maximum as recipient; `GM-R/NON` must have `R>0`, one unique maximum, and that participant as recipient. `GM-X` must prove excluded contribution/allocation zero while retaining an included participant in every group. Every valid case must record the ordered `INV-1`–`INV-7` PASS object; every invalid case must record exact field repair and no result. No skipped, deduplicated, relabeled, or predicate-mismatched generated case is allowed. F1, F2, F3, and F4 base are likewise valid and bound to all seven; F4 invalid variants are no-result validation cases.

Copied-text review is also byte-exact. The three normative UTF-8 blocks in the plan must each end with one LF, and `V07-B01` plus `V12` must assert the exact F1, F2, and F3 strings. For each fixture, parse the plaintext without app state and require its monetary label, precision, payer, every participant allocation and owed amount, grand total, total owed, and rounding recipient/reason to equal the canonical fixture. Preview, clipboard-write payload, and Web Share text must be identical; a test of F1 alone is a blocking FAIL.

## 6. Full acceptance trace

Each frozen problem criterion must have a planned automated or manual proof. `P` below refers to implementation-plan sections/slices.

### Calculation and result

| Criterion | Plan trace | Review requirement |
|---|---|---|
| AC-C01 F1–F4 | P V04, V05, V12; domain/e2e fixtures | Exact outputs/messages are asserted. |
| AC-C02 100 repeats | P domain deterministic suite | Same ordered inputs yield identical numeric result/recipients 100 times, and every valid repetition asserts `INV-1`–`INV-7`. |
| AC-C03 generated matrix | P deterministic unit specification | Exact `GM-C/GM-X/GM-R` IDs and 448/112/112 counts prove all dimensions including exclusion and tie/non-tie classes; all 448 valid cases record `INV-1`–`INV-7`, all 224 invalid cases record repair/no-result. |
| AC-C04 stale result | P state boundary, V06 | Every input action clears current-result revision. |
| AC-C05 visible details | P V06 | Subtotal, additions, total, payer, allocations, owed, reconciliation visible. |
| AC-C06 copied text | P V07-B01 and V12 | Exact F1/F2/F3 strings independently reconstruct label/precision, payer, every allocation/owed amount, grand total/total owed, and rounding recipient/reason; preview/copy/share payloads match. |

### Privacy and data handling

| Criterion | Plan trace | Review requirement |
|---|---|---|
| AC-P01 canary network | P privacy-canary suite, V11 | Requests/URLs/headers/bodies/logs inspected in three engines. |
| AC-P02 no remote trackers/code | P stack, CSP, build scan | Source and dist scan plus same-origin allowlist. |
| AC-P03 no permissions | P privacy/security, V11 | Account/contact/location/camera/clipboard-read/payment/notification absent. |
| AC-P04 explicit copy/share | P V07 | Exact preview, disclosure, explicit gesture, no read. |
| AC-P05 deletion scopes | P persistence, V08 | Cancel/confirm and exact keys/in-memory scope verified. |
| AC-P06 truthful privacy copy | P privacy/persistence | Hosting metadata, shared device, plaintext escape, storage loss disclosed. |

### Offline, persistence, installability

| Criterion | Plan trace | Review requirement |
|---|---|---|
| AC-O01 complete offline flow | P V10 offline suite | Create/edit/calculate/copy/clear/recreate offline after initial load. |
| AC-O02 offline restart | P V10 | Close/reopen under offline context with functional shell/draft. |
| AC-O03 same-profile persistence | P V08, V10 | Reload/browser/installed-app restart exact inputs/results. |
| AC-O04 update/corrupt safety | P update simulation | Reject/accept v1→v2 and preserve raw incompatible bytes. |
| AC-O05 installability | P manifest/icon/static tests and manual matrix | Chrome Android install and iOS A2HS before support claim. |
| AC-O06 truthful limitations | P persistence/PWA copy | Private/storage/unsupported limitations visible. |

### Accessibility and global use

| Criterion | Plan trace | Review requirement |
|---|---|---|
| AC-X01 WCAG 2.2 AA | P V09 | Axe all states plus complete manual audit; no automation-only claim. |
| AC-X02 keyboard/focus | P V09 | Full F1 including dynamic rows/dialog/copy. |
| AC-X03 screen readers | P manual matrix | VoiceOver/Safari and TalkBack/Chrome complete F1. |
| AC-X04 reflow/zoom | P V09 | 320 CSS px and 200% without loss or page 2D scroll. |
| AC-X05 contrast/cues | P V09 | Automated and manual states; no color/icon/position-only cue. |
| AC-X06 targets/motion | P V09 | 44×44 targets and reduced-motion journey. |
| AC-X07 Unicode safety | P V02, V07, V11 | Entry/storage/render/copy/delete plus markup canary. |
| AC-X08 decimal/no FX | P V02 | Separator/rejection tests and no conversion semantics. |

### Problem validation

| Criterion | Plan trace | Review requirement |
|---|---|---|
| AC-U01 4/5 in 3 minutes | Plan moderated protocol steps 1/timing | Five eligible coordinators, exact F1, fixed prompt, monotonic `<=180000ms`, unassisted rule, no rerun of user failure. |
| AC-U02 exact/comprehensible F1 | Plan step 2 | All five exact totals; 4/5 answer payer, Bo, Cy, and rounding correctly without teaching. |
| AC-U03 copied-text recipients | Plan step 3 | Five separate blinded recipients; 4/5 reconstruct payer, owed, total, rounding from text alone. |
| AC-U04 offline and no-backup understanding | Plan step 4 | Same five coordinators reopen after prior load with network disabled; all complete flow and explain no backup. |
| AC-U05 no falsification trigger | Plan step 5 and `falsification.json` | Every frozen criterion has evidence hash/outcome/rationale; any stop, miss, missing item, or inconclusive result fails. |

Verify the plan defines the exact participant/recipient roles, consent/no-PII boundary, source/plan/problem/dist identity, timer and assistance protocol, canonical fixture, coordinator/recipient evidence schemas, raw counts, record hashes, aggregate schema, executable `validate:moderated` command, and threshold evaluation. The implementation may automate templates/schema checking but must not count developers, synthetic agents, or test scripts as users.

The review must also confirm the launch stop is mechanical: overall and every U01–U05 value must be literal `PASS`, digest identity must match the same workflow build, and any `FAIL|INCONCLUSIVE|missing|drift` prevents `package_pages` and `deploy` from running. `problem_validated` remains false until this evidence passes.

## 7. Browser, PWA, and Pages audit

- [ ] Automated Playwright projects include Chromium, Firefox, WebKit, Pixel 7 emulation, and iPhone 13/WebKit emulation.
- [ ] Real current-stable Chrome Android and Safari iOS install/offline checks remain mandatory and record exact versions/date.
- [ ] Firefox desktop is tested for core flow but is not promised installability.
- [ ] Service-worker tests use production build/preview, confirm controller, force offline, close/reopen, and do not rely on Vite dev/HMR.
- [ ] Update tests cover user rejection, successful save before acceptance, controller change, one reload, unchanged draft, incompatible draft preservation, and obsolete static cache cleanup.
- [ ] Manifest includes required local icons and `/split-snap/` scope/start URL; every precache entry returns 200.
- [ ] Exactly one `pages.yml` defines `resolve_source → source_checks → build_once → verify_dist → validation → package_pages → deploy → live_verify`, with `live_verify` also needing `validation`, every arrow implemented by `needs`, and no cross-workflow/latest-success lookup.
- [ ] PR/push can run source checks/build-once/artifact verification but cannot instantiate package/deploy; explicit dispatch plus literal evidence PASS is required.
- [ ] `source_checks` cannot build; `build_once` invokes the build exactly once and emits a content-addressed immutable artifact with sorted file-hash manifest/tree digest; no later job may rebuild or implicitly build.
- [ ] `verify_dist` downloads that exact artifact and runs every static, Chromium/Firefox/WebKit/mobile, e2e, offline, installability, accessibility, privacy, and build-resource check against it, with matching pre/post tree digests and a complete receipt.
- [ ] Validation recomputes the same tested artifact and binds the verification receipt plus moderated evidence (release) or known-good receipt (rollback) to the same source/dist digest.
- [ ] Package downloads and uploads only those unchanged verified `dist/` bytes, records the same digest before/after Pages packaging, deploy uses minimum permissions/no secrets, and live verification uses the same sidecar/receipts.
- [ ] Launch requires live bytes to match the build tree, exact HTTP 200, browser-visible core UI/privacy allowlist/offline smoke on the deployed URL.
- [ ] Deployment evidence records source, tree manifest/digest, internal artifact, workflow/deployment, URL, UTC time, browser, HTTP, live bytes, UI, privacy, and offline outcomes.
- [ ] Known-good eligibility requires a prior unconditional live PASS receipt with source/lockfile/tree/schema/cache provenance; “previous” or “latest” is forbidden.
- [ ] Rollback is owner/incident-lead dispatched to an exact eligible SHA/digest and reruns the same full DAG; it never clears localStorage/service workers/caches manually.
- [ ] Schema/read compatibility and cache scope are proven before rollback; otherwise fix-forward is mandatory with test-first repair and applicable full human gate.
- [ ] Either recovery path reruns live byte/HTTP/UI/privacy/offline gates and produces a recovery receipt; a failed rollback cannot cascade to another guessed revision.

## 8. Security, dependency, and operations audit

- [ ] No secret or paid service is required; no external account beyond the authorized GitHub repository/Pages surface is introduced.
- [ ] Lockfile, deterministic install, full-SHA Actions pins, minimal permissions, dependency audit, and production-path advisory stop are specified.
- [ ] Failure artifacts contain fixtures only and use bounded retention.
- [ ] Dist excludes source maps, tests, documents, env files, and realistic PII; URLs and resources are same-origin under base.
- [ ] Meta CSP is not misrepresented as a response header and `connect-src 'none'` matches zero product networking.
- [ ] Host request metadata and browser storage limitations remain disclosed.
- [ ] No destructive operation, commit, push, Pages enablement, or deployment occurs in the plan-writing phase.

## 9. Stop/escalation audit

The plan must stop, not improvise, for digest drift, invalid RED, arithmetic ambiguity, scope expansion, storage/update data risk, privacy transmission, dependency advisory, claimed-browser failure, accessibility failure, moderated-evidence miss/inconclusive/drift, same-revision artifact mismatch, Pages/live failure, unsafe rollback compatibility, missing external authority/config, or flaky/skipped/waived tests.

Reject the plan if it permits any of these to become a follow-up after implementation or launch. Reject conditional language that silently lowers a frozen acceptance criterion.

## 10. Plan review verdict schema

Return exactly one unconditional verdict:

- **PASS** — the exact plan bundle is intact; every checklist item passes; the plan is coherent, sufficient, test-first, and fully traceable; no material ambiguity or premature claim remains.
- **FAIL** — cite each blocking plan section/check, show the contradiction or missing contract, and state the smallest plan-level correction. Do not issue conditional PASS.
- **STALE** — the three allowed files disagree on hashes, byte lengths, artifact set/order, digest, or embedded problem-authority attestation.

End the report with exactly `VERDICT: PASS`, `VERDICT: FAIL`, or `VERDICT: STALE`.

For strict serial reviews 2 and 3, runtime authority must supply the current serial position and unchanged candidate digest. The content reviewer does not open predecessor artifacts or workflow state and must not rely on prior reasoning/verdicts. External governance validates order and records each report after completion; this packet’s PASS/FAIL/STALE remains a fresh content judgment over the same three allowed files.

## 11. Freeze verification contract

`product/implementation-plan-freeze.json` contains only these two frozen artifacts, sorted lexicographically by path. Because ASCII `-` sorts before `.`, the required order is:

1. `product/implementation-plan-review-packet.md`
2. `product/implementation-plan.md`

For each artifact it records UTF-8 byte length and lowercase SHA-256. Reconstruct the exact manifest as:

```text
<implementation-plan-review-packet sha256>  product/implementation-plan-review-packet.md\n
<implementation-plan sha256>  product/implementation-plan.md\n
```

There are exactly two ASCII spaces between digest and path and one LF after each path, including the final line. SHA-256 of those UTF-8 manifest bytes is the plan bundle digest. The freeze JSON is excluded to avoid self-reference.

Reviewers must independently recompute file bytes, hashes, manifest order/bytes, and bundle digest before reading content. No review verdict may be transferred to a changed digest.
