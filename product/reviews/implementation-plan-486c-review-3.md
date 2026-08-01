# SplitSnap implementation-plan review 3

- Review identity: fresh independent reviewer 3 of 3
- Runtime terminal: `term_62b5f940-5c18-4d38-ae34-c6ea03342154`
- Reviewed at: `2026-08-01T08:36:40Z`
- Supplied candidate digest: `486c72e8e1fda59b2c461c800c5bed5e73e27b45c81f7a1a385c3997ab972456`
- Recomputed candidate digest: `486c72e8e1fda59b2c461c800c5bed5e73e27b45c81f7a1a385c3997ab972456`
- Allowed inputs only: `product/implementation-plan.md`, `product/implementation-plan-review-packet.md`, `product/implementation-plan-freeze.json`

## Integrity and prerequisite evidence

PASS. Independent byte and SHA-256 recomputation produced:

| Manifest order | Artifact | Bytes | SHA-256 |
|---:|---|---:|---|
| 1 | `product/implementation-plan-review-packet.md` | 29294 | `7697679486cd2c361d23662536cd2b0957f57e24835584eac6b700904dfebeb6` |
| 2 | `product/implementation-plan.md` | 73639 | `d04c6132e64290fce5c2f8c92700644ae586d1fb14c1950fd3167a9cd3a73306` |

The bytewise-ASCII path order is review packet first (`-` before `.`). The exact 208-byte manifest used two ASCII spaces between each hash and path and one LF after each line, including the final line. Its SHA-256 is the recomputed candidate digest above. The freeze has exactly those two Markdown artifacts in that order and excludes itself.

The embedded prerequisite JSON is schema version 1, contains three ordered distinct problem reviews 1–3 with `PASS`, binds every review to the same problem digest, and states the required drafting-boundary booleans. Reconstructing its two-record problem manifest yields `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`, equal to the attestation, freeze authority, and plan header. The candidate is therefore not stale.

## Complete adversarial review

FAIL. One blocking release-integrity/scope-correctness defect remains.

### Blocking defect — exclusions are expanded into quick mode

Criteria failed:

- Review packet section 1: no hidden product scope.
- Review packet section 3, Scope and stack: implement the frozen product scope without expansion.
- Review packet section 3, Domain determinism: quick/itemized formulae and exclusions must match the stated product boundary.
- Review packet sections 4–5: the behavior inventory and generated matrix must be executable without authorizing an out-of-scope sibling behavior.

Evidence:

- Plan section 1 defines the capability as **per-item exclusions**, not participant exclusion from a quick-total bill.
- Plan section 3 defines quick entitlement from each participant's positive `personWeight`, while itemized entitlement is the formula that explicitly assigns zero to an excluded person for an item.
- Nevertheless, `V03-B05` introduces a generic `included` flag and zero entitlement before the itemized slice, with no per-item boundary.
- More decisively, the `GM-X` contract spans `M={Q,I}` and requires `LAST`/`ALT` participants to have zero contribution and zero final allocation in **both modes**. In quick mode there is only the whole-bill allocation group, so this necessarily specifies participant exclusion from the entire quick bill. That is additional product behavior, not merely an itemized exclusion test.

Impact: an implementation conforming to the frozen plan can expose or encode a quick-mode exclusion state that is absent from the plan's own V1 boundary. It also makes the quick positive-integer-share contract ambiguous: excluded quick participants must either receive a zero weight contrary to the ordinary quick-share rule or gain a new exclusion control. This can change who owes money and therefore is material calculation/scope correctness and release integrity, not bookkeeping.

Smallest plan-level correction: bind `V03-B05` explicitly to per-item inclusion and remove quick mode from `GM-X` (then recompute the family/valid/total counts and all dependent packet text), or explicitly obtain and freeze authority for quick-mode exclusions and specify their UI/domain semantics. Either correction changes both Markdown artifacts and requires a new freeze digest; no candidate edit was made in this review.

All other packet areas were reviewed and produced no additional blocking defect: arithmetic/invariants and canonical fixtures; strict RED/GREEN packets; copied-text contracts; persistence/deletion/update safety; privacy/CSP/permissions; automated and manual accessibility; moderated AC-U01–U05 evidence and mechanical launch stop; immutable build/verify/package/live-byte DAG; dependency/operations controls; and known-good rollback/fix-forward stops.

VERDICT: FAIL
