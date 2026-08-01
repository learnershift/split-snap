import { expect, it } from 'vitest'

import { normalizeRational } from './rational'

it('V02-B06 normalizes exact bigint rationals', () => {
  expect(normalizeRational(6n, 8n)).toEqual({ numerator: 3n, denominator: 4n })
  expect(normalizeRational(-6n, -8n)).toEqual({ numerator: 3n, denominator: 4n })
  expect(normalizeRational(6n, -8n)).toEqual({ numerator: -3n, denominator: 4n })
  expect(() => normalizeRational(1n, 0n)).toThrow(RangeError)
})
