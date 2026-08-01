import { expect, it } from 'vitest'

import { restoreDraft, saveDraft, serializeDraft } from './persistence'

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

it('V08-B02 preserves prior bytes on write or quota failure', () => {
  const priorBytes = '{"prior":"draft"}'
  const storage = {
    getItem: () => priorBytes,
    setItem: () => { throw new DOMException('quota', 'QuotaExceededError') },
  }

  expect(saveDraft(storage, {
    monetaryLabel: 'USD', precision: 2, participants: ['Ana', 'Bo'], preTaxTotalUnits: 2500n,
  })).toEqual({ ok: false, priorBytes })
})

it('V08-B03 retains corrupt or unknown-schema bytes', () => {
  const corruptBytes = '{not-json'
  const unknownBytes = '{"schemaVersion":2,"inputs":{}}'

  expect(restoreDraft(corruptBytes)).toEqual({ ok: false, code: 'draft_unreadable', originalBytes: corruptBytes })
  expect(restoreDraft(unknownBytes)).toEqual({ ok: false, code: 'draft_unreadable', originalBytes: unknownBytes })
})
