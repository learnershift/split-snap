import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from 'vitest'

import { App } from './App'

beforeEach(() => {
  document.body.innerHTML = ''
  render(<App />)
})

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

it('V03-B02 rejects blank and duplicate participant names', async () => {
  const user = userEvent.setup()
  const firstName = screen.getByRole('textbox', { name: 'Participant 1 name' })
  const secondName = screen.getByRole('textbox', { name: 'Participant 2 name' })

  await user.clear(firstName)
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Enter unique participant names.')

  await user.type(firstName, 'e\u0301')
  await user.clear(secondName)
  await user.type(secondName, 'é')
  await user.click(screen.getByRole('button', { name: 'Calculate split' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Enter unique participant names.')
})

it('V03-B03 preserves visible order and selected payer', async () => {
  const user = userEvent.setup()

  await user.click(screen.getByRole('button', { name: 'Add participant' }))
  await user.selectOptions(screen.getByRole('combobox', { name: 'Payer' }), 'Person 2')
  await user.click(screen.getByRole('button', { name: 'Move participant 2 down' }))

  expect(screen.getAllByRole('textbox', { name: /Participant \d+ name/ }).map((input) => input.getAttribute('value')))
    .toEqual(['Person 1', 'Person 3', 'Person 2'])
  expect(screen.getByRole('combobox', { name: 'Payer' })).toHaveValue('Person 2')
})
