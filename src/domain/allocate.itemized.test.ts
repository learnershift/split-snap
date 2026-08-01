import { expect, it } from 'vitest'

import { allocateItemEntitlements, allocateItemRationalEntitlements } from './allocate.itemized'

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
