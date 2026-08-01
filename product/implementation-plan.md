# SplitSnap implementation plan

Status: **frozen plan candidate; production implementation must wait for the plan-review gate**  
Plan date: 2026-08-01  
Problem authority: `adb4cf5578860009ed81b830d3a8e1347854ea226e0c3cf0cc804c0a9de70ecd`  
Target: privacy-first, offline, installable GitHub Pages PWA at `/split-snap/`

## 1. Outcome and boundaries

Build one polished, mobile-first bill calculator that runs entirely in the browser. It supports one payer, 2–8 participants, quick-total and itemized entry, arbitrary monetary label, precision 0–3, fixed or percentage tax/tip, positive integer shares, per-item exclusions, deterministic integer/rational allocation, copy/share text, local draft persistence, explicit deletion, offline restart, and installability.

This plan does not authorize or include production code. It preserves the frozen problem definition and its non-goals:

- no account, backend, API, sync, payment, FX, OCR, analytics, ads, telemetry, remote font, or third-party-hosted executable code;
- no mixed-currency arithmetic, receipt images, trip ledger, multi-bill netting, or simultaneous collaboration;
- no bill data in URLs, requests, logs controlled by the app, crash reports, or deployment artifacts;
- no secret, paid service, production database, server process, or environment-specific credential;
- no deployment until implementation-plan review, implementation verification, and the applicable launch gate are complete, even though the owner has already authorized implementation and public launch.

## 2. Chosen stack

### Decision

Use a static React + TypeScript application built by Vite.

- Runtime dependencies: `react`, `react-dom` only.
- Build/PWA development dependencies: `typescript`, `vite`, `@vitejs/plugin-react`, `vite-plugin-pwa`.
- Unit/component tests: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@vitest/coverage-v8`.
- Browser tests: `@playwright/test`, `@axe-core/playwright`.
- Static checks: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- Package manager: npm with a committed `package-lock.json`; CI uses `npm ci`.

Resolve mutually compatible current stable versions once at implementation start, record them in the lockfile, and do not float versions in CI. Any dependency substitution or additional runtime dependency requires plan-level review because it changes privacy, supply-chain, bundle, or test behavior. GitHub Actions must be pinned to reviewed full commit SHAs with human-readable major-version comments; the current official Pages flow uses checkout, configure-pages, upload-pages-artifact, and deploy-pages.

### Why this stack

React is justified by the repeated dynamic forms, result invalidation, focus restoration, and update/deletion dialogs. TypeScript makes the money/domain boundaries explicit. Vite directly supports a `/split-snap/` base and static Pages output. Vitest shares TypeScript/Vite resolution. Playwright covers Chromium, Firefox, and WebKit and can force an offline browser context. Axe integrates with browser states but does not replace manual accessibility checks.

A no-framework stack would save the React runtime but would increase custom state, focus, repeated-row, and component-test code. A server framework would violate the static/no-backend boundary. The chosen stack is the smallest fully tested option for this interaction density.

### Sources checked 2026-08-01

- [Vite: Deploying a Static Site](https://vite.dev/guide/static-deploy.html) — repository Pages sites require `base: '/split-snap/'`.
- [GitHub: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) — official Pages artifact/deploy flow and minimum permissions.
- [GitHub: Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) — Pages source must be GitHub Actions for a built static site.
- [Playwright: Browsers](https://playwright.dev/docs/browsers) — automated Chromium, Firefox, and WebKit projects.
- [Playwright: BrowserContext](https://playwright.dev/docs/api/class-browsercontext) — deterministic offline emulation via `setOffline`.
- [Playwright: Accessibility testing](https://playwright.dev/docs/accessibility-testing) — axe integration and the explicit limit of automated accessibility checks.
- [Vitest: Coverage](https://vitest.dev/guide/coverage.html) — V8 coverage support.
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and [PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching) — offline request interception and Cache storage behavior.
- [Vite PWA: service-worker strategies](https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors) and [update behavior](https://vite-pwa-org.netlify.app/guide/auto-update) — generated precache support and prompt updates for forms.

These sources establish tool behavior only; passing the specified tests remains required.

## 3. Architecture and project structure

```text
/
├── .github/workflows/
│   └── pages.yml
├── public/
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── app-reducer.ts
│   ├── domain/
│   │   ├── types.ts
│   │   ├── decimal.ts
│   │   ├── rational.ts
│   │   ├── validate.ts
│   │   ├── additions.ts
│   │   ├── allocate.ts
│   │   └── format.ts
│   ├── features/
│   │   ├── setup/
│   │   ├── quick-total/
│   │   ├── itemized/
│   │   ├── results/
│   │   ├── sharing/
│   │   ├── persistence/
│   │   ├── privacy/
│   │   └── pwa/
│   ├── components/
│   ├── styles/
│   ├── test/
│   └── main.tsx
├── tests/
│   ├── e2e/
│   ├── offline/
│   ├── installability/
│   ├── accessibility/
│   ├── privacy/
│   └── live/
├── scripts/
│   ├── verify-dist.mjs
│   ├── verify-moderated-evidence.mjs
│   └── verify-live-artifact.mjs
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.js
├── package.json
└── package-lock.json
```

Tests for domain and React modules are colocated as `*.test.ts` / `*.test.tsx`; browser suites live under `tests/`. Generated `dist/`, coverage, screenshots, videos, traces, and Playwright reports are ignored and never treated as source.

### State boundary

`AppState` contains only input/draft state plus a result revision marker. Calculation returns a new immutable `CalculationResult`; it never mutates the draft. Any input edit clears the current result revision immediately. React receives formatted strings, not floating-point monetary values.

One reducer owns participant order, payer, mode, monetary settings, additions, items, and result freshness. Feature components dispatch typed actions. No context, global store, router, or URL state is needed.

### Money and rational model

- Parse user monetary text directly into `bigint` smallest units; never pass through JavaScript `number`.
- Precision is the integer 0–3. Accept one decimal separator (`.` or `,`), reject mixed separators, grouping separators, exponent notation, signs where values must be nonnegative, malformed text, and monetary digits beyond configured precision. Never silently round entered money.
- Store the monetary label and display names as text. Require a trimmed label of 1–12 Unicode code points and trimmed participant names of 1–40 Unicode code points; compare participant names using NFC-normalized case-sensitive values while preserving the trimmed display spelling, and render only through React text nodes.
- Represent every fraction as normalized `{ numerator: bigint, denominator: bigint }`, with positive denominator and greatest-common-divisor reduction. Parse nonnegative decimal percentages as exact rationals; do not use binary floating point.
- Convert percentage tax/tip to integer units by exact multiplication against pre-tax subtotal followed by nearest-unit rounding; exact half rounds upward. Fixed additions are already integer units.
- Quick mode pre-tax entitlement is `subtotalUnits × personWeight / sumWeights`.
- Itemized pre-tax entitlement is the sum, for each included item, of `itemUnits × personItemWeight / itemWeightSum`; excluded people receive zero for that item.
- Calculation is blocked unless total pre-tax units are greater than zero. Quick mode emits exactly `Enter a pre-tax total greater than 0.`; itemized mode emits exactly `Add or update items so the pre-tax subtotal is greater than 0.` Fixed additions cannot bypass the block.
- Allocate the integer grand total in the exact ratios of accumulated pre-tax entitlements. Floor each exact entitlement, then distribute remaining units by descending discarded remainder and visible participant order for exact ties.

The domain result constructor enforces exactly these seven numbered calculation invariants. Let participants be in visible order `i = 1..n`, the sole payer index be `k`, pre-tax subtotal units be `S`, rounded tax units be `T`, rounded tip units be `U`, grand-total units be `G`, participant `i`'s accumulated exact pre-tax rational entitlement be `q_i`, final allocation units be `a_i`, and amount owed to the payer be `o_i`. For each allocation group `j`, `w_ij` is participant `i`'s share weight and `q_ij` is that group's exact entitlement contribution.

1. **INV-1 — positive integer-unit input closure:** a result may exist only if `S ∈ ℤ` and `S > 0`; after parsing and percentage rounding, `T, U, G, a_i, o_i ∈ ℤ` in the configured smallest unit. Failure to parse an entered monetary value exactly at precision 0–3, or `S <= 0`, produces validation and no result.
2. **INV-2 — valid shares and exclusions:** for every group `j`, included participants satisfy `w_ij ∈ ℤ` and `w_ij > 0`, excluded participants satisfy `w_ij = 0` and `q_ij = 0`, and `Σ_i w_ij > 0`. Also `q_i = Σ_j q_ij`, `q_i >= 0`, and `Σ_i q_i = S` exactly as rationals.
3. **INV-3 — grand-total identity:** `T >= 0`, `U >= 0`, and `G = S + T + U` exactly in integer smallest units.
4. **INV-4 — allocation conservation:** every `a_i ∈ ℤ`, `a_i >= 0`, and `Σ_i a_i = G`.
5. **INV-5 — single-payer settlement identity:** `o_k = 0`; for every `i != k`, `o_i = a_i`; therefore `Σ_i o_i = G - a_k` exactly.
6. **INV-6 — deterministic largest-remainder reconciliation:** define `x_i = q_i × G / S`, `b_i = floor(x_i)`, `r_i = x_i - b_i`, and `R = G - Σ_i b_i`. Then `0 <= R < n`, `a_i = b_i + δ_i`, each `δ_i ∈ {0,1}`, and exactly `R` deltas equal `1`; their recipients are the first `R` participants after sorting by descending `r_i` and then ascending visible-order index. Repeating the same complete ordered input yields byte-for-byte identical numeric results and the same delta recipients.
7. **INV-7 — nonnegative V1 settlement scope:** `|{k}| = 1`, `min_i(a_i) >= 0`, and `min_i(o_i) >= 0`; any negative amount/addition, refund-producing input, or multiple-payer input is outside V1 and is rejected before a result exists.

The shared domain-test helper `assertAllSevenCalculationInvariants(input, result)` must return/assert the complete ordered vector `INV-1` through `INV-7`; it may not accept a subset. Every valid canonical case (F1, F2, F3, and F4 base), every valid generated-matrix case, and each of the 100 deterministic repetitions invokes that helper. Invalid F4 variants and generated invalid cases assert their exact field repair and absence of a result, so they do not falsely claim result invariants. If a result-construction invariant fails, the constructor raises a typed `calculation_invariant_violation`, returns no partial result, and the UI exposes only a safe retry/review-input message; copied text and persistence remain unavailable for that failed result, and no bill values are logged.

Numeric input receives a defensive 128-code-unit UI cap to prevent pathological parsing; this is not a semantic monetary maximum. Values within the cap are handled by `bigint` without magnitude loss.

### Persistence and deletion

Use same-origin `localStorage`, sufficient for one compact draft and preferences, without a storage dependency.

- Keys: `split-snap:v1:draft` and `split-snap:v1:preferences`.
- Serialize `bigint` input values as canonical decimal strings inside a schema-versioned JSON envelope. Do not persist derived results; recompute them from validated inputs to prevent stale obligations.
- Autosave after input transitions with a short debounce and flush before visibility loss and before accepting a service-worker update.
- On parse, quota, write, or unknown-schema failure, retain the original stored bytes, show a non-destructive error, and do not overwrite or silently reset.
- “Start over” confirms and removes only the active draft. “Delete all local data” confirms and removes all `split-snap:` keys and in-memory draft/preferences. Cancel changes nothing. Static service-worker caches contain no bill data and are not represented as user backup.
- Explain storage eviction, private mode, browser/profile separation, device loss, and lack of backup.

### PWA and update safety

- Set Vite `base` to `/split-snap/` in every build and preview test.
- Generate `manifest.webmanifest` and a Workbox precache service worker with `vite-plugin-pwa` `generateSW` and `registerType: 'prompt'`.
- Manifest: `name`, `short_name`, `start_url: '/split-snap/'`, `scope: '/split-snap/'`, `display: 'standalone'`, theme/background colors, description, and local 192×192, 512×512, and maskable 512×512 PNG icons.
- Precache the HTML shell, hashed JS/CSS, manifest, and all icons. Use the scoped navigation fallback. Do not add cross-origin runtime caching, background sync, push, notifications, periodic sync, or payment handlers.
- Keep the active worker and UI running until the user accepts an “Update ready” prompt. Before activation, synchronously confirm the latest draft save succeeded; on save failure, block reload and retain the old worker. On acceptance, activate the waiting worker, reload once under the new controller, parse the unchanged draft, and show a recovery-safe error rather than deleting an incompatible draft.
- Clean obsolete static caches only after the new worker activates. Cache cleanup never touches Web Storage.
- Offline support is claimed only after a successful initial load and the browser-specific tests pass.

### Privacy and security

- App code makes no `fetch`, XHR, beacon, WebSocket, EventSource, analytics, telemetry, remote font, or third-party resource request. Browser-managed same-origin navigation, static assets, service-worker update checks, and GitHub Pages request metadata remain disclosed.
- Use a meta Content Security Policy compatible with Pages: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`. Do not claim header-only protections Pages cannot provide.
- Copy uses `navigator.clipboard.writeText` only after an explicit gesture and after showing the exact plaintext preview/disclosure. Never call clipboard read. Share uses `navigator.share({ text })` only when supported and explicitly invoked; cancellation is not an error. Fallback is copy.
- No user text is inserted with `innerHTML`, used as a URL, included in a file name, or written to console. React text rendering plus tests protect Unicode/canary values.
- Workflows use no repository/environment secrets. Pages deployment gets only `contents: read`, `pages: write`, and `id-token: write` in the deploy job; test jobs get `contents: read` only.

## 4. Commands and gates

The implementation must define these exact scripts before product behavior work:

| Command | Required behavior |
|---|---|
| `npm run dev` | Vite development server only; no service-worker acceptance evidence. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | ESLint with zero warnings. |
| `npm run test:unit -- --run` | All Vitest domain/component tests once. |
| `npm run test:coverage` | Vitest V8 coverage with all source files included. |
| `npm run build` | Production build for `/split-snap/`; no warnings treated as accepted without review. |
| `npm run seal:dist -- --dir "$DIST_DIR"` | Write and verify the sorted file manifest/metadata for an already-built directory; never build or mutate shipped bytes. |
| `npm run preview -- --dir "$DIST_DIR"` | Serve the supplied existing artifact directory; fail if its sealed digest changes before or after browser tests. |
| `npm run test:e2e` | All Playwright functional projects against the supplied sealed `DIST_DIR`; never build. |
| `npm run test:offline` | Playwright tests tagged `@offline` against that same sealed `DIST_DIR`; never build. |
| `npm run test:install` | Playwright/static tests tagged `@install` against that same sealed `DIST_DIR`; never build. |
| `npm run test:a11y` | Playwright tests tagged `@a11y` against that same sealed `DIST_DIR`; never build. |
| `npm run test:privacy` | Playwright/build tests tagged `@privacy` against that same sealed `DIST_DIR`; never build. |
| `npm run check:source` | typecheck, lint, unit once, and coverage; never build. |
| `npm run verify:dist -- --dir "$DIST_DIR" --sha "$DIST_TREE_SHA256"` | Recompute the sealed digest, run every static/browser/install/offline/accessibility/privacy check on those exact bytes, recompute the digest afterward, and fail on mutation; never build. |
| `npm run check` | `check:source`, then one production build for local TDD compile assurance. |
| `npm run verify` | Local one-shot convenience: `check:source`, build exactly once, seal `dist/`, then `verify:dist` on that unchanged directory. |

No CI job that consumes a sealed artifact may invoke `vite build`, `npm run build`, `npm run check`, `npm run verify`, or any script with an implicit build. CI uses `check:source`, one `build_once`, and then only `verify:dist`/validation commands over the downloaded immutable artifact.

Coverage gates:

- `src/domain/**`: 100% statements, branches, functions, and lines per file.
- all `src/**`: at least 90% statements/lines/functions and 85% branches, with uncovered files included.
- Coverage never substitutes for fixture, browser, privacy, or manual accessibility evidence.

## 5. Strict vertical TDD protocol

Toolchain/configuration scaffolding may be created first only to make tests runnable; it must not render product behavior. Thereafter every behavior follows this exact sequence:

1. Add one smallest user-observable or domain-invariant test and no production behavior.
2. Run the exact narrow RED command listed below and save command, exit code, and relevant output under `product/evidence/implementation/red/<slice>-<behavior>.txt`.
3. Confirm failure is the listed missing-feature failure. Syntax, import-path typo, environment, flaky, or unrelated failure is not valid RED. If the test passes, stop and strengthen it before writing behavior.
4. Write only the minimum production change needed for GREEN.
5. Re-run the identical narrow command and record GREEN evidence.
6. Run `npm run check`, then the slice-specific browser command when listed. Any failure resets the slice to RED/repair; do not defer it.
7. Refactor only after full GREEN. Re-run the narrow command, `npm run check`, and the slice browser command. Preserve behavior and evidence.

No batch of untested behaviors, retroactive tests, test deletion to obtain GREEN, conditional waiver, or snapshot acceptance without semantic assertions is allowed.

### Executable per-behavior packets

V00 is configuration-only. Its command is `npm run test:unit -- --run src/test/harness.test.ts -t "^V00-B01 runs the locked test harness$"`; the valid initial failure is “missing test script/toolchain,” and GREEN may add only locked tools/configuration plus an empty `#root`. It creates no product behavior.

The table below is the complete V01–V11 behavior inventory. Every selector names exactly one test. The evidence path is a JSON packet containing behavior ID, exact command, test-file SHA-256, RED start/end time, exit code, expected and observed failure, captured-output SHA-256, GREEN result, full-check result, refactor result, and implementation revision. Production changes may touch only the stated minimal boundary. Adding or combining behavior requires a new plan freeze.

| ID | Exact single-test RED command | Required feature-missing RED | Minimal production boundary | Evidence path |
|---|---|---|---|---|
| V01-B01 | `npm run test:unit -- --run src/app/App.quick.test.tsx -t "^V01-B01 renders the semantic mobile shell$"` | `App` or the named SplitSnap main region is absent. | Render heading/main/form shell only. | `product/evidence/implementation/tdd/V01-B01.json` |
| V01-B02 | `npm run test:unit -- --run src/app/App.quick.test.tsx -t "^V01-B02 completes a two-person equal quick split$"` | Quick amount/participant controls or equal result is absent. | Two participants, one positive quick subtotal, equal allocation only. | `product/evidence/implementation/tdd/V01-B02.json` |
| V01-B03 | `npm run test:unit -- --run src/app/App.quick.test.tsx -t "^V01-B03 selects payer label and precision$"` | Payer, label, or precision control/output is absent. | Add only payer selector, label and 0–3 precision state/display. | `product/evidence/implementation/tdd/V01-B03.json` |
| V02-B01 | `npm run test:unit -- --run src/domain/decimal.test.ts -t "^V02-B01 parses dot decimals directly to bigint units$"` | Parser is absent or returns floating/incorrect units. | Dot-decimal text-to-`bigint` parser for valid nonnegative money. | `product/evidence/implementation/tdd/V02-B01.json` |
| V02-B02 | `npm run test:unit -- --run src/domain/decimal.test.ts -t "^V02-B02 normalizes one comma decimal separator$"` | Comma input is rejected or mis-scaled. | Add comma-as-decimal normalization only. | `product/evidence/implementation/tdd/V02-B02.json` |
| V02-B03 | `npm run test:unit -- --run src/domain/decimal.test.ts -t "^V02-B03 rejects mixed malformed exponent and signed money$"` | Any forbidden syntax is accepted/coerced. | Add lexical rejection and typed repair result only. | `product/evidence/implementation/tdd/V02-B03.json` |
| V02-B04 | `npm run test:unit -- --run src/domain/decimal.test.ts -t "^V02-B04 rejects over-precision without rounding$"` | `9.999` at precision 2 is accepted/rounded. | Add configured-precision rejection only. | `product/evidence/implementation/tdd/V02-B04.json` |
| V02-B05 | `npm run test:unit -- --run src/domain/format.test.ts -t "^V02-B05 formats precision zero through three exactly$"` | Any precision formats incorrectly. | Add `bigint` formatter for 0–3 decimals. | `product/evidence/implementation/tdd/V02-B05.json` |
| V02-B06 | `npm run test:unit -- --run src/domain/rational.test.ts -t "^V02-B06 normalizes exact bigint rationals$"` | Rational reduction/sign/denominator invariant is absent. | Add GCD-normalized rational primitives only. | `product/evidence/implementation/tdd/V02-B06.json` |
| V02-B07 | `npm run test:unit -- --run src/app/App.unicode.test.tsx -t "^V02-B07 enforces Unicode label and name limits safely$"` | Limits/NFC duplicate comparison/text rendering fail. | Add label/name trim, code-point limits, comparison and text rendering; no allocation change. | `product/evidence/implementation/tdd/V02-B07.json` |
| V03-B01 | `npm run test:unit -- --run src/app/App.participants.test.tsx -t "^V03-B01 enforces two through eight participants$"` | One/nine participants can calculate or repair is absent. | Add participant-count validation only. | `product/evidence/implementation/tdd/V03-B01.json` |
| V03-B02 | `npm run test:unit -- --run src/app/App.participants.test.tsx -t "^V03-B02 rejects blank and duplicate participant names$"` | Blank/NFC-duplicate names can calculate. | Add field validation only. | `product/evidence/implementation/tdd/V03-B02.json` |
| V03-B03 | `npm run test:unit -- --run src/app/App.participants.test.tsx -t "^V03-B03 preserves visible order and selected payer$"` | Reorder/payer identity is lost or changed. | Add typed reorder and payer reducer actions only. | `product/evidence/implementation/tdd/V03-B03.json` |
| V03-B04 | `npm run test:unit -- --run src/domain/validate.test.ts -t "^V03-B04 accepts only positive integer shares$"` | Zero/negative/fractional/blank/malformed share is accepted. | Add share parser/repair result only. | `product/evidence/implementation/tdd/V03-B04.json` |
| V03-B05 | `npm run test:unit -- --run src/app/App.participants.test.tsx -t "^V03-B05 excludes a participant with zero entitlement$"` | Excluded person still receives entitlement. | Add explicit included flag and zero entitlement only. | `product/evidence/implementation/tdd/V03-B05.json` |
| V04-B01 | `npm run test:unit -- --run src/domain/additions.test.ts -t "^V04-B01 adds fixed tax and tip in integer units$"` | Fixed additions are absent or grand total is wrong. | Add fixed nonnegative addition calculation only. | `product/evidence/implementation/tdd/V04-B01.json` |
| V04-B02 | `npm run test:unit -- --run src/domain/additions.test.ts -t "^V04-B02 rounds exact percentage additions half upward$"` | Below/at/above-half cases differ or use float. | Add exact percentage rational and half-up conversion only. | `product/evidence/implementation/tdd/V04-B02.json` |
| V04-B03 | `npm run test:unit -- --run src/domain/allocate.quick.test.ts -t "^V04-B03 decomposes exact floors remainders and remaining-unit count$"` | The pure allocation decomposition `{baseUnits, discardedRemainders, remainingUnits}` is absent. | Add only a pure exact decomposition that floors each entitlement and reports `R`; it must not choose recipients, add remainder units, or return a final `CalculationResult`. | `product/evidence/implementation/tdd/V04-B03.json` |
| V04-B04 | `npm run test:unit -- --run src/domain/allocate.quick.test.ts -t "^V04-B04 reconciles largest remainders with visible-order ties and reproduces F2$"` | B03 deliberately returns unresolved `R`, so no final allocation/recipient exists and F2 cannot equal `[34,33,33]` with Dee receiving `+1`. | Add the single reconciliation policy: descending discarded remainder with ascending visible order for exact ties, distribute exactly `R`, and return final allocations/recipients. No alternative or pre-tie ordering is permitted. | `product/evidence/implementation/tdd/V04-B04.json` |
| V04-B05 | `npm run test:unit -- --run src/domain/allocate.quick.test.ts -t "^V04-B05 reproduces complete F3$"` | F3 tax/total/allocation differs from canonical packet. | Compose existing quick/addition primitives for F3 only. | `product/evidence/implementation/tdd/V04-B05.json` |
| V04-B06 | `npm run test:unit -- --run src/domain/validate.test.ts -t "^V04-B06 blocks zero quick subtotal despite fixed addition$"` | Calculation proceeds or exact quick repair differs. | Add quick positive-subtotal precondition only. | `product/evidence/implementation/tdd/V04-B06.json` |
| V05-B01 | `npm run test:unit -- --run src/app/App.itemized.test.tsx -t "^V05-B01 adds item rows and sums subtotal$"` | Item rows/subtotal are absent or wrong. | Add item description/amount rows and subtotal only. | `product/evidence/implementation/tdd/V05-B01.json` |
| V05-B02 | `npm run test:unit -- --run src/domain/allocate.itemized.test.ts -t "^V05-B02 allocates item shares and exclusions exactly$"` | Item weights/exclusions produce wrong rational entitlement. | Add per-item rational entitlement only. | `product/evidence/implementation/tdd/V05-B02.json` |
| V05-B03 | `npm run test:unit -- --run src/domain/allocate.itemized.test.ts -t "^V05-B03 reproduces complete F1$"` | F1 differs from `7.48,13.98,8.08` or owed `22.06`. | Compose existing item/addition/remainder primitives for F1 only. | `product/evidence/implementation/tdd/V05-B03.json` |
| V05-B04 | `npm run test:unit -- --run src/domain/validate.test.ts -t "^V05-B04 blocks zero itemized subtotal despite fixed addition$"` | Calculation proceeds or exact itemized repair differs. | Add itemized positive-subtotal precondition only. | `product/evidence/implementation/tdd/V05-B04.json` |
| V06-B01 | `npm run test:unit -- --run src/app/App.result.test.tsx -t "^V06-B01 invalidates result after every input edit$"` | Old obligations remain current after an edit. | Add input/result revision invalidation only. | `product/evidence/implementation/tdd/V06-B01.json` |
| V06-B02 | `npm run test:unit -- --run src/features/results/Results.test.tsx -t "^V06-B02 shows every required total payer allocation and owed value$"` | Any required result field is absent. | Render existing result fields only. | `product/evidence/implementation/tdd/V06-B02.json` |
| V06-B03 | `npm run test:unit -- --run src/features/results/Results.test.tsx -t "^V06-B03 identifies each reconciliation recipient$"` | Rounding recipient/unit is not explicit. | Add reconciliation explanation only. | `product/evidence/implementation/tdd/V06-B03.json` |
| V07-B01 | `npm run test:unit -- --run src/features/sharing/share-text.test.ts -t "^V07-B01 formats exact reconstructable F1 F2 and F3 plaintext$"` | The pure formatter or any exact canonical F1/F2/F3 plaintext field is absent, unstable, or cannot reconstruct the obligation and rounding decision. | Add one pure canonical plaintext-format contract, exercised by the three fixtures; no clipboard/share UI behavior. | `product/evidence/implementation/tdd/V07-B01.json` |
| V07-B02 | `npm run test:unit -- --run src/features/sharing/Sharing.test.tsx -t "^V07-B02 previews and explicitly writes disclosed plaintext$"` | Preview/disclosure or explicit `writeText` is absent. | Add preview, disclosure and write-only copy action only. | `product/evidence/implementation/tdd/V07-B02.json` |
| V07-B03 | `npm run test:unit -- --run src/features/sharing/Sharing.test.tsx -t "^V07-B03 shares when supported and falls back on cancel or absence$"` | Share/fallback/cancel behavior is wrong. | Add optional explicit Web Share branch only. | `product/evidence/implementation/tdd/V07-B03.json` |
| V07-B04 | `npm run test:unit -- --run src/features/sharing/share-text.test.ts -t "^V07-B04 preserves Unicode and neutralizes line controls$"` | Unicode corrupts or control text spoofs output structure. | Add plaintext line-control sanitization while preserving visible Unicode. | `product/evidence/implementation/tdd/V07-B04.json` |
| V08-B01 | `npm run test:unit -- --run src/features/persistence/persistence.test.ts -t "^V08-B01 restores versioned draft inputs without derived result$"` | Reload loses inputs or persists stale result. | Add versioned serialization/read for draft inputs only. | `product/evidence/implementation/tdd/V08-B01.json` |
| V08-B02 | `npm run test:unit -- --run src/features/persistence/persistence.test.ts -t "^V08-B02 preserves prior bytes on write or quota failure$"` | Failure overwrites/removes prior bytes. | Add guarded write and non-destructive error only. | `product/evidence/implementation/tdd/V08-B02.json` |
| V08-B03 | `npm run test:unit -- --run src/features/persistence/persistence.test.ts -t "^V08-B03 retains corrupt or unknown-schema bytes$"` | Load silently resets/overwrites bytes. | Add recovery-safe read error only. | `product/evidence/implementation/tdd/V08-B03.json` |
| V08-B04 | `npm run test:unit -- --run src/features/persistence/Persistence.test.tsx -t "^V08-B04 confirms start over and clears only active draft$"` | Cancel mutates or confirm removes preferences. | Add start-over dialog/scope only. | `product/evidence/implementation/tdd/V08-B04.json` |
| V08-B05 | `npm run test:unit -- --run src/features/persistence/Persistence.test.tsx -t "^V08-B05 confirms deletion of every SplitSnap local key$"` | Cancel mutates or confirm leaves prefixed keys/in-memory state. | Add all-data dialog and prefix deletion only. | `product/evidence/implementation/tdd/V08-B05.json` |
| V09-B01 | `npm run test:a11y -- --grep "^V09-B01 initial shell has no automated WCAG A-AA violation$"` | Axe reports missing names/structure/contrast. | Fix only initial-shell semantic/contrast findings. | `product/evidence/implementation/tdd/V09-B01.json` |
| V09-B02 | `npm run test:a11y -- --grep "^V09-B02 keyboard completes F1 with logical focus$"` | Keyboard cannot complete or focus becomes hidden/trapped. | Add keyboard/focus behavior needed by F1 only. | `product/evidence/implementation/tdd/V09-B02.json` |
| V09-B03 | `npm run test:a11y -- --grep "^V09-B03 dynamic rows and dialogs restore focus$"` | Add/remove/dialog leaves focus lost or illogical. | Add focus restoration only. | `product/evidence/implementation/tdd/V09-B03.json` |
| V09-B04 | `npm run test:a11y -- --grep "^V09-B04 errors results and rounding are announced$"` | Live status lacks field/error/result/reconciliation announcement. | Add labels, descriptions and live regions only. | `product/evidence/implementation/tdd/V09-B04.json` |
| V09-B05 | `npm run test:a11y -- --grep "^V09-B05 reflows at 320px and 200 percent zoom$"` | Content/function is lost or page scrolls in two dimensions. | Responsive CSS/reflow fixes only. | `product/evidence/implementation/tdd/V09-B05.json` |
| V09-B06 | `npm run test:a11y -- --grep "^V09-B06 targets cues contrast and reduced motion pass$"` | Target/cue/contrast/motion assertion fails. | Fix only target size, non-color cue, contrast and motion styles. | `product/evidence/implementation/tdd/V09-B06.json` |
| V10-B01 | `npm run test:install -- --grep "^V10-B01 manifest is scoped to split-snap with valid icons$"` | Manifest/base/scope/start/icon assertion fails. | Add Vite base, manifest fields and local icons only. | `product/evidence/implementation/tdd/V10-B01.json` |
| V10-B02 | `npm run test:install -- --grep "^V10-B02 every shell and precache resource returns 200$"` | Service worker/precache is absent or any entry fails. | Add generated precache/navigation fallback only. | `product/evidence/implementation/tdd/V10-B02.json` |
| V10-B03 | `npm run test:offline -- --grep "^V10-B03 reopens and completes F1 offline after initial load$"` | Offline close/reopen or core action fails. | Add cache strategy needed for core offline flow only. | `product/evidence/implementation/tdd/V10-B03.json` |
| V10-B04 | `npm run test:offline -- --grep "^V10-B04 rejecting update preserves old controller UI and draft$"` | Prompt/reject path activates or mutates state. | Add prompt registration and reject branch only. | `product/evidence/implementation/tdd/V10-B04.json` |
| V10-B05 | `npm run test:offline -- --grep "^V10-B05 failed draft save blocks update activation$"` | Waiting worker activates after failed flush. | Add save-success precondition and blocked error only. | `product/evidence/implementation/tdd/V10-B05.json` |
| V10-B06 | `npm run test:offline -- --grep "^V10-B06 accepted update changes controller and reloads once$"` | Controller does not change, reload count differs, or draft changes. | Add accept/activate/one-reload path only. | `product/evidence/implementation/tdd/V10-B06.json` |
| V10-B07 | `npm run test:offline -- --grep "^V10-B07 incompatible draft survives update until explicit deletion$"` | New app overwrites/removes raw draft. | Add post-update recovery-safe schema error only. | `product/evidence/implementation/tdd/V10-B07.json` |
| V10-B08 | `npm run test:offline -- --grep "^V10-B08 activation removes obsolete static cache only$"` | Old cache remains or Web Storage changes. | Add obsolete static-cache cleanup with storage non-interference only. | `product/evidence/implementation/tdd/V10-B08.json` |
| V11-B01 | `npm run test:privacy -- --grep "^V11-B01 never transmits the canary bill$"` | Canary appears in any URL/header/body/beacon/socket/event/log. | Remove/forbid transmitting code; add same-origin static allowlist only. | `product/evidence/implementation/tdd/V11-B01.json` |
| V11-B02 | `npm run test:privacy -- --grep "^V11-B02 build contains no remote executable tracker or font$"` | Dist scan or request graph finds forbidden resource. | Remove remote resource/SDK only. | `product/evidence/implementation/tdd/V11-B02.json` |
| V11-B03 | `npm run test:privacy -- --grep "^V11-B03 requests no permission and never reads clipboard$"` | Forbidden API spy is called. | Remove forbidden permission/read path only. | `product/evidence/implementation/tdd/V11-B03.json` |
| V11-B04 | `npm run test:privacy -- --grep "^V11-B04 meta CSP blocks product connections$"` | CSP is absent/mismatched or a connection succeeds. | Add compatible meta CSP only. | `product/evidence/implementation/tdd/V11-B04.json` |
| V11-B05 | `npm run test:privacy -- --grep "^V11-B05 renders canary Unicode as text without URL or console leakage$"` | Markup executes or value reaches URL/console. | Replace unsafe rendering/log/URL use only. | `product/evidence/implementation/tdd/V11-B05.json` |

After every packet GREEN/refactor, run `npm run check`; after V08 run `npm run test:e2e -- --grep @persistence`, after V09 `npm run test:a11y`, after V10 both `npm run test:install` and `npm run test:offline`, and after V11 `npm run test:privacy -- --project=chromium --project=firefox --project=webkit`. V09 also requires the manual assistive-technology gate in Section 6.

V12 adds no new behavior: `npm run test:e2e -- --grep "^V12 canonical F1-F4 journeys$"` may fail only on cross-slice integration and permits integration repair only; the journey must assert the normative copied plaintext for F1, F2, and F3. Then run `npm run verify` once to build/seal one local artifact and run `verify:dist` twice more from clean browser contexts against that unchanged digest; neither repeat may rebuild. V13 adds no product behavior: predeploy `npm run test:e2e -- --grep "^V13 Pages base stays under split-snap$"`; live `BASE_URL="$PAGES_URL" npm run test:e2e -- --grep "^V13 live HTTP UI and offline smoke$" --project=chromium`.

## 6. Deterministic test specification

### Canonical ordered fixture packets

These inputs are normative and are entered in the stated order. `excluded` means no weight and zero entitlement for that item. `none` means the addition is disabled. Tests may deserialize an equivalent fixture object, but visible e2e tests must enter the same values through the UI.

#### F1 — itemized unequal shares, percentage tax, fixed tip

- Monetary label: `USD`; precision: `2`; mode: `itemized`.
- Participant order: `1 Ana`, `2 Bo`, `3 Cy`; payer: `Ana`.
- Item order:
  1. description `Noodles`, amount `10.00`: Ana share `1`, Bo share `1`, Cy `excluded`;
  2. description `Curry`, amount `11.00`: Ana `excluded`, Bo share `1`, Cy share `1`;
  3. description `Tea`, amount `4.00`: Ana share `1`, Bo share `1`, Cy share `1`.
- Tax: `percent`, value `8`; tip: `fixed`, value `2.54`.
- Expected: pre-tax `25.00`, tax `2.00`, tip `2.54`, grand total `29.54`; Ana `7.48`; Bo `13.98` owed to Ana; Cy `8.08` owed to Ana including `+0.01`; total owed to Ana `22.06`.

#### F2 — quick-total exact tie

- Monetary label: `JPY`; precision: `0`; mode: `quick`.
- Participant order: `1 Dee`, `2 Eli`, `3 Fox`; payer: `Dee`.
- Pre-tax total: `100`; person shares: Dee `1`, Eli `1`, Fox `1`.
- Tax: `none`; tip: `none`.
- Expected: grand total `100`; Dee `34` including `+1` by visible-order tie-break; Eli `33`; Fox `33`; total owed to Dee `66`.

#### F3 — three decimals, percent tax rounding, fixed tip

- Monetary label: `KWD`; precision: `3`; mode: `quick`.
- Participant order: `1 Gia`, `2 Han`; payer: `Gia`.
- Pre-tax total: `1.005`; person shares: Gia `1`, Han `1`.
- Tax: `percent`, value `5`; tip: `fixed`, value `0.010`.
- Expected: raw tax `0.05025`, displayed rounded tax `0.050`, tip `0.010`, grand total `1.065`; Gia `0.533` including `+0.001` by visible-order tie-break; Han `0.532` owed to Gia.

#### F4 — exclusion and validation family

F4 base packet:

- Monetary label: `USD`; precision: `2`; mode: `itemized`.
- Participant order: `1 Jo`, `2 Kai`; payer: `Jo`.
- One item: description `Solo`, amount `9.99`: Jo share `1`, Kai `excluded`.
- Tax: `none`; tip: `none`.
- Expected valid result: Jo `9.99`, Kai `0.00`, grand total `9.99`, owed to Jo `0.00`.

Each invalid variant starts from the F4 base unless a complete replacement is stated:

| Variant | Ordered input mutation | Required block |
|---|---|---|
| F4-Q0 | Replace with quick mode; total `0.00`; Jo share `1`, Kai share `1`; tax `none`; tip fixed `1.00`. | Bind quick-total field and show exactly `Enter a pre-tax total greater than 0.` |
| F4-I0 | Keep itemized mode; replace item amount with `0.00`, include Jo/Kai share `1`; tax fixed `1.00`; tip `none`. | Bind item list/subtotal and show exactly `Add or update items so the pre-tax subtotal is greater than 0.` |
| F4-W0 | Replace Jo item share with `0`. | Bind share field; error code `share_positive_integer`. |
| F4-WNEG | Replace Jo item share with `-1`. | Bind share field; error code `share_positive_integer`. |
| F4-WFRAC | Replace Jo item share with `1.5`. | Bind share field; error code `share_positive_integer`. |
| F4-WBLANK | Replace Jo item share with the empty string. | Bind share field; error code `share_positive_integer`. |
| F4-WTEXT | Replace Jo item share with `abc`. | Bind share field; error code `share_positive_integer`. |
| F4-PREC | Replace item amount with `9.999`. | Bind amount field; error code `amount_over_precision`; do not round. |
| F4-TAXNEG | Set fixed tax to `-0.01`. | Bind tax field; error code `addition_nonnegative`. |
| F4-TIPNEG | Set fixed tip to `-10.00`, which would make the grand total negative. | Bind tip field; error code `addition_nonnegative`; no allocation. |
| F4-ITEMNEG | Replace item amount with `-0.01`. | Bind item amount; error code `amount_nonnegative`. |
| F4-NOINCLUDE | Exclude both Jo and Kai from the `Solo` item. | Bind item participant group; error code `item_requires_participant`. |
| F4-DUPNAME | Rename Kai to `Jo`. | Bind second name; error code `participant_name_unique`. |
| F4-BLANKNAME | Rename Kai to three spaces. | Bind second name; error code `participant_name_required`. |
| F4-NINE | Complete replacement: quick mode, label `USD`, precision `2`, order `A` through `I` (nine people), payer `A`, subtotal `9.00`, every share `1`, no additions. | Bind participant list; error code `participant_count_2_to_8`. |

The error codes are test identifiers and need not be exposed verbatim to users except the two frozen zero-subtotal messages. Tests assert the field association, a human repair message, and absence of a result.

### Normative copied plaintext for F1–F3

`V07-B01` asserts these UTF-8 strings byte-for-byte, including line order and one final LF. The visible preview, `clipboard.writeText`, and `navigator.share({ text })` payload must be the identical string. `V12` enters and calculates F1, F2, and F3 through visible controls and asserts the corresponding preview/copy payload again; it adds no formatter behavior. Each string explicitly carries the monetary label and precision, payer, every allocation and owed amount, grand total, and rounding recipient/reason so a recipient can reconstruct the settlement without the app.

F1:

```text
SplitSnap
Monetary label: USD
Precision: 2
Payer: Ana
Grand total: USD 29.54
Allocations:
- Ana: USD 7.48; owes Ana: USD 0.00 (payer)
- Bo: USD 13.98; owes Ana: USD 13.98
- Cy: USD 8.08; owes Ana: USD 8.08
Total owed to Ana: USD 22.06
Rounding: Cy received +USD 0.01 because Cy had the largest discarded remainder.
```

F2:

```text
SplitSnap
Monetary label: JPY
Precision: 0
Payer: Dee
Grand total: JPY 100
Allocations:
- Dee: JPY 34; owes Dee: JPY 0 (payer)
- Eli: JPY 33; owes Dee: JPY 33
- Fox: JPY 33; owes Dee: JPY 33
Total owed to Dee: JPY 66
Rounding: Dee received +JPY 1 because equal discarded remainders were tied and Dee appears first in visible participant order.
```

F3:

```text
SplitSnap
Monetary label: KWD
Precision: 3
Payer: Gia
Grand total: KWD 1.065
Allocations:
- Gia: KWD 0.533; owes Gia: KWD 0.000 (payer)
- Han: KWD 0.532; owes Gia: KWD 0.532
Total owed to Gia: KWD 0.532
Rounding: Gia received +KWD 0.001 because equal discarded remainders were tied and Gia appears first in visible participant order.
```

### Domain/unit

- Complete canonical F1–F4 ordered inputs, exact outputs, error bindings/codes, and the two exact frozen repair strings above. Each valid canonical result—F1, F2, F3, and F4 base—must invoke `assertAllSevenCalculationInvariants(input, result)` and assert the ordered `INV-1`–`INV-7` vector; each invalid F4 variant must instead assert its exact field repair and no result.
- Precision 0, 1, 2, 3; `.` and `,`; malformed, mixed, exponent, negative, and over-precision inputs.
- Fixed and decimal-percentage additions, below/at/above half-unit boundaries.
- 2–8 participants; visible-order ties; unique and maximum remainders; excluded person; all-but-one exclusion.
- The generated invariant matrix is the following exact ordered union; IDs are not optional and cases are never deduplicated:
  - **GM-C core, 448 cases:** Cartesian IDs `GM-C-P<p>-N<n>-M<m>-W<w>-A<a>-S<s>` over `p={0,1,2,3}`, `n={2,3,4,5,6,7,8}`, `m={Q,I}`, `w={E,U}` (equal/unequal positive integer shares), `a={F,PCT}` (fixed/percentage addition), and `s={POS,ZERO}`. Iterate dimensions in that written order. The 224 `POS` cases are valid; the 224 `ZERO` cases are invalid and must produce the exact quick/itemized positive-subtotal repair despite the generated nonnegative addition.
  - **GM-X exclusions, 112 valid cases:** Cartesian IDs `GM-X-P<p>-N<n>-M<m>-X<x>` over the same four precisions, seven participant counts, both modes, and `x={LAST,ALT}`. `LAST` excludes the last visible participant; `ALT` excludes every even visible position, leaving all odd positions included. For itemized mode the pattern applies to every generated item and every item retains an included participant. Share shape and fixed/percentage addition alternate deterministically by the zero-based case ordinal. Each case must prove excluded contributions and allocations are zero.
  - **GM-R remainder classes, 112 valid cases:** Cartesian IDs `GM-R-P<p>-N<n>-M<m>-R<r>` over the same four precisions, seven participant counts, both modes, and `r={TIE,NON}`. Inputs are constructed and then predicate-checked so `TIE` has `R = 1` and at least two equal maximal discarded remainders, with the earliest visible maximum receiving the unit, while `NON` has `R > 0` and exactly one maximal discarded remainder, whose participant receives a unit. A generator that cannot satisfy its named predicate fails rather than skipping or relabeling the case.
- The matrix total is exactly 672 cases: 448 valid and 224 invalid. Evidence records the ordered case ID list and these family/total/valid/invalid counts. Every one of the 448 valid cases invokes the non-optional `assertAllSevenCalculationInvariants(input, result)` helper and records the ordered result object `{"INV-1":"PASS",...,"INV-7":"PASS"}`; a missing ID or non-PASS value fails the matrix. Every invalid case records its exact field binding/repair and absence of a result and is not counted as invariant-bearing. This union explicitly spans precision 0–3, 2–8 participants, both modes, equal/unequal shares, fixed/percentage additions, zero/positive subtotal, no-exclusion plus two exclusion classes, and exact tie/non-tie remainder classes.
- Large `bigint` values within the input cap to prove no safe-integer loss.
- Formatter/parser round trips plus the exact F1/F2/F3 plaintext above. Unit checks parse each output independently and assert label, precision, payer, every allocation/owed value, grand total, total owed, and rounding recipient/reason; V07-B01 and V12 are both required evidence routes.

### Component

- Add/remove/reorder participants and items, payer changes, share/exclusion state, mode switching, validation summary and field association.
- Result invalidation immediately after every input mutation.
- Dialog cancel/confirm, focus return, live-region announcements, copy/share success/failure/cancel.
- Persistence parse/write/quota/schema errors with mocked storage; no original-byte overwrite.
- Unicode names/labels including composed/decomposed characters, RTL text, emoji, markup-like canaries, and line-break/control-character sanitization for copied text.

### Browser/e2e

- F1–F4 through visible controls without direct state injection.
- Reload/restart draft, exact copied text, destructive scopes, navigation at `/split-snap/`.
- Projects: Playwright bundled Chromium, Firefox, WebKit desktop; Chromium Pixel 7 and WebKit iPhone 13 emulation for layout/input. Do not describe emulation as real-device installation proof.
- Each test starts with isolated storage unless persistence is the subject; no retries locally or in CI for deterministic suites. A retry-only pass is FAIL/flaky and blocks the gate.

### Offline/update/installability

- Serve production `dist/` on localhost; complete one controlled online load; assert service-worker control; disable network with `context.setOffline(true)`; close/reopen; create/edit/calculate/copy/clear and restore F1.
- Simulate v1 → v2 build: hold an unsaved edit, expose waiting worker, reject update and prove old UI/draft remain; accept only after save, reload under new controller, prove exact draft bytes/values remain.
- Inject incompatible/corrupt draft and prove it is not overwritten before explicit deletion.
- Parse manifest and assert base/scope/start URL/display/name/icons. Fetch root, manifest, service worker, every precache entry, and each icon with status 200; decode icons and assert dimensions/purpose.
- Manual launch matrix records date and exact versions: current stable Chrome on Android (install + standalone + offline), current stable Safari on iOS (Add to Home Screen + standalone + offline), current stable Chrome/Edge/Firefox/Safari desktop core flow. Firefox desktop installability is not claimed.

### Accessibility

- Axe scans initial, validation, itemized, calculated result, share preview, delete dialog, storage error, and update prompt states against WCAG 2.2 A/AA tags where supported; zero violations is necessary, not sufficient.
- Keyboard-only F1 and F4, no trap, logical focus, focus after add/remove/dialog, visible focus, skip/heading structure.
- Manual VoiceOver/Safari and TalkBack/Chrome complete F1; verify names/roles/values, share groups, errors, changed results, and rounding announcement.
- 320 CSS px, 200% text zoom, portrait/landscape, reduced motion, contrast, 44×44 targets, no color/icon/position-only meaning.

### Privacy canary and build

- Canary participant `<img src=x onerror=...> Éva 🧳`, label `¤CANARY`, and amount `987654.321`; observe every request URL, app-controlled header/body, console call, beacon, WebSocket/EventSource construction, and clipboard method. No canary may leave the page except explicit write/share text.
- Allow only same-origin GETs for the Pages root, hashed JS/CSS, manifest, icons, and service-worker resources. Fail any unexpected host, method, request body, analytics identifier, source map upload, or remote font/script.
- Scan source and `dist/` for forbidden absolute remote URLs, tracking SDK names, secrets/key patterns, `dangerouslySetInnerHTML`, clipboard read, and networking APIs; explicitly allow only documented source citations outside shipped `dist/`.
- A release workflow builds exactly once. Its sealed tree digest identifies the only artifact eligible for browser/static/release validation and Pages packaging; timestamp or tool-metadata variation cannot justify a rebuild substitution because no second build is permitted in that run.
- Run `npm audit --audit-level=high` while registry access is available. A high/critical production-path advisory is a release blocker; inability to reach the registry is recorded separately and cannot be reported as PASS.

### Post-build moderated AC-U01–AC-U05 gate

This human gate runs against the exact production artifact after `npm run verify` and before any public deployment. Developers, the writer, synthetic agents, automated browsers, and anyone who saw the implementation are ineligible as participants.

Participants:

- Recruit five target coordinators `C01`–`C05` who have recently split a traveler/friend bill and can use a phone; record only eligibility booleans, not names/contact details.
- Recruit five separate recipient participants `R01`–`R05` who did not see the app or coordinator task. Pair `C01→R01` through `C05→R05`.
- Obtain consent to observe task outcomes without audio/video recording or real bill data. All work uses canonical F1 only.

Preparation and identity binding:

1. Build the exact source revision and compute the sorted `dist-tree-manifest.txt` plus its SHA-256 as defined in Section 7.
2. Run `npm run validate:moderated -- --init --fixture F1 --source-sha "$SOURCE_SHA" --dist-sha "$DIST_TREE_SHA256"`. This creates empty schema-valid templates only; it cannot mark outcomes PASS.
3. Each phone first receives one successful online load of that artifact. Record device, OS, browser/version, UTC session date, source SHA, dist-tree SHA-256, problem digest, plan digest, and fixture ID.
4. Give every coordinator the same printed F1 input packet from this plan and exactly this prompt: `Use SplitSnap to split this bill, check the result, and copy the result text. Tell me when you are done. I cannot explain the interface or the math during the task.`

Timing and assistance:

- Start a monotonic timer when the coordinator can see both the prompt and initial app screen; stop when the copied-text success state appears and the coordinator says done.
- “Unassisted” permits rereading the standard prompt only. Any hint about control location, sequence, values, arithmetic, correction, or expected output sets `assisted=true`; technical interruption not caused by the participant invalidates and reruns that session with a fresh participant rather than pausing the timer.
- The observer records entered/calculated/copy output mechanically against F1 and does not repair it. A session cannot be repeated to replace a genuine user failure.

Ordered protocol:

1. **AC-U01:** C01–C05 perform F1 online. PASS requires at least four sessions with `assisted=false`, `duration_ms <= 180000`, and correct copied result.
2. **AC-U02:** Without teaching, each coordinator answers: payer; Bo owed amount; Cy owed amount; why Cy received `+0.01`. All five calculated allocations must sum to `29.54`; at least four must answer every comprehension item correctly.
3. **AC-U03:** Give each paired recipient only that coordinator’s copied plaintext. Ask recipient to state payer, each non-payer’s owed amount, grand total, and rounding recipient/reason. At least four of five recipients must reconstruct every answer correctly; app view or hints are forbidden.
4. **AC-U04:** Restore the exact artifact to C01–C05, confirm service-worker control from the prior online load, then disable connectivity before reopening. Each coordinator must reopen, clear/recreate F1, calculate, review, copy, and explain that browser/site-data clearing or device/profile loss has no backup. PASS requires all five complete the offline flow and answer the no-backup question correctly.
5. **AC-U05:** The moderator evaluates every frozen success, falsification, and immediate-stop criterion from the problem definition using the recorded sessions. Record each criterion ID, observed count/evidence hash, outcome `pass|fail|inconclusive`, and rationale. Any immediate-stop trigger, any U01–U04 threshold miss, or missing evidence makes U05 FAIL; the “inconclusive” region remains non-PASS.

Evidence files contain no participant names, contacts, recordings, or real expenses:

```text
product/evidence/validation/protocol.json
product/evidence/validation/coordinators/C01.json ... C05.json
product/evidence/validation/recipients/R01.json ... R05.json
product/evidence/validation/falsification.json
product/evidence/validation/summary.json
```

Every coordinator JSON requires: schema version, anonymous ID, eligibility/consent booleans, fixture, source/plan/problem/dist digests, device/browser fields, UTC date, monotonic duration, assistance boolean/reason, calculated values, copied-text SHA-256, four comprehension booleans, offline steps, no-backup answer, observer ID, and record SHA-256. Recipient JSON requires the corresponding copied-text hash, blinded boolean, answers, correctness booleans, assistance boolean, and record SHA-256. `summary.json` lists every evidence path/hash, raw pass counts, each AC-U verdict, all stop/falsification verdicts, and overall `PASS|FAIL|INCONCLUSIVE`.

Run `npm run validate:moderated -- --check product/evidence/validation/summary.json`. It must reject missing/duplicate IDs, PII fields, digest drift, wrong fixture/output, assisted sessions counted as U01/U03 success, duration overflow, threshold mismatch, unhashed records, or any non-PASS criterion. The deployment validation job reruns this command against the exact sealed `dist_tree_sha256` downloaded from `build_once`; it cannot rebuild or substitute bytes.

**Launch stop:** `overall` must be exactly `PASS` and every AC-U01–U05 result must be `PASS`. `FAIL`, `INCONCLUSIVE`, missing evidence, mismatched source/dist digest, or any falsification trigger prevents the Pages packaging/deploy jobs from running. Only after this gate may workflow state claim `problem_validated: true`.

## 7. GitHub Pages CI/CD and launch verification

### One same-revision workflow

Use one `.github/workflows/pages.yml`; do not create an independent deploy workflow. It runs tests/builds on pull requests and default-branch pushes, but deployment is possible only through an explicit `workflow_dispatch` input `deploy=true` after moderated evidence exists. `concurrency: pages-production` permits only one package/deploy/recovery chain at a time.

The exact job DAG is:

```text
resolve_source
  └─ source_checks
       └─ build_once
            └─ verify_dist
                 └─ validation
                      └─ package_pages
                           └─ deploy
                                └─ live_verify
```

Every displayed arrow is a GitHub Actions `needs` edge; in addition to the displayed deploy edge, `live_verify` has `needs: [deploy, validation]` so it can consume the validated digest/receipts directly. There is no `workflow_run`, cross-workflow artifact lookup, branch-status polling, or “latest successful” query.

1. `resolve_source` sets immutable outputs `source_sha`, `mode`, and optional `expected_dist_sha256`. Normal test/release mode requires `source_sha == github.sha`. Recovery mode accepts only an owner/maintainer-dispatched 40-hex SHA and expected digest found in the current known-good ledger. It rejects a branch/tag name or unresolved SHA.
2. `source_checks` needs `resolve_source`, checks out exactly `needs.resolve_source.outputs.source_sha`, verifies `git rev-parse HEAD` equality, runs `npm ci` and `npm run check:source`, and receives `contents: read` only. It neither creates nor consumes `dist/`.
3. `build_once` needs `source_checks`, independently checks out that same exact SHA, verifies equality, runs `npm ci`, invokes `npm run build` exactly once, and invokes `seal:dist` without changing `dist/`. It writes a bytewise sorted sidecar `dist-tree-manifest.txt` with `<sha256><two spaces><relative path><LF>` for every final file in `dist/`; the SHA-256 of that manifest is `dist_tree_sha256`. It uploads one immutable internal artifact named `split-snap-dist-<source_sha>-<dist_tree_sha256>` containing `dist/`, the sidecar, and metadata `{source_sha, lockfile_sha256, problem_digest, plan_digest, dist_tree_sha256}`. No later job runs a build.
4. `verify_dist` needs `build_once`, downloads that exact artifact by the same-run content-addressed name into a clean directory, recomputes every file and tree digest, installs locked test tooling/Playwright browsers without lifecycle scripts that mutate `dist/`, and runs `verify:dist -- --dir <downloaded-dist> --sha <dist_tree_sha256>`. Thus every static scan and every Chromium/Firefox/WebKit/mobile-emulation e2e, offline, installability, accessibility, privacy-canary, and build-resource test exercises the exact immutable bytes. It recomputes the tree after all tests, emits a signed-by-workflow verification receipt with each suite result, and fails if any file changed. It never builds.
5. `validation` needs `verify_dist`, downloads the same artifact by the exact name forwarded in the verification receipt, recomputes it, and requires every browser/static suite in that receipt to be PASS for the same `source_sha` and `dist_tree_sha256`. On `deploy=true, mode=release`, it runs `validate:moderated` and requires every U gate PASS with that exact digest. On `mode=rollback`, it validates the content-addressed known-good receipt and schema/cache compatibility. On PR/push it emits `deploy_allowed=false`. It never builds.
6. `package_pages` needs `validation`, is conditioned on `workflow_dispatch && deploy == true && validation.deploy_allowed == true`, downloads that exact content-addressed internal artifact, recomputes the tree and metadata once more, asserts the `verify_dist` and validation receipts name the same digest, and invokes pinned `actions/upload-pages-artifact` directly on the downloaded `dist/`. It must not run install, build, transform, minify, copy-over, or generate steps; the directory hash before and after Pages packaging must remain `dist_tree_sha256`.
7. `deploy` needs `package_pages`, uses the protected `github-pages` environment and pinned `actions/deploy-pages`, and has only `contents: read`, `pages: write`, and `id-token: write`. It outputs the actual `page_url`.
8. `live_verify` needs both `deploy` and `validation`, downloads the same sidecar/receipts, fetches every listed live path from `page_url`, hashes response bytes, and requires the live tree to equal the already browser-tested and packaged `dist_tree_sha256` before running HTTP/UI/offline smoke. It records source SHA, internal artifact name/digest, verification receipt, Pages deployment ID/URL, and workflow run ID.

GitHub expressions/conditions receive automated tests that render the job graph for PR, push, release dispatch, and rollback dispatch. Deployment jobs must be absent for PR/push and cannot execute when any needed job is skipped/failed, any digest differs, or moderated/known-good validation is non-PASS.

The Node LTS and all third-party Actions are pinned. Failure-only test evidence has bounded retention and canonical fixtures only. The internal dist artifact is retained long enough for incident diagnosis. A recovery run may build its selected known-good source exactly once, but all checks and packaging in that recovery run consume only that one artifact and require its digest to equal the known-good receipt.

Required static artifact checks before upload:

- no symlink/hardlink, source map, test artifact, environment file, source document, or bill fixture containing realistic PII;
- every HTML/manifest/icon/service-worker/hashed asset reference stays under `/split-snap/` and exists in `dist/`;
- CSP meta present; manifest and icons valid; service worker has the expected scope; no cross-origin shipped resource;
- `dist/index.html` and every precache entry are nonempty.

### Live launch evidence

Derive `PAGES_URL` from the Pages deployment output and require:

```text
curl -fsS -o /dev/null -w '%{http_code}\n' "$PAGES_URL"
```

Expected output: exactly `200`.

Then run:

```text
BASE_URL="$PAGES_URL" npm run test:e2e -- --grep @live-smoke --project=chromium
```

Before browser smoke, `scripts/verify-live-artifact.mjs` fetches every relative path in the same-run `dist-tree-manifest.txt` and requires every byte hash plus the manifest digest to match the build output. The live browser smoke must then observe HTTP 200 for root/manifest/icons/service worker, visible `SplitSnap` heading, Quick total and Itemized controls, ability to enter two participants and calculate a known exact result, reload under `/split-snap/`, service-worker control, and offline reopen. A curl-only, source-only, or UI-only result is not launch verification.

Record deployed source SHA, dist-tree manifest/digest, internal artifact name, Pages workflow run/deployment URL, UTC time, exact browser version, HTTP result, live-byte result, core UI result, privacy request allowlist result, and offline result. Do not claim launch complete until all are PASS on that exact deployed artifact.

### Known-good recovery: rollback or fix-forward

A failed `live_verify`, material post-launch calculation/privacy/storage/offline defect, or bad service-worker update opens an incident and freezes further ordinary deployment. It does not authorize automatic rollback.

Known-good provenance:

- After a release passes every live gate, record `product/evidence/releases/known-good/<source_sha>.json` containing source SHA, lockfile SHA-256, problem/plan digests, dist-tree manifest SHA-256 and full manifest, Pages run/deployment IDs, live evidence hashes, draft schema written/read versions, service-worker scope/cache namespace, and UTC PASS time.
- A known-good entry is eligible only when its own record hash is in the release ledger and its recorded `live_verify` was unconditional PASS. “Previous commit,” latest artifact, tag name, or human recollection is not sufficient.
- Keep generated caches revisioned and bill-free. All releases must preserve unknown/newer localStorage bytes without overwrite and declare `reads_schema_versions` and `writes_schema_version`.

Owner/incident lead chooses one path and records the decision/rationale:

1. **Rollback** only if an eligible known-good entry exists, rebuilding it is byte-tree reproducible, and its reader supports the schema the bad release may have written. Trigger:

   ```text
   gh workflow run pages.yml --ref main -f deploy=true -f mode=rollback -f source_sha=<known-good-40hex> -f expected_dist_sha256=<known-good-dist-tree-sha256>
   ```

   `resolve_source` binds that exact SHA; the same `source_checks → build_once → verify_dist → validation → package_pages → deploy → live_verify` chain runs. The one build must equal the recorded known-good tree digest, and the exact bytes must pass all browser/static checks before packaging. Do not clear/unregister service workers, caches, or localStorage on user devices. The rollback worker may replace static caches only after activation; it must retain the same `/split-snap/` scope and leave `split-snap:v*` data untouched. Unknown schema remains preserved with a recovery-safe message.

2. **Fix-forward** is mandatory when no eligible artifact exists, rebuild bytes differ, rollback cannot safely read/preserve the latest written schema, or the defect involves a migration/cache rule that rollback would worsen. Add the smallest test-first repair on a new source revision; rerun all impacted behavior packets, `npm run verify`, the full moderated AC-U01–U05 gate for any user-visible/calculation/storage/privacy/accessibility change, and the normal release workflow. The fix must read both old and current valid schemas or preserve unsupported raw bytes; migrations are additive/copy-before-switch and never delete the prior draft on first read.

After either path, recovery is incomplete until the same live artifact-byte check, root/resource HTTP 200, core calculation UI, privacy canary allowlist, service-worker control, and offline close/reopen gates PASS. Record a recovery receipt linking incident, bad deployment SHA/digest, chosen path, recovered SHA/digest, compatibility decision, workflow/deployment IDs, and all live evidence hashes. Only then mark the recovered deployment known-good and close the incident.

If rollback deployment or post-rollback live verification fails, do not retry with another unverified historical revision and do not clear client data. Keep the incident open, report the still-serving revision, and use fix-forward. Any schema ambiguity or evidence gap is a stop, not permission to guess.

## 8. Acceptance trace

| Problem requirement | Primary slices | Required evidence |
|---|---|---|
| Target/JTBD, 2–8 people, one payer | V01, V03, V12 | Component and canonical e2e journey. |
| Arbitrary label, precision 0–3, Unicode | V02, V07, V11 | Parser matrix, Unicode component/e2e, privacy canary. |
| Quick/itemized, exclusions, positive integer shares | V03–V05 | F1–F4 plus generated invariant matrix. |
| Positive pre-tax gate and exact messages | V04, V05 | Quick/itemized zero with zero/positive fixed additions. |
| Fixed/percent tax/tip and half-up rounding | V04, V05 | Boundary unit tests, F1/F3. |
| Exact totals, largest remainder, visible tie | V04–V06 | Domain 100% coverage, F1–F3, repeated output. |
| Inspectable payer/owed/rounding result | V06, V12 | Result component and e2e assertions. |
| Copy/share plaintext | V07-B01, V11, V12 | Byte-exact F1/F2/F3 label/precision, payer, allocations/owed, total and rounding reconstruction; identical preview/clipboard/share payloads. |
| Local persistence and deletion | V08, V10 | Reload/restart, incompatible draft, confirmed scopes. |
| Privacy/no account/backend/payment | V07, V08, V11 | Request canary, build scan, permission/API assertions. |
| Offline/install/update safety | V10, V13 | Controlled offline restart, v1→v2 prompt, manifest/icon checks, real devices, live smoke. |
| Responsive/WCAG 2.2 AA | V09, V12 | Axe states plus keyboard, screen reader, reflow, zoom, contrast, target manual evidence. |
| Determinism/no stale result | V02–V06, V12 | Pure domain matrix, repeat runs, edit invalidation. |
| Problem validation AC-U01–U05 | Post-build moderated gate | Five coordinators, five blinded recipients, exact F1, hashed evidence, literal all-PASS launch stop. |
| GitHub Pages `/split-snap/` | V10, V13 | Same-run build-once/source/dist DAG, exact artifact browser/static receipt and Pages package, live tree hash, HTTP 200, browser core UI/privacy/offline. |
| Bad deployment recovery | Pages recovery packet | Content-addressed known-good rollback or compatible test-first fix-forward plus repeated live gates. |

The detailed AC-C/P/O/X/U mapping is in `product/implementation-plan-review-packet.md` and is normative for plan review.

## 9. Stop and escalation conditions

Stop implementation or launch and return to the applicable review gate when:

- the problem digest or either plan artifact changes after freeze;
- a RED test passes before behavior, fails for an unrelated reason, or lacks an observable assertion;
- exact arithmetic would require `number`, an unspecified allocation rule, or a different rounding/tie policy;
- a requested behavior requires backend, account, sync, payment, FX, OCR, analytics, remote code/font, secret, or paid service;
- localStorage cannot meet O3/O5 without changing the frozen product contract;
- service-worker activation can lose/overwrite a valid draft or force reload without explicit acceptance;
- any canary data leaves through a request/log or any unexpected third-party host appears;
- a high/critical production-path dependency advisory has no reviewed mitigation;
- browser behavior prevents required offline/installability on a claimed target;
- keyboard, screen-reader, reflow, contrast, or destructive-control acceptance fails;
- any moderated AC-U result is FAIL/INCONCLUSIVE/missing, or its source/dist/evidence digest differs;
- any same-run source, internal artifact, dist-tree, Pages live byte, or `needs` dependency check differs;
- GitHub Pages cannot serve the build at `/split-snap/`, any live resource is non-200, or core UI/offline smoke fails;
- rollback target lacks an unconditional known-good receipt, reproducible tree digest, or schema/cache compatibility;
- external configuration, Pages enablement, repository visibility, environment approval, or publication needs owner/admin action not already provided;
- tests are flaky, skipped, conditionally waived, retry-only green, or not run on the exact candidate revision.

No condition may be handled by silently broadening scope or lowering an acceptance criterion. Definition ambiguity returns to problem definition; plan ambiguity returns to plan review; implementation defect stays in TDD; external authority/configuration is reported as a blocker with exact evidence.

## 10. Completion boundary

This plan is ready for content-addressed review only when its freeze file reproduces. A 3/3 plan PASS authorizes implementation to begin under the owner’s existing authorization; it does not itself prove implementation, accessibility, privacy, offline behavior, deployment, HTTP 200, or launch completion.
