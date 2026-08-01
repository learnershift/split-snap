# SplitSnap problem review packet

Packet status: **ready for independent problem-definition review**  
Packet date: 2026-08-01  
Normative artifact: `product/problem-definition.md`  
Freeze record: `product/problem-freeze.json`

## 1. Review question

Does the frozen problem definition identify a real, bounded user problem and a falsifiable V1 contract strongly enough to permit later solution planning—without treating competitor marketing, owner intent, or untested assumptions as user validation?

This review does **not** authorize production code, an implementation plan, deployment, publication, payment features, analytics, or scope expansion.

## 2. Owner intent and constraint trace

| Owner input | Frozen interpretation |
|---|---|
| Polished global-market PWA, launch intent today | Mobile-first, installable, globally accessible English V1; quality requirements are explicit. “Today” does not waive evidence or acceptance gates. |
| Privacy-first and offline | Bill data stays on device; no accounts/backend/trackers; full core flow works after first successful load. Hosting metadata and storage-loss limits are disclosed. |
| Travelers and friends | Primary user is the coordinator of a temporary 2–8-person bill; long-term household and business accounting are excluded. |
| Arbitrary currency label | User supplies a 1–12-character label and 0–3 decimal precision; no validation, FX, or mixed-currency arithmetic. |
| Tax and tip | Each is optional and fixed or percentage-based; rounded amounts are visible and allocated by weighted pre-tax entitlement. Calculation requires a pre-tax subtotal greater than zero in both entry modes. |
| Unequal item/person shares | Positive integer weights work per item or on a quick-total bill. |
| Rounding reconciliation | Largest-remainder method with participant-order tie-break; all smallest units reconcile and recipients are identified. |
| Shareable text | Explicit copy/share creates a self-contained plaintext result; no live link or synchronization. |
| Installable mobile UI | Install metadata, standalone-capable experience where supported, responsive layout, and explicit accessibility targets. |
| No accounts/backend/payment | All are normative non-goals; there is one payer but no transfer or settlement tracking. |
| Problem before planning | The artifact ends at the problem/V1 acceptance contract and contains no production implementation plan. |

## 3. Evidence ledger

The reviewer should open each link and confirm only the bounded claim below. Vendor statements are evidence of category positioning, not independent proof of demand or quality.

| Evidence | Source type | Bounded claim to verify | Strength / limitation |
|---|---|---|---|
| Splitwise product page | Competitor primary source | Group trips and equal/unequal/%/share splits are marketed use cases/features. | Direct feature evidence; self-interested and no preference evidence for SplitSnap. |
| Splitwise currency help | Competitor primary source | Groups can contain currencies and conversion is a distinct feature. | Supports explicit no-FX boundary; not evidence that arbitrary labels suffice. |
| Tricount product page and FAQ | Competitor primary source | Travel bills, offline operation, multiple currencies, and custom splits are marketed; 21M is vendor-claimed. | Category signal only; user count is not independently verified. |
| GDPR Article 5(1)(c) | Primary legal text | Data minimisation is an official principle. | Supports minimization; not a legal opinion or global compliance finding. |
| MDN PWA guides | Maintained technical reference | Offline behavior is possible and install experience varies by environment. | Feasibility/context only; finished behavior still requires device tests. |
| WCAG 2.2 | Normative web standard | Level A/AA criteria define the accessibility target. | Strong requirements source; conformance exists only after complete audit. |

URLs and access date are recorded in the normative definition. No conclusion depends on paid access, personal data, a private account, or a market-size estimate.

## 4. Evidence-to-claim audit

Mark each item PASS or FAIL. Any FAIL keeps the problem gate closed.

- [ ] E1–E5 are observable at the cited official/primary URLs.
- [ ] Vendor-reported usage is labeled as a claim and is not presented as independently verified.
- [ ] The document never claims proven preference for offline, local-only, manual, single-device use.
- [ ] A1–A7 are explicit assumptions with tests and failure signals.
- [ ] “Global” is narrowed to a globally accessible English V1, Unicode input, arbitrary label/precision, and no FX/localization claim.
- [ ] GDPR is used as a design principle, not as a blanket compliance declaration.
- [ ] PWA feasibility is not mistaken for tested offline/install behavior.
- [ ] WCAG 2.2 AA is a future acceptance target, not a premature conformance claim.

## 5. Canonical acceptance fixtures

These fixtures are normative examples for calculation acceptance. They do not prescribe code or architecture.

### F1 — item shares, tax, tip, and rounding

Settings: label `USD`, precision `2`, payer `Ana`; participant order `Ana`, `Bo`, `Cy`.

| Item | Amount | Shares |
|---|---:|---|
| Noodles | 10.00 | Ana 1, Bo 1 |
| Curry | 11.00 | Bo 1, Cy 1 |
| Tea | 4.00 | Ana 1, Bo 1, Cy 1 |

Tax: 8% of 25.00 = 2.00.  
Tip: fixed 2.54.  
Grand total: 29.54.

Exact pre-tax entitlements:

- Ana: `5 + 4/3 = 6.333333…`
- Bo: `5 + 5.5 + 4/3 = 11.833333…`
- Cy: `5.5 + 4/3 = 6.833333…`

Tax and tip follow those proportions, so total exact entitlements are the same proportions of 29.54. At cent precision the floors are Ana 7.48, Bo 13.98, Cy 8.07, leaving one cent. Cy has the largest discarded fractional remainder and receives it.

Expected allocation:

- Ana: 7.48 (payer’s own share)
- Bo: 13.98 owed to Ana
- Cy: 8.08 owed to Ana, including +0.01 reconciliation
- Sum: 29.54 exactly
- Amount owed to payer: 22.06 exactly

The result and copied text must identify Cy’s +0.01 rounding adjustment.

### F2 — quick total and deterministic tie

Settings: label `JPY`, precision `0`, payer `Dee`; participant order `Dee`, `Eli`, `Fox`; quick pre-tax total 100; no tax/tip; shares 1:1:1.

Expected allocation:

- Dee: 34, including +1 reconciliation due to participant-order tie-break
- Eli: 33
- Fox: 33
- Sum: 100 exactly
- Amount owed to payer: 66 exactly

### F3 — three-decimal label and percentage rounding

Settings: label `KWD`, precision `3`, payer `Gia`; participant order `Gia`, `Han`; quick pre-tax total 1.005; shares 1:1; tax 5%; tip fixed 0.010.

- Raw tax 0.05025 rounds to 0.050 at configured precision and is displayed as such.
- Grand total: 1.065.
- Exact equal entitlement is 0.5325 each; one remaining smallest unit goes to Gia by participant-order tie-break.

Expected allocation:

- Gia: 0.533, including +0.001 reconciliation
- Han: 0.532 owed to Gia
- Sum: 1.065 exactly

### F4 — validation and exclusion

For a 2-person item of 9.99 assigned only to Jo with share 1:

- Jo receives 9.99 and Kai receives 0.00 for that item.
- Zero, negative, fractional, blank, or malformed share weights are rejected rather than coerced.
- An amount with more digits than configured precision is rejected with a repair message; it is not silently rounded.
- Quick-total pre-tax amount 0.00 blocks calculation with the field-specific repair message “Enter a pre-tax total greater than 0.” This remains blocked when fixed tax or tip is positive.
- An itemized bill whose item amounts sum to pre-tax subtotal 0.00 blocks calculation at the item list/subtotal with “Add or update items so the pre-tax subtotal is greater than 0.” This remains blocked when fixed tax or tip is positive.
- A fixed negative tax/tip, negative item, grand total below zero, no included participant, duplicate/blank participant name, or more than eight participants blocks calculation with a field-specific error.

## 6. End-to-end acceptance checklist

Each criterion is binary. “Looks correct” is not sufficient evidence.

### Core calculation

- [ ] AC-C01: F1–F4 produce exactly the expected values and validation outcomes.
- [ ] AC-C02: Repeating an unchanged fixture 100 times produces byte-identical numeric results and rounding recipients.
- [ ] AC-C03: For a generated matrix covering precision 0–3, 2–8 people, quick/itemized modes, equal/unequal weights, fixed/percentage additions, tie/non-tie remainders, and positive/zero pre-tax subtotals, every positive-subtotal result satisfies all seven normative invariants and every zero-subtotal case is blocked with its mode-specific F4 repair message, including when fixed tax or tip is positive.
- [ ] AC-C04: Editing any input invalidates the old result until recalculation; the UI never presents stale obligations as current.
- [ ] AC-C05: The visible result exposes subtotal, rounded tax, rounded tip, grand total, allocation per person, payer, owed amounts, and rounding recipients.
- [ ] AC-C06: Copied text for F1–F3 contains label/precision, payer, totals, per-person allocation/owed status, and reconciliation note and can be reconciled without the app.

### Privacy and data handling

- [ ] AC-P01: With a distinctive canary name and amount, network inspection during create/edit/calculate/reload/offline/copy/clear finds neither value in requests, URLs, headers controlled by the app, logs, or third-party calls.
- [ ] AC-P02: The production document and worker graph loads no analytics, ads, trackers, remote fonts, or third-party-hosted executable code.
- [ ] AC-P03: First use requests none of account, contact, location, camera, clipboard-read, payment, notification, or stable cross-site identifier permissions.
- [ ] AC-P04: Copy/share occurs only after an explicit gesture, displays the exact text and disclosure, and no clipboard read occurs.
- [ ] AC-P05: “Start over” and “Delete all local data” have distinct confirmations and verified scopes; cancel preserves data and confirm removes the promised scope.
- [ ] AC-P06: Privacy copy accurately distinguishes local bill data from ordinary static-host request metadata and warns about shared-device and plaintext-sharing exposure.

### Offline, persistence, and installation

- [ ] AC-O01: On each declared supported browser, after one successful online load, F1 can be created, edited, calculated, copied, cleared, and recreated with the network disabled.
- [ ] AC-O02: With the network disabled, closing and reopening the browser/installed app returns to a functional core flow with the valid draft intact.
- [ ] AC-O03: Reload, browser restart, and installed-app restart preserve F1’s exact inputs and derived result in the same profile.
- [ ] AC-O04: Simulated update activation preserves the draft; simulated incompatible/corrupt data yields a non-destructive error and retains the original bytes until explicit deletion.
- [ ] AC-O05: Automated manifest/installability inspection has no errors, and manual installation opens a standalone-capable experience on at least current stable Chrome/Android and Safari/iOS Add to Home Screen before those environments are claimed supported.
- [ ] AC-O06: Unsupported/private/storage-constrained cases receive truthful limitations; the app never claims guaranteed persistence or universal install support.

### Accessibility and global use

- [ ] AC-X01: A complete WCAG 2.2 AA audit of the core flow has no open failures.
- [ ] AC-X02: Keyboard-only operation completes F1, including row changes, confirmations, calculation, result review, and copy, without a focus trap or hidden focus.
- [ ] AC-X03: Screen-reader checks on VoiceOver/Safari and TalkBack/Chrome expose meaningful labels, groups, share values, errors, changed results, and reconciliation announcements.
- [ ] AC-X04: At 320 CSS-pixel width and 200% text zoom, F1 has no lost content/function and no two-dimensional page scroll.
- [ ] AC-X05: Automated contrast checks and manual state review pass for text, controls, focus, errors, disabled state, and selection; color/icon/position is never the only cue.
- [ ] AC-X06: All interactive targets are at least 44 × 44 CSS pixels or have an equally operable target meeting that size; reduced-motion mode completes the same tasks.
- [ ] AC-X07: Unicode participant names and labels survive entry, persistence, rendering, copy, and deletion without corruption or unsafe markup interpretation.
- [ ] AC-X08: Decimal behavior is documented and consistent; malformed or over-precision input is rejected explicitly and no currency conversion is suggested.

### Usability and problem validation

- [ ] AC-U01: At least 4/5 target users complete F1 unassisted within 3 minutes.
- [ ] AC-U02: All 5 produce the exact F1 total; at least 4/5 identify payer, owed amounts, and Cy’s adjustment.
- [ ] AC-U03: At least 4/5 recipient participants reconstruct obligations correctly from copied text alone.
- [ ] AC-U04: All 5 complete the core flow offline after initial load and understand that local data has no backup.
- [ ] AC-U05: No falsification/stop criterion in the normative definition is triggered.

## 7. Risk and non-goal audit

The reviewer must reject the packet if any answer is “yes” without an explicit owner-approved change to the frozen definition.

- Does V1 require or imply account creation, backend storage, live share links, synchronization, or payment?
- Does “currency” imply exchange rates, conversion, mixed-currency totals, or semantic validation?
- Does the product claim anonymity while omitting host request metadata or explicit sharing?
- Does local persistence imply backup or protection from browser eviction/device loss?
- Does any feature require receipt images, OCR, analytics, remote code/fonts, or nonessential permissions?
- Does “global” imply translated UI, locale-complete formatting, or legal compliance in every market?
- Does a test pass substitute for direct evidence that users prefer the proposed trade-offs?
- Does this packet contain an implementation sequence, architecture choice, production code, or launch authorization?

## 8. Review verdict schema

Return exactly one verdict with evidence:

- **PASS** — all evidence-to-claim checks pass; scope is internally coherent; fixtures and acceptance criteria are deterministic and testable; no critical ambiguity remains.
- **FAIL** — cite each blocking section/criterion, explain the contradiction or unverifiable claim, and state the smallest definition-level correction needed.
- **STALE** — the reviewed files do not match `product/problem-freeze.json`, the digest cannot be reproduced, or evidence URLs materially changed after the recorded access date.

A PASS means only “ready for later solution planning.” It does not mean the problem is user-validated, the app is implemented, or launch is approved.

## 9. Freeze verification contract

`product/problem-freeze.json` records SHA-256 and byte length for both Markdown artifacts. It also records one bundle digest computed from the exact UTF-8 bytes of these two newline-terminated manifest lines, sorted by path:

```text
<problem-definition sha256>  product/problem-definition.md\n
<problem-review-packet sha256>  product/problem-review-packet.md\n
```

Reviewers must recompute both file hashes, reconstruct those manifest bytes exactly, recompute the bundle digest, and compare all values. The freeze JSON itself is not included in the digest, avoiding a self-referential hash.
