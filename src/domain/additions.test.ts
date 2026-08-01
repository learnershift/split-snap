import { expect, it } from 'vitest'

import { addFixedAdditions, calculatePercentageAddition } from './additions'

it('V04-B01 adds fixed tax and tip in integer units', () => {
  expect(addFixedAdditions(1000n, 75n, 25n)).toEqual({ taxUnits: 75n, tipUnits: 25n, grandTotalUnits: 1100n })
})

it('V04-B02 rounds exact percentage additions half upward', () => {
  expect(calculatePercentageAddition(1n, 49n)).toBe(0n)
  expect(calculatePercentageAddition(1n, 50n)).toBe(1n)
  expect(calculatePercentageAddition(1n, 51n)).toBe(1n)
})
