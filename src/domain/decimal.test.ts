import { expect, it } from 'vitest'

import { parseDecimalToUnits, parseMoneyInput } from './decimal'

it('V02-B01 parses dot decimals directly to bigint units', () => {
  expect(parseDecimalToUnits('12.34', 2)).toBe(1234n)
  expect(parseDecimalToUnits('7', 3)).toBe(7000n)
})

it('V02-B02 normalizes one comma decimal separator', () => {
  expect(parseDecimalToUnits('12,34', 2)).toBe(1234n)
})

it('V02-B03 rejects mixed malformed exponent and signed money', () => {
  for (const value of ['1.2,3', '', '1e3', '-1', '+1']) {
    expect(parseMoneyInput(value, 2)).toEqual({ ok: false, code: 'amount_invalid' })
  }

  expect(parseMoneyInput('1.2', 2)).toEqual({ ok: true, units: 120n })
  expect(parseMoneyInput('7', 3)).toEqual({ ok: true, units: 7000n })
})

it('V02-B04 rejects over-precision without rounding', () => {
  expect(parseMoneyInput('9.999', 2)).toEqual({ ok: false, code: 'amount_over_precision' })
})
