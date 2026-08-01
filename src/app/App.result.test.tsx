import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import '../main'

it('V06-B01 invalidates result after every input edit', async () => {
  const user = userEvent.setup()

  await user.type(screen.getByRole('textbox', { name: 'Pre-tax total' }), '12')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))
  expect(screen.getByRole('status')).toBeVisible()

  await user.type(screen.getByRole('textbox', { name: 'Monetary label' }), 'USD')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
