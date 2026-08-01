import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'

import { Persistence } from './PersistenceView'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

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

it('V08-B05 confirms deletion of every SplitSnap local key', async () => {
  const user = userEvent.setup()
  localStorage.setItem('split-snap:v1:draft', 'draft')
  localStorage.setItem('split-snap:v1:preferences', 'preferences')
  localStorage.setItem('split-snap:older-key', 'older')
  localStorage.setItem('unrelated-key', 'keep')

  render(<Persistence />)
  await user.click(screen.getByRole('button', { name: 'Delete all local data' }))
  expect(screen.getByRole('dialog', { name: 'Confirm delete all local data' })).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Confirm delete all local data' }))

  expect(localStorage.getItem('split-snap:v1:draft')).toBeNull()
  expect(localStorage.getItem('split-snap:v1:preferences')).toBeNull()
  expect(localStorage.getItem('split-snap:older-key')).toBeNull()
  expect(localStorage.getItem('unrelated-key')).toBe('keep')
})
