import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from 'vitest'

import { App } from './App'

beforeEach(() => {
  document.body.innerHTML = ''
  render(<App />)
})

it('V05-B01 adds item rows and sums subtotal', async () => {
  const user = userEvent.setup()

  await user.click(screen.getByRole('button', { name: 'Add item' }))
  await user.type(screen.getByRole('textbox', { name: 'Item 1 description' }), 'Noodles')
  await user.type(screen.getByRole('textbox', { name: 'Item 1 amount' }), '10')

  await user.click(screen.getByRole('button', { name: 'Add item' }))
  await user.type(screen.getByRole('textbox', { name: 'Item 2 description' }), 'Soup')
  await user.type(screen.getByRole('textbox', { name: 'Item 2 amount' }), '5')

  expect(screen.getByText('Subtotal: 15')).toBeVisible()
})

it('completes the itemized F1 controls with exact visible allocations', async () => {
  const user = userEvent.setup()

  await user.selectOptions(screen.getByRole('combobox', { name: 'Mode' }), 'itemized')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Decimal precision' }), '2')
  await user.type(screen.getByRole('textbox', { name: 'Monetary label' }), 'USD')
  await user.clear(screen.getByRole('textbox', { name: 'Participant 1 name' }))
  await user.type(screen.getByRole('textbox', { name: 'Participant 1 name' }), 'Ana')
  await user.clear(screen.getByRole('textbox', { name: 'Participant 2 name' }))
  await user.type(screen.getByRole('textbox', { name: 'Participant 2 name' }), 'Bo')
  await user.click(screen.getByRole('button', { name: 'Add participant' }))
  await user.clear(screen.getByRole('textbox', { name: 'Participant 3 name' }))
  await user.type(screen.getByRole('textbox', { name: 'Participant 3 name' }), 'Cy')

  for (const [number, description, amount] of [[1, 'Noodles', '10.00'], [2, 'Curry', '11.00'], [3, 'Tea', '4.00']] as const) {
    await user.click(screen.getByRole('button', { name: 'Add item' }))
    await user.type(screen.getByRole('textbox', { name: `Item ${number} description` }), description)
    await user.type(screen.getByRole('textbox', { name: `Item ${number} amount` }), amount)
  }
  await user.click(screen.getByRole('checkbox', { name: 'Item 1 include Cy' }))
  await user.click(screen.getByRole('checkbox', { name: 'Item 2 include Ana' }))
  await user.clear(screen.getByRole('textbox', { name: 'Tax percentage' }))
  await user.type(screen.getByRole('textbox', { name: 'Tax percentage' }), '8')
  await user.clear(screen.getByRole('textbox', { name: 'Fixed tip' }))
  await user.type(screen.getByRole('textbox', { name: 'Fixed tip' }), '2.54')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('status')).toHaveTextContent('Ana: 7.48')
  expect(screen.getByRole('status')).toHaveTextContent('Bo: 13.98')
  expect(screen.getByRole('status')).toHaveTextContent('Cy: 8.08')
  expect(screen.getByRole('status')).toHaveTextContent('Grand total: 29.54')
  expect(screen.getByRole('status')).toHaveTextContent('Payer: Ana')
  expect(screen.getByRole('status')).toHaveTextContent('Ana owed: 0.00')
  expect(screen.getByRole('status')).toHaveTextContent('Bo owed: 13.98')
})

it('blocks an included item participant with a non-positive share', async () => {
  const user = userEvent.setup()
  await user.selectOptions(screen.getByRole('combobox', { name: 'Mode' }), 'itemized')
  await user.click(screen.getByRole('button', { name: 'Add item' }))
  await user.type(screen.getByRole('textbox', { name: 'Item 1 amount' }), '1')
  await user.clear(screen.getByRole('textbox', { name: 'Item 1 share Person 1' }))
  await user.type(screen.getByRole('textbox', { name: 'Item 1 share Person 1' }), '0')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('alert')).toHaveTextContent('Enter a positive integer share for every included person.')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

it('blocks a zero itemized subtotal even when a fixed tip is present', async () => {
  const user = userEvent.setup()
  await user.selectOptions(screen.getByRole('combobox', { name: 'Mode' }), 'itemized')
  await user.clear(screen.getByRole('textbox', { name: 'Fixed tip' }))
  await user.type(screen.getByRole('textbox', { name: 'Fixed tip' }), '1')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('alert')).toHaveTextContent('Add or update items so the pre-tax subtotal is greater than 0.')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
