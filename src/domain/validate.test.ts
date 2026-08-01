import { expect, it } from 'vitest'

import { parseShare } from './validate'

it('V03-B04 accepts only positive integer shares', () => {
  expect(parseShare('3')).toEqual({ ok: true, value: 3n })
  for (const value of ['0', '-1', '1.5', '', 'abc']) {
    expect(parseShare(value)).toEqual({ ok: false, code: 'share_positive_integer' })
  }
})
