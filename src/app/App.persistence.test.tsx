import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'

import { App } from './App'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

it('active bill autosaves and restores through the persistence API', async () => {
  const user = userEvent.setup()
  const first = render(<App />)

  await user.type(screen.getByLabelText('Pre-tax total'), '12')
  await user.type(screen.getByLabelText('Monetary label'), 'USD')
  await user.selectOptions(screen.getByLabelText('Decimal precision'), '2')
  await user.clear(screen.getByLabelText('Participant 1 name'))
  await user.type(screen.getByLabelText('Participant 1 name'), 'Ana')
  await user.clear(screen.getByLabelText('Participant 2 name'))
  await user.type(screen.getByLabelText('Participant 2 name'), 'Bo')

  expect(localStorage.getItem('split-snap:v1:draft')).toContain('"monetaryLabel":"USD"')
  first.unmount()
  render(<App />)

  expect(screen.getByLabelText('Pre-tax total')).toHaveValue('12.00')
  expect(screen.getByLabelText('Monetary label')).toHaveValue('USD')
  expect(screen.getByLabelText('Decimal precision')).toHaveValue('2')
  expect(screen.getByLabelText('Participant 1 name')).toHaveValue('Ana')
  expect(screen.getByLabelText('Participant 2 name')).toHaveValue('Bo')
})
