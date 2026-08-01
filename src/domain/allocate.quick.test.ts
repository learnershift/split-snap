import { expect, it } from 'vitest'

import { calculateQuickSplit, decomposeQuickEntitlements, reconcileQuickEntitlements } from './allocate.quick'
import { normalizeRational } from './rational'

it('V04-B03 decomposes exact floors remainders and remaining-unit count', () => {
  expect(decomposeQuickEntitlements([
    normalizeRational(100n, 3n),
    normalizeRational(100n, 3n),
    normalizeRational(100n, 3n),
  ], 100n)).toEqual({
    baseUnits: [33n, 33n, 33n],
    discardedRemainders: [normalizeRational(1n, 3n), normalizeRational(1n, 3n), normalizeRational(1n, 3n)],
    remainingUnits: 1n,
  })
})

it('V04-B04 reconciles largest remainders with visible-order ties and reproduces F2', () => {
  const decomposition = decomposeQuickEntitlements([
    normalizeRational(100n, 3n),
    normalizeRational(100n, 3n),
    normalizeRational(100n, 3n),
  ], 100n)

  expect(reconcileQuickEntitlements(decomposition)).toEqual({
    allocations: [34n, 33n, 33n],
    recipientIndexes: [0],
  })

  expect(reconcileQuickEntitlements(decomposeQuickEntitlements([
    normalizeRational(1n, 3n),
    normalizeRational(1n, 2n),
  ], 1n))).toEqual({ allocations: [0n, 1n], recipientIndexes: [1] })
})

it('V04-B05 reproduces complete F3', () => {
  expect(calculateQuickSplit({ subtotalUnits: 1005n, shares: [1n, 1n], taxPercentage: 5n, fixedTipUnits: 10n }))
    .toEqual({ taxUnits: 50n, grandTotalUnits: 1065n, allocations: [533n, 532n], recipientIndexes: [0] })
})
