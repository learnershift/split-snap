import { expect, it } from 'vitest'

import {
  allocateItemEntitlements,
  allocateItemRationalEntitlements,
  calculateItemizedSplit,
} from './allocate.itemized'

it('V03-B05 gives a participant excluded from one item zero entitlement to that item', () => {
  expect(allocateItemEntitlements(900n, [
    { included: true, share: 1n },
    { included: false, share: 0n },
  ])).toEqual([900n, 0n])
})

it('V05-B02 allocates item shares and exclusions exactly', () => {
  expect(allocateItemRationalEntitlements(10n, [
    { included: true, share: 1n },
    { included: true, share: 2n },
    { included: false, share: 0n },
  ])).toEqual([
    { numerator: 10n, denominator: 3n },
    { numerator: 20n, denominator: 3n },
    { numerator: 0n, denominator: 1n },
  ])
})

it('V05-B03 reproduces complete F1', () => {
  expect(calculateItemizedSplit({
    items: [
      { units: 1000n, participants: [{ included: true, share: 1n }, { included: true, share: 1n }, { included: false, share: 0n }] },
      { units: 1100n, participants: [{ included: false, share: 0n }, { included: true, share: 1n }, { included: true, share: 1n }] },
      { units: 400n, participants: [{ included: true, share: 1n }, { included: true, share: 1n }, { included: true, share: 1n }] },
    ],
    taxPercentage: 8n,
    fixedTipUnits: 254n,
  })).toEqual({
    subtotalUnits: 2500n,
    taxUnits: 200n,
    tipUnits: 254n,
    grandTotalUnits: 2954n,
    allocations: [748n, 1398n, 808n],
    recipientIndexes: [2],
  })
})
