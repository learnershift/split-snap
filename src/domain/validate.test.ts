import { expect, it } from 'vitest'

import { parseShare } from './validate'
import { validateQuickSubtotal } from './validate'

it('V03-B04 accepts only positive integer shares', () => {
  expect(parseShare('3')).toEqual({ ok: true, value: 3n })
  for (const value of ['0', '-1', '1.5', '', 'abc']) {
    expect(parseShare(value)).toEqual({ ok: false, code: 'share_positive_integer' })
  }
})

it('V04-B06 blocks zero quick subtotal despite fixed addition', () => {
  expect(validateQuickSubtotal(0n, 10n)).toEqual({ ok: false, message: 'Enter a pre-tax total greater than 0.' })
})
