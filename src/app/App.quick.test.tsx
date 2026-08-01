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
