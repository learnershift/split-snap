# SplitSnap product/problem definition

Status: **problem defined for review; solution and launch are not yet authorized by this document**  
Document date: 2026-08-01  
Market intent: global, mobile-first PWA

## 1. Problem first

### Problem statement

Small groups sharing one bill often need to decide, before they disperse, exactly how much each person owes when participation is not equal and the bill includes tax, tip, or indivisible minor units. Existing mental math, calculator, note, and chat workflows make the arithmetic and the reason for each amount hard to verify. Requiring an account, a network connection, or shared financial data can add disproportionate friction for a short-lived task.

The problem is therefore not “people need another expense tracker.” It is:

> A temporary group’s coordinator needs a fast, inspectable way to turn one real bill into exact per-person obligations and a plain-language record, under unreliable connectivity and without requiring participants to register or send bill data to a service.

This is a provisional problem definition. The existence of a mature expense-splitting category is evidenced; preference for SplitSnap’s particular privacy and single-device trade-off is still an assumption.

### Target user

Primary user:

- The temporary **bill coordinator** in a group of 2–8 travelers, diners, or friends.
- Uses a phone at the table, in transit, or immediately after a shared purchase.
- Has the receipt or total and is willing to enter it manually.
- Needs a result that absent participants can understand from copied text.
- May have weak or no connectivity and may not want to create an account for a one-off task.

Secondary users are the other participants who read the coordinator’s screen or receive the copied result. They do not operate a synchronized copy of the bill in V1.

Not the V1 target: long-running households, accountants, businesses needing audit records, groups requiring simultaneous multi-device editing, or anyone seeking money transfer, debt collection, receipt scanning, budgeting, or foreign-exchange conversion.

### Job to be done

> When our group shares a bill but people consumed different things or should carry different shares, help me allocate the complete charge—including tax, tip, and unavoidable rounding—so that the amounts add up exactly and I can show or send a comprehensible result before we separate, even if the network is unavailable, without making anyone create an account.

Functional jobs:

1. Represent the participants, monetary label/precision, payer, items or quick total, and each person’s relative share.
2. Reconcile every smallest unit deterministically so per-person obligations equal the entered grand total.
3. Make inputs, allocation logic, adjustments, and final obligations inspectable.
4. Copy a self-contained text summary through an explicit user action.
5. Preserve unfinished work locally and perform all core actions after the app has been loaded once, without a network.

Emotional and social jobs:

- Reduce anxiety about appearing unfair or making an arithmetic mistake.
- Replace an unexplained number with a result the group can check together.
- Avoid turning a small, temporary task into an account, payment, or data-sharing commitment.

## 2. Evidence, inference, and assumptions

### Evidence responsibly checked

| ID | Observation | What it supports | What it does **not** prove |
|---|---|---|---|
| E1 | Splitwise’s official product page presents group trips and equal, unequal, percentage, and share-based expense splits; its help center documents multi-currency groups and conversion as a paid feature. | Group travel, unequal allocation, and currency handling are established category needs. | Market size, user satisfaction, or demand for a local-only single-bill tool. |
| E2 | Tricount’s official site presents travel/group bills, offline tracking, multiple currencies, and equal/part/custom splits, and claims 21 million users. | A large incumbent treats offline use and complex splits as valuable category features. The user-count claim is vendor-reported only. | Independent adoption numbers, data quality, or that SplitSnap can displace it. |
| E3 | GDPR Article 5(1)(c) states the data-minimisation principle: personal data should be adequate, relevant, and limited to what is necessary. | Avoiding unnecessary collection is a defensible product requirement for a global product. | That SplitSnap is legally compliant everywhere, or that all bill data is legally personal data. |
| E4 | MDN documents that service-worker-controlled resources can support offline PWA operation, and that installation behavior differs by browser and operating system. | Offline-after-first-load and installability are technically plausible, but must be verified per target browser. | Universal installation, permanent local storage, or identical behavior on all devices. |
| E5 | WCAG 2.2 is a W3C Recommendation and includes keyboard, reflow, contrast, error, focus, and pointer-target criteria. | WCAG 2.2 AA is an appropriate minimum accessibility acceptance target. | Conformance without a complete audit of the finished product. |

Sources checked on 2026-08-01:

- [Splitwise: Split expenses with friends](https://www.splitwise.com/)
- [Splitwise Help: multiple currencies](https://kb.splitwise.com/balances-and-expenses/how-can-i-manage-a-friendship-or-group-with-multiple-currencies)
- [Tricount: Simplify Group Expenses](https://tricount.com/en-in/)
- [Tricount FAQs](https://help.tricount.com/articles/tricount-faqs)
- [EUR-Lex: Regulation (EU) 2016/679, Article 5](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)
- [MDN: Offline and background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [MDN: Installing and uninstalling web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing)
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/)

No paid research, private datasets, scraped personal data, or unverifiable market-size extrapolation was used.

### Assumptions requiring validation

| ID | Assumption | Earliest responsible test | Failure signal |
|---|---|---|---|
| A1 | A single coordinator’s device is sufficient for a one-bill task. | Observe five target users completing a realistic group-bill scenario. | Three or more refuse or cannot proceed without collaborative entry/sync. |
| A2 | Manual entry is acceptable when it avoids signup and upload. | Timed usability tests with 6–10 items and 4 people. | Fewer than 4/5 finish unassisted in 3 minutes or receipt scanning is repeatedly called essential. |
| A3 | A currency label plus 0–3 decimal precision is enough; conversion is not needed for one bill. | Test travelers using JPY-like, USD-like, and KWD-like fixtures. | Two or more of five cannot represent their bill or require exchange-rate conversion to settle it. |
| A4 | A deterministic rounding explanation creates sufficient trust. | Ask each test participant to explain the one-unit adjustment. | Fewer than 4/5 can locate and explain it after using the result view. |
| A5 | Copied text is an adequate V1 sharing artifact. | Have recipients reconstruct who owes what from the text alone. | Any arithmetic ambiguity in the fixture or three or more of five demand a shared live view before trusting it. |
| A6 | Local-only bill data is a meaningful benefit despite storage-loss risk. | Concept comparison and post-task interview, without leading privacy language. | A majority prefers cloud recovery/sync after the trade-off is explained. |
| A7 | English-first UI can serve an initial global release if names and monetary labels accept Unicode. | Test with non-US numeric/currency fixtures and at least two non-native English users. | Input interpretation or task completion fails because of language/number formatting. |

## 3. Product principles and V1 boundary

### V1 scope

V1 is a **single-device, single-bill calculator and share-text generator**. It includes:

- 2–8 participants, each with a unique nonblank display name of 1–40 Unicode code points after surrounding whitespace is trimmed; names are stored only on the device.
- One selected payer per bill.
- An arbitrary 1–12-character monetary label and an explicit 0–3 decimal-place setting; no exchange rate or semantic currency validation.
- Two entry modes:
  - itemized bill: item description, amount, included people, and positive integer shares per included person;
  - quick total: pre-tax amount and positive integer person shares.
- Calculation is blocked in both modes unless the pre-tax subtotal is greater than zero. Quick-total mode identifies its pre-tax amount field with “Enter a pre-tax total greater than 0.” Itemized mode identifies the item list/subtotal with “Add or update items so the pre-tax subtotal is greater than 0.” A positive fixed tax or tip does not override this requirement.
- Optional tax and tip, each entered as either a fixed amount or a percentage of the pre-tax subtotal. Percentage results are rounded to the nearest configured smallest unit (exact halves round upward because negative additions are invalid) and shown before allocation.
- Per-person allocation based on their weighted pre-tax entitlement. Tax and tip follow the same entitlement proportions.
- Deterministic largest-remainder reconciliation at the configured smallest unit. Remaining units go first to the largest discarded fractional remainder; exact ties follow the visible participant order. The result identifies every person receiving a rounding unit.
- A result showing grand total, payer, each participant’s allocated amount, the payer’s own share, each non-payer’s amount owed to the payer, and any rounding adjustment.
- Copyable plain text containing enough input and result detail to verify the split without opening SplitSnap.
- Local draft persistence, explicit start-over/clear-all controls, responsive mobile UI, installability, and offline-after-first-successful-load behavior.

Normative calculation invariants:

1. Calculation begins only when the pre-tax subtotal is greater than zero; all entered and calculated monetary values then resolve to integer smallest units before final allocation.
2. Every share weight is a positive integer; excluded participants have zero entitlement to that item.
3. `grand total = pre-tax subtotal + tax + tip` exactly in smallest units.
4. Sum of participant allocations equals the grand total exactly.
5. Sum of amounts owed to the payer equals `grand total − payer allocation` exactly.
6. The same ordered input produces the same output and rounding recipients.
7. No amount owed is negative. V1 does not model refunds, discounts below zero, or multiple payers.

### Non-goals

V1 does not include:

- accounts, profiles, login, cloud storage, backend APIs, cross-device sync, collaborative editing, or share links;
- payment initiation, bank/card connections, money custody, debt collection, payment status, or legal settlement records;
- exchange rates, conversion, mixed-currency arithmetic, crypto/commodity valuation, or automatic currency-symbol semantics;
- receipt scanning/OCR, camera access, image upload, categories, budgets, analytics, trip ledgers, recurring expenses, or multi-bill netting;
- ads, behavioral analytics, telemetry, remote fonts, or third-party-hosted scripts;
- localization beyond an English V1 interface and Unicode-safe user-entered names/labels;
- production implementation choices, delivery sequencing, or launch planning in this problem-definition phase.

## 4. Required qualities

### Privacy and security requirements

P1. Bill content, participant names, values, and results must remain on the current device unless the user explicitly invokes copy/share. No such data may be placed in a URL, network request, log, telemetry event, crash report, or third-party resource request.

P2. Core product operation must require no account, email, phone number, contact access, location, camera, clipboard read, payment detail, or stable cross-site identifier.

P3. The shipped product must contain no analytics, advertising, tracking pixels, remote fonts, or third-party-hosted executable code. Static hosting may receive ordinary request metadata such as IP address and user agent; the privacy notice must disclose this limitation rather than promise absolute anonymity.

P4. Copy/share is an explicit user gesture and the preview must state that it creates plaintext outside SplitSnap’s control. Clipboard content must not be read back automatically.

P5. “Start over” clears the active bill only after confirmation. “Delete all local data” clears every SplitSnap-created bill/draft and preference on that origin after confirmation, with a visible success state. These destructive actions must be distinguishable and keyboard accessible.

P6. The product must explain that browser/site-data clearing, private browsing, storage eviction, device loss, or using another browser/profile can remove or hide local data. It must not imply backup or guaranteed persistence.

### Offline and installability requirements

O1. After one complete successful online load, creating, editing, calculating, reviewing, copying, and clearing a bill must work with the device offline, including after closing and reopening the installed app or browser tab.

O2. Offline launch must never present a blank screen or network error for the core flow. Any update check or non-core network failure must not block or discard work.

O3. A saved draft must survive an ordinary reload, browser restart, and app restart on the same browser profile, subject to the disclosed browser-storage limitations.

O4. The app must expose valid install metadata and a standalone-capable installed experience on supporting browsers. Where programmatic install prompting is unavailable, concise platform-appropriate installation guidance may be shown without claiming universal support.

O5. An app update must not overwrite a valid local draft. An unreadable or incompatible draft must be preserved until the user explicitly clears it and must produce a recovery-safe error, not a silent reset.

### Accessibility and global-use requirements

X1. The complete V1 flow must meet WCAG 2.2 Level AA; this is a test requirement, not a conformance claim before audit.

X2. Every action and input must be operable with keyboard alone, with logical focus order, visible focus, programmatic name/role/value, and focus returned predictably after adding/removing rows or closing dialogs.

X3. Instructions, validation, selection, and rounding state must not rely on color, position, or icons alone. Errors must identify the field and correction in text and be announced to assistive technology.

X4. Text must resize to 200% without loss of content or function. The core flow must reflow at 320 CSS pixels without two-dimensional page scrolling. Touch targets should be at least 44 × 44 CSS pixels; none may fall below WCAG 2.2 AA target-size requirements.

X5. Text and interactive-state contrast must meet WCAG 2.2 AA. Reduced-motion preference must be honored, and no task may depend on motion, dragging, hover, or a time limit.

X6. User-entered names and monetary labels must accept and preserve Unicode, be displayed safely as text, and remain intelligible in copied output. The UI must explicitly show the configured decimal precision; it must not infer exchange rates or reinterpret the label.

X7. Numeric entry must accept the documented decimal separator behavior consistently, reject ambiguous/malformed values with a repair message, and never silently round user input beyond the configured precision.

## 5. Success and falsification

### Problem-validation success criteria

Before claiming the problem is validated, a moderated test using the frozen canonical fixture in the review packet must show:

- at least 4 of 5 target users complete the bill and copy the correct result without assistance in 3 minutes or less;
- all 5 produce allocations whose sum exactly equals the fixture grand total;
- at least 4 of 5 correctly identify the payer, what each non-payer owes, and why the rounding recipient received one smallest unit;
- at least 4 of 5 recipients can interpret the copied text without seeing the app;
- no participant enters an account, network, or payment flow to complete the task;
- all 5 can complete the same core flow after connectivity is disabled following an initial successful load;
- no high-severity privacy or accessibility defect is found in the evaluated build.

These are validation thresholds, not forecasts. Testing five people detects gross usability failures but does not establish market demand or statistical generality.

### Product success signals

Because behavioral analytics are out of scope, initial evidence must come from consented, researcher-observed sessions and optional feedback collected outside the app:

- completion and arithmetic correctness against known fixtures;
- time to a shareable result;
- comprehension of allocation and rounding;
- willingness to use the product for the next suitable real bill after privacy/storage trade-offs are explained;
- absence of bill-data network transmission under inspection.

No revenue, retention, or acquisition target is asserted without a measurement design and actual observations.

### Falsification / stop criteria

The current V1 concept must be revised rather than rationalized if any of these occurs in the first five representative sessions:

- fewer than 3 users complete the canonical task unassisted;
- any repeated calculation error or nondeterministic result survives correction attempts;
- a majority requires multi-device collaboration, cloud recovery, receipt scanning, or currency conversion to consider the task solved;
- copied text cannot unambiguously reconstruct the fixture’s obligations;
- offline restart loses or corrupts a valid draft in any supported-browser test;
- network inspection shows bill content or stable tracking identifiers leaving the device;
- a keyboard-only or screen-reader user cannot complete the core flow;
- users consistently misunderstand arbitrary labels as live currency conversion.

If fewer than 4/5 users meet the success thresholds but none of the immediate stop criteria fires, the result is **inconclusive**, not validated.

## 6. Principal risks

| Risk | Consequence | Required product response |
|---|---|---|
| Weak direct problem evidence | A polished launch may solve a low-priority or saturated problem. | Treat A1–A7 as open; do not convert competitor claims into user validation. |
| Calculation or rounding defect | Financial disagreement and immediate loss of trust. | Enforce invariants, deterministic reconciliation, visible adjustments, and independent fixture checks. |
| Ambiguous currency behavior | Users may mistake a label for conversion or legal tender support. | Display label and precision only; state “no conversion” wherever ambiguity can arise. |
| Local storage loss | Users may lose a draft with no recovery path. | Autosave locally, disclose limits, never promise backup, and avoid silent destructive migrations. |
| Privacy overclaim | Hosting logs or explicit sharing contradict “nothing leaves your device.” | Use the precise P1–P4 language and verify network behavior; disclose hosting metadata. |
| Shared-device exposure | The next device user may see names and amounts. | Provide clear active-bill and all-data deletion controls and a privacy reminder. |
| PWA/browser variance | Installation or offline restart may fail on a target device. | Make browser launch fully usable; verify a declared support matrix before any launch claim. |
| Dynamic-form accessibility | Repeated items, shares, errors, and dialogs can become unusable. | Require full keyboard, focus, announcement, zoom, reflow, contrast, and screen-reader acceptance. |
| English-first “global” claim | Users may read “global” as localized or multi-currency conversion. | Describe the release precisely: globally accessible, English UI, arbitrary label/precision, no FX. |
| Plaintext sharing | Names and amounts can be forwarded or retained by other apps. | Show the exact preview and a disclosure before the explicit copy/share action. |

## 7. Decision

**Problem-definition verdict: REVIEWABLE, NOT YET VALIDATED.**

The category problem is credible and the proposed V1 is narrow enough to test today. The decisive uncertainty is not whether expense splitting exists; it is whether users value a fast, single-device, local-only bill result enough to accept manual entry, no synchronization, no recovery, and no exchange-rate conversion. Implementation or launch planning must not silently broaden V1 or report these assumptions as proven.
