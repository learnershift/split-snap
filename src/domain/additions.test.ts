import { expect, it } from 'vitest'

import { addFixedAdditions } from './additions'

it('V04-B01 adds fixed tax and tip in integer units', () => {
  expect(addFixedAdditions(1000n, 75n, 25n)).toEqual({ taxUnits: 75n, tipUnits: 25n, grandTotalUnits: 1100n })
})
