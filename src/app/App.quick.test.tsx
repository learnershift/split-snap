import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import '../main'

it('V01-B01 renders the semantic mobile shell', () => {
  expect(screen.getByRole('heading', { name: 'SplitSnap' })).toBeVisible()
  expect(screen.getByRole('main', { name: 'SplitSnap bill' })).toBeVisible()
  expect(screen.getByRole('form', { name: 'Bill details' })).toBeVisible()
})

it('V01-B02 completes a two-person equal quick split', async () => {
  const user = userEvent.setup()

  await user.type(screen.getByRole('textbox', { name: 'Pre-tax total' }), '12')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('status')).toHaveTextContent('Person 1: 6')
  expect(screen.getByRole('status')).toHaveTextContent('Person 2: 6')
})

it('V01-B03 selects payer label and precision', async () => {
  const user = userEvent.setup()

  await user.selectOptions(screen.getByRole('combobox', { name: 'Payer' }), 'Person 2')
  await user.type(screen.getByRole('textbox', { name: 'Monetary label' }), 'USD')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Decimal precision' }), '2')

  expect(screen.getByText('Payer: Person 2')).toBeVisible()
  expect(screen.getByText('Monetary label: USD')).toBeVisible()
  expect(screen.getByText('Decimal precision: 2')).toBeVisible()
})

it('uses positive quick shares in the exact allocation', async () => {
  const user = userEvent.setup()
  await user.clear(screen.getByRole('textbox', { name: 'Pre-tax total' }))
  await user.type(screen.getByRole('textbox', { name: 'Pre-tax total' }), '9')
  await user.clear(screen.getByRole('textbox', { name: 'Quick share Person 1' }))
  await user.type(screen.getByRole('textbox', { name: 'Quick share Person 1' }), '2')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('status')).toHaveTextContent('Person 1: 6')
  expect(screen.getByRole('status')).toHaveTextContent('Person 2: 3')
})

it('uses exact quick allocation for F2 visible-order rounding', async () => {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: 'Add participant' }))
  await user.clear(screen.getByRole('textbox', { name: 'Quick share Person 1' }))
  await user.type(screen.getByRole('textbox', { name: 'Quick share Person 1' }), '1')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Decimal precision' }), '0')
  await user.clear(screen.getByRole('textbox', { name: 'Pre-tax total' }))
  await user.type(screen.getByRole('textbox', { name: 'Pre-tax total' }), '100')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Payer' }), 'Person 3')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('status')).toHaveTextContent('Person 1: 34')
  expect(screen.getByRole('status')).toHaveTextContent('Person 2: 33')
  expect(screen.getByRole('status')).toHaveTextContent('Person 3: 33')
})

it('blocks a zero quick subtotal even when a fixed tip is present', async () => {
  const user = userEvent.setup()
  await user.clear(screen.getByRole('textbox', { name: 'Pre-tax total' }))
  await user.type(screen.getByRole('textbox', { name: 'Pre-tax total' }), '0')
  await user.clear(screen.getByRole('textbox', { name: 'Fixed tip' }))
  await user.type(screen.getByRole('textbox', { name: 'Fixed tip' }), '1')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))

  expect(screen.getByRole('alert')).toHaveTextContent('Enter a pre-tax total greater than 0.')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
