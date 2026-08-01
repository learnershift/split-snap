import { expect, it } from 'vitest'

import { restoreDraft, serializeDraft } from './persistence'

it('V08-B01 restores versioned draft inputs without derived result', () => {
  const bytes = serializeDraft({
    monetaryLabel: 'USD',
    precision: 2,
    participants: ['Ana', 'Bo'],
    preTaxTotalUnits: 2500n,
  })

  expect(bytes).toBe('{"schemaVersion":1,"inputs":{"monetaryLabel":"USD","precision":2,"participants":["Ana","Bo"],"preTaxTotalUnits":"2500"}}')
  expect(restoreDraft(bytes)).toEqual({
    ok: true,
    inputs: { monetaryLabel: 'USD', precision: 2, participants: ['Ana', 'Bo'], preTaxTotalUnits: 2500n },
  })
})
