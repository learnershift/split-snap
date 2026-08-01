import { expect, it } from 'vitest'

import { decomposeQuickEntitlements } from './allocate.quick'
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
