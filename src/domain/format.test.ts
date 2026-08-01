import { expect, it } from 'vitest'

import { formatUnits } from './format'

it('V02-B05 formats precision zero through three exactly', () => {
  expect(formatUnits(12n, 0)).toBe('12')
  expect(formatUnits(12n, 1)).toBe('1.2')
  expect(formatUnits(123n, 2)).toBe('1.23')
  expect(formatUnits(1005n, 3)).toBe('1.005')
})
