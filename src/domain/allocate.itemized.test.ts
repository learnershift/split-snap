import { expect, it } from 'vitest'

import { allocateItemEntitlements } from './allocate.itemized'

it('V03-B05 gives a participant excluded from one item zero entitlement to that item', () => {
  expect(allocateItemEntitlements(900n, [
    { included: true, share: 1n },
    { included: false, share: 0n },
  ])).toEqual([900n, 0n])
})
