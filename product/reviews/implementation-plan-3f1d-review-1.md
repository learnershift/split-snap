# SplitSnap implementation-plan strict serial review 1

- Reviewer role: fresh independent reviewer 1
- Terminal: `term_84efa753-91e6-49a7-ab2a-a05e0a3a83be`
- Review completed (UTC): `2026-08-01T04:49:49Z`
- Candidate digest expected: `3f1dc33aa6b9b294dd069a756a13f0a67cd4ac871e9cd79824f70421a7a679ad`
- Candidate digest before review: `3f1dc33aa6b9b294dd069a756a13f0a67cd4ac871e9cd79824f70421a7a679ad`
- Candidate digest after review: `3f1dc33aa6b9b294dd069a756a13f0a67cd4ac871e9cd79824f70421a7a679ad`
- Verdict scope: exact frozen plan bundle only; no prior review artifact or workflow state was read or relied upon.

## Integrity evidence

| Check | Recomputed evidence | Result |
|---|---|---|
| `product/implementation-plan-review-packet.md` | 17,225 UTF-8 bytes; SHA-256 `ef0f9b7e7b7460f730f108fe3a5b8965f09c556834f25635f9d475e44d6a1c69` | PASS |
| `product/implementation-plan.md` | 32,941 UTF-8 bytes; SHA-256 `6557c06bde431505196d02a9569bf3e458c6a68cbc18eb8e1701577ce9bc5f8b` | PASS |
| Manifest construction | ASCII bytewise path order: review packet, then plan; two ASCII spaces; LF after both lines including final line | PASS |
| Manifest SHA-256 | `3f1dc33aa6b9b294dd069a756a13f0a67cd4ac871e9cd79824f70421a7a679ad` | PASS |
| Freeze comparison | Both artifact byte counts/hashes and bundle digest equal `product/implementation-plan-freeze.json` | PASS |
| Frozen problem definition | 20,914 UTF-8 bytes; SHA-256 `c177db044dfe0ccdbd6275a97a2f0f3f75c459fa5924e9678c8a4aedee5c6670`, equal to `product/problem-freeze.json` | PASS |
| Problem authority binding | Reconstructed manifest using the recomputed problem-definition hash and the freeze-recorded excluded problem-review-packet hash gives `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`; this equals both freezes and plan header | PASS for the permitted trace; the excluded packet bytes were not independently read or hashed |

The plan candidate is byte-intact, so this is a content `FAIL`, not `STALE`.

## Criteria audit

### Prerequisite integrity

| Criterion | Evidence | Result |
|---|---|---|
| Frozen plan byte/hash/digest | Freeze contract and recomputation above; review packet lines 225–241 | PASS |
| Problem authority trace | Plan lines 5, 12–18; problem definition lines 90–172; problem freeze lines 6–22 | PASS within the expressly permitted inputs |
| Three problem PASS ledgers | Review packet lines 28–29 demand inspection, while lines 15–20 limit review inputs and this review's authority expressly forbids review artifacts | FAIL |
| Workflow state and workflow candidate digest | Review packet lines 30 and 33 demand `workflow-state.json`, while lines 15–20 omit it and this review's authority expressly forbids it | FAIL |
| Absence of production/deployment files | Review packet line 31 requires repository-wide state evidence that cannot be obtained from the five permitted inputs | FAIL |

### Architecture, domain, storage, privacy, accessibility

| Checklist item | Evidence | Result |
|---|---|---|
| Proportionate static React/TypeScript/Vite stack | Plan lines 20–39 | PASS |
| Runtime-only React/React DOM; enumerated build/test tools; lockfile | Plan lines 26–33 | PASS |
| No backend/API/account/payment/FX/OCR/analytics/remote executable/secret/paid service/database | Plan lines 12–18, 153–159 | PASS |
| Dependency review, `npm ci`, full-SHA Actions | Plan lines 31–33, 277–285 | PASS |
| Consistent `/split-snap/` base/scope/start/artifact/live path | Plan lines 43–45, 145–151, 243–256, 287–316 | PASS |
| Direct text-to-`bigint` monetary parsing | Plan lines 117–130 | PASS |
| Precision/separator/error/label/name/Unicode rules | Plan lines 119–122, 130, 227–241 | PASS |
| Exact rational percentages and half-up addition rounding | Plan lines 122–127, 227–233 | PASS |
| Quick/itemized formulae, exclusions, integer weights, 2–8 people | Plan lines 10, 124–127, 207–211 | PASS |
| Exact zero-subtotal messages, including positive fixed addition | Plan lines 126, 210–211, 225–233 | PASS |
| Largest remainder and visible-order tie | Plan lines 127–128, 210–211, 225–233 | PASS |
| Seven invariants and immediate result invalidation | Plan lines 111–128, 212, 235–240; problem definition lines 108–116 | PASS |
| Versioned local-only draft/preferences; integers as strings; no persisted result | Plan lines 132–141 | PASS |
| Corrupt/unknown/quota preservation and distinct confirmed deletion scopes | Plan lines 138–141, 214, 235–240 | PASS |
| Generated precache/install/offline/update/save-before-activation/cache separation | Plan lines 143–151, 216, 250–256 | PASS |
| Zero product networking, same-origin caching, CSP/hosting limits | Plan lines 153–159, 265–271 | PASS |
| Explicit write-only copy/share with exact preview/disclosure | Plan lines 157–158, 213, 265–269 | PASS |
| WCAG 2.2 AA automated and manual evidence | Plan lines 215, 258–263, 333 | PASS |

### Strict vertical RED-GREEN-REFACTOR TDD

| Checklist item | Evidence | Result |
|---|---|---|
| V00 toolchain-only | Plan lines 190 and 204–206 | PASS |
| One smallest behavior per RED before production behavior | Plan lines 192–200 state the rule, but V04's exact first command jointly selects “matches F2 and F3” and its GREEN boundary also includes the separate zero-subtotal behavior (line 210); V02/V03 similarly use whole multi-behavior test files (lines 208–209) | FAIL |
| Exact narrow RED command, missing-feature failure, minimal GREEN, and slice gate for every behavior | The slice table gives one row-level command and a disjunctive family of possible failures, not a behavior-level command/evidence mapping for each behavior listed in a row (lines 204–219) | FAIL |
| RED command/exit/output recorded before production behavior | Plan lines 192–194 | PASS |
| Invalid RED and unexpectedly passing test stop | Plan lines 193–194, 343–345 | PASS |
| Identical GREEN command, full check, then slice browser gate | Plan lines 195–198 | PASS |
| Refactor only after GREEN with all reruns | Plan line 198 | PASS |
| Additional behavior repeats the loop | Plan line 221 states the rule, but does not resolve the composite first commands and broad GREEN boundaries above | FAIL |
| No retroactive/deleted/waived/skipped/retry-only/snapshot-only/deferred tests | Plan lines 200, 248, 355 | PASS |
| V12 full journeys; V13 deployment-only | Plan lines 218–219 | PASS |

Slice-family trace: V01, V05–V09, V11–V13 have the required behavior families and gates. V02–V04 are not execution-unambiguous at the per-behavior RED boundary. V10 contains the required install/offline ordering, but its update-rejection, save failure, controller-change, one-reload, incompatible-draft, and obsolete-cache behaviors are not assigned individual narrow RED commands (lines 216 and 250–256).

### Deterministic fixtures and exact arithmetic

| Criterion | Independent check | Result |
|---|---|---|
| F1 stated output | `7.48 + 13.98 + 8.08 = 29.54`; if Ana is payer, `13.98 + 8.08 = 22.06` | PASS for stated output arithmetic |
| F2 stated output | `34 + 33 + 33 = 100`; if Dee is payer, owed is `33 + 33 = 66`; visible-order tie output is coherent | PASS for stated output arithmetic |
| F3 stated output | Exact `1.005 × 5 / 100 = 0.05025`, nearest `0.001` is `0.050`; `0.533 + 0.532 = 1.065` | PASS for stated operations, but input packet is incomplete |
| F4 exact repair strings | Plan lines 126, 210–211 and packet lines 112–113 match problem definition line 100 | PASS |
| Complete deterministic fixture definition | The plan and review packet state only required outputs (plan lines 210–211, 227; packet lines 103–115). They do not specify the ordered participant/payer/item/share/addition inputs needed to reproduce F1–F3. F3's stated subtotal plus tax totals `1.055`, while allocations total `1.065`, proving that at least one additional input is unstated in the permitted execution bundle | FAIL |
| Generated matrix dimensions, fixed order/seed, invariants, exact invalid repair, reported case count | Plan lines 227–233 plus normative packet line 115 | PASS |
| Same ordered input repeated 100 times | Normative packet lines 123–130, especially AC-C02 | PASS |

### Acceptance trace

| Acceptance family | Evidence | Result |
|---|---|---|
| AC-C01 F1–F4 | Outputs/messages are traced, but exact input fixtures are absent as described above | FAIL |
| AC-C02–C06 determinism, matrix, staleness, visible result, copied reconstruction | Packet lines 123–130; plan lines 111–128, 212–213, 225–240, 320–337 | PASS |
| AC-P01–P06 privacy/data handling | Packet lines 132–141; plan lines 132–159, 213–217, 265–271, 329–331 | PASS |
| AC-O01–O06 offline/persistence/installability | Packet lines 143–152; plan lines 132–151, 214–216, 250–256, 330–332 | PASS |
| AC-X01–X08 accessibility/global use | Packet lines 154–165; plan lines 208, 213, 215, 241, 258–263, 333 | PASS |
| AC-U01–U05 problem validation | Packet lines 167–177 merely label these “Post-build moderated gate”/“Final evidence synthesis.” The plan has no ordered execution packet, evidence schema, participant/recipient roles, exact frozen input fixture, timer/assistance protocol, or explicit pre-launch decision gate for these human tests | FAIL |

### Browser, PWA, Pages, supply chain, and operations

| Checklist item | Evidence | Result |
|---|---|---|
| Chromium/Firefox/WebKit/Pixel 7/iPhone 13 projects | Plan lines 243–248 | PASS |
| Real Chrome Android and Safari iOS install/offline evidence; Firefox scope truthful | Plan lines 250–256 | PASS |
| Production-preview service-worker control/offline close/reopen | Plan lines 250–256 | PASS |
| Update reject/save/accept/controller/reload/draft/cache coverage | Required outcomes appear across plan lines 143–151, 216, 250–256, but behavior-level RED packets are missing as noted above | FAIL |
| Manifest/icons/precache 200 and `/split-snap/` scope | Plan lines 145–151, 255–256, 291–296 | PASS |
| Pages uploads checked `dist/`, minimum permissions, no secrets | Plan lines 287–296 | PASS |
| Pages deployment is mechanically gated on same-revision CI | Plan line 289 asserts that a separately push-triggered `pages.yml` runs “only after” CI, but defines no `needs`, reusable-workflow, `workflow_run` head-SHA/conclusion check, or equivalent race-free gate | FAIL |
| Live HTTP 200 plus browser-visible core/offline smoke and evidence record | Plan lines 298–316 | PASS |
| Lockfile, deterministic install, full-SHA Actions, audit/advisory stop | Plan lines 31–33, 271, 277–285, 350 | PASS |
| Bounded fixture-only failure artifacts | Plan line 285 | PASS |
| Dist excludes maps/tests/docs/env/PII and cross-origin resources | Plan lines 265–270, 291–296 | PASS |
| Meta CSP accurately bounded; hosting/storage limits disclosed | Plan lines 141, 151, 155–159 | PASS |
| No plan-phase destructive operation/deployment claim | Plan lines 3, 12–18, 359–361 | PASS |
| Safe rollback after a bad Pages deployment/update | Update rejection before activation is covered, but there is no deployed-version rollback or safe fix-forward procedure, previous-known-good revision/artifact rule, post-rollback live gate, or localStorage/service-worker compatibility constraint. The stop rule at lines 353–357 leaves an already deployed bad revision without an operational recovery packet | FAIL |

### Stop and escalation

The explicit stops for digest drift, invalid RED, arithmetic ambiguity, scope expansion, storage/update loss, privacy transmission, production-path advisory, browser/accessibility failure, Pages/live failure, missing authority/config, and flaky/skipped/waived tests are present at plan lines 339–357. Those stop statements PASS. They do not cure the missing review-authority contract, per-behavior RED packet, human-validation packet, race-free Pages gate, or rollback packet.

## Blocking findings and minimum corrections

1. **Review prerequisite contract is internally unexecutable.** The normative packet requires evidence from problem review ledgers, workflow state, and repository state while its own review-input boundary omits those sources; this review was also expressly prohibited from reading them. Smallest correction: freeze a new packet whose allowed-input list explicitly includes each prerequisite source as read-only, or replace those checks with content-addressed attestations contained in the permitted frozen bundle.
2. **Strict vertical TDD is not unambiguous per behavior.** Composite row-level RED commands and broad GREEN boundaries allow multiple missing behaviors to fail together, contrary to the one-smallest-behavior rule. Smallest correction: enumerate a behavior ID, exact single-test command/name, required missing-feature failure, minimal production boundary, and evidence filename for every behavior in V01–V11, especially V02–V04 and every update behavior in V10.
3. **F1–F3 are outputs without complete inputs.** Exact arithmetic outputs alone cannot be independently reproduced or used for canonical e2e journeys; F3 visibly requires an unstated additional `0.010` input. Smallest correction: place the full ordered participant, payer, mode, item/subtotal, share/exclusion, tax, tip, label, and precision inputs for F1–F4 in the frozen plan bundle and bind every test command to them.
4. **Problem-validation execution is only a trace label.** AC-U01–U05 lack an executable, ordered, evidence-producing gate before validation/launch claims. Smallest correction: add a post-build moderated-test packet with the frozen fixture, five target-user protocol, recipient test protocol, timer/assistance rules, exact evidence fields, thresholds/falsification evaluation, and explicit launch stop.
5. **Pages same-revision gating is asserted but not mechanically defined.** Independent push workflows can race. Smallest correction: specify one race-free mechanism, such as test/build/deploy jobs in one workflow linked by `needs`, or a `workflow_run` gate that verifies successful conclusion and exact `head_sha`, then test the deployed artifact from that revision.
6. **Safe deployed rollback is absent.** A failed post-deploy smoke only stops the claim; it does not restore service. Smallest correction: define authorized rollback/fix-forward selection, known-good revision/artifact provenance, schema/cache compatibility, non-destruction of local data, redeploy commands/workflow, and the same HTTP/UI/offline verification after recovery.

## Unconditional verdict

The frozen bytes and digest are correct, and most architecture, arithmetic model, privacy, offline, accessibility, dependency, and live-verification requirements are strong. The six findings above are material omissions or contradictions in reviewability and execution enforceability. Under the packet's rule that any material omission fails and conditional PASS is forbidden, this candidate does not pass the implementation-plan gate.

VERDICT: FAIL
