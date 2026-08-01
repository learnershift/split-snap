import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import '../main'

it('V03-B01 enforces two through eight participants', async () => {
  const user = userEvent.setup()

  await user.click(screen.getByRole('button', { name: 'Remove participant' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Use between 2 and 8 participants.')

  for (let count = 0; count < 6; count += 1) {
    await user.click(screen.getByRole('button', { name: 'Add participant' }))
  }

  expect(screen.getAllByRole('textbox', { name: /Participant \d+ name/ })).toHaveLength(8)
  await user.click(screen.getByRole('button', { name: 'Add participant' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Use between 2 and 8 participants.')
})
