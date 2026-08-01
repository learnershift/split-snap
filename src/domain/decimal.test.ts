import { expect, it } from 'vitest'

import { parseDecimalToUnits } from './decimal'

it('V02-B01 parses dot decimals directly to bigint units', () => {
  expect(parseDecimalToUnits('12.34', 2)).toBe(1234n)
  expect(parseDecimalToUnits('7', 3)).toBe(7000n)
})

it('V02-B02 normalizes one comma decimal separator', () => {
  expect(parseDecimalToUnits('12,34', 2)).toBe(1234n)
})
