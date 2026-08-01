import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import { Persistence } from './PersistenceView'

it('V08-B04 confirms start over and clears only active draft', async () => {
  const user = userEvent.setup()
  localStorage.setItem('split-snap:v1:draft', 'draft')
  localStorage.setItem('split-snap:v1:preferences', 'preferences')

  render(<Persistence />)
  await user.click(screen.getByRole('button', { name: 'Start over' }))
  expect(screen.getByRole('dialog')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Confirm start over' }))

  expect(localStorage.getItem('split-snap:v1:draft')).toBeNull()
  expect(localStorage.getItem('split-snap:v1:preferences')).toBe('preferences')
})
