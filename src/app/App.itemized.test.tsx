import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import '../main'

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
