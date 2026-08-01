import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { Results } from './Results'

it('V06-B02 shows every required total payer allocation and owed value', () => {
  render(<Results
    allocations={[748n, 1398n, 808n]}
    grandTotalUnits={2954n}
    owedUnits={[0n, 1398n, 808n]}
    payerName="Ana"
    precision={2}
  />)

  expect(screen.getByText('Grand total: 29.54')).toBeVisible()
  expect(screen.getByText('Payer: Ana')).toBeVisible()
  expect(screen.getByText('Person 1 allocation: 7.48')).toBeVisible()
  expect(screen.getByText('Person 2 owed: 13.98')).toBeVisible()
})

it('V06-B03 identifies each reconciliation recipient', () => {
  render(<Results
    allocations={[34n, 33n, 33n]}
    grandTotalUnits={100n}
    owedUnits={[0n, 33n, 33n]}
    payerName="Dee"
    precision={0}
    recipientIndexes={[0]}
  />)

  expect(screen.getByText('Rounding: Person 1 received +1 unit.')).toBeVisible()
})
