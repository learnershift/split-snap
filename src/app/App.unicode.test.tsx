import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'

import { sameParticipantName } from '../domain/text'
import '../main'

it('V02-B07 enforces Unicode label and name limits safely', async () => {
  const user = userEvent.setup()
  const label = '<b>💴</b>12345'
  const name = '😀'.repeat(41)

  await user.type(screen.getByRole('textbox', { name: 'Monetary label' }), label)
  await user.clear(screen.getByRole('textbox', { name: 'Participant 1 name' }))
  await user.type(screen.getByRole('textbox', { name: 'Participant 1 name' }), name)

  expect(screen.getByText('Monetary label: <b>💴</b>1234')).toBeVisible()
  expect(screen.queryByRole('strong')).not.toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Participant 1 name' })).toHaveValue('😀'.repeat(40))
  expect(sameParticipantName('  e\u0301 ', 'é')).toBe(true)
})
