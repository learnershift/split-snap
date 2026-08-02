import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'

import { App } from './App'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

it('active bill autosaves and restores through the persistence API', async () => {
  const user = userEvent.setup()
  const first = render(<App />)

  await user.type(screen.getByLabelText('Pre-tax total'), '12')
  await user.type(screen.getByLabelText('Monetary label'), 'USD')
  await user.selectOptions(screen.getByLabelText('Decimal precision'), '2')
  await user.clear(screen.getByLabelText('Participant 1 name'))
  await user.type(screen.getByLabelText('Participant 1 name'), 'Ana')
  await user.clear(screen.getByLabelText('Participant 2 name'))
  await user.type(screen.getByLabelText('Participant 2 name'), 'Bo')

  expect(localStorage.getItem('split-snap:v1:draft')).toContain('"monetaryLabel":"USD"')
  first.unmount()
  render(<App />)

  expect(screen.getByLabelText('Pre-tax total')).toHaveValue('12.00')
  expect(screen.getByLabelText('Monetary label')).toHaveValue('USD')
  expect(screen.getByLabelText('Decimal precision')).toHaveValue('2')
  expect(screen.getByLabelText('Participant 1 name')).toHaveValue('Ana')
  expect(screen.getByLabelText('Participant 2 name')).toHaveValue('Bo')
})

it('restores positive quick shares with the active draft', async () => {
  const user = userEvent.setup()
  const first = render(<App />)
  await user.type(screen.getByLabelText('Pre-tax total'), '9')
  await user.clear(screen.getByLabelText('Quick share Person 1'))
  await user.type(screen.getByLabelText('Quick share Person 1'), '2')
  first.unmount()
  render(<App />)

  expect(screen.getByLabelText('Quick share Person 1')).toHaveValue('2')
})

it('restores mode, payer, item shares, and additions with the active draft', async () => {
  const user = userEvent.setup()
  const first = render(<App />)
  await user.type(screen.getByLabelText('Pre-tax total'), '4')
  await user.selectOptions(screen.getByLabelText('Mode'), 'itemized')
  await user.click(screen.getByRole('button', { name: 'Add item' }))
  await user.type(screen.getByLabelText('Item 1 description'), 'Tea')
  await user.type(screen.getByLabelText('Item 1 amount'), '4')
  await user.clear(screen.getByLabelText('Item 1 share Person 1'))
  await user.type(screen.getByLabelText('Item 1 share Person 1'), '2')
  await user.clear(screen.getByLabelText('Tax percentage'))
  await user.type(screen.getByLabelText('Tax percentage'), '8')
  await user.clear(screen.getByLabelText('Fixed tip'))
  await user.type(screen.getByLabelText('Fixed tip'), '1')
  await user.selectOptions(screen.getByLabelText('Payer'), 'Person 2')
  first.unmount()
  render(<App />)

  expect(screen.getByLabelText('Mode')).toHaveValue('itemized')
  expect(screen.getByLabelText('Item 1 description')).toHaveValue('Tea')
  expect(screen.getByLabelText('Item 1 share Person 1')).toHaveValue('2')
  expect(screen.getByLabelText('Tax percentage')).toHaveValue('8')
  expect(screen.getByLabelText('Fixed tip')).toHaveValue('1')
  expect(screen.getByLabelText('Payer')).toHaveValue('Person 2')
})

it('confirmed Start over clears the active in-memory bill as well as its draft', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Pre-tax total'), '12')
  await user.selectOptions(screen.getByLabelText('Mode'), 'itemized')
  await user.click(screen.getByRole('button', { name: 'Add item' }))
  await user.click(screen.getByRole('button', { name: 'Start over' }))
  await user.click(screen.getByRole('button', { name: 'Confirm start over' }))

  expect(screen.getByLabelText('Pre-tax total')).toHaveValue('')
  expect(screen.getByLabelText('Mode')).toHaveValue('quick')
  expect(screen.queryByLabelText('Item 1 amount')).not.toBeInTheDocument()
  expect(localStorage.getItem('split-snap:v1:draft')).toBeNull()
})

it('blocks an update when the active draft cannot be saved', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Pre-tax total'), '12')

  const originalSetItem = Storage.prototype.setItem
  Object.defineProperty(Storage.prototype, 'setItem', { configurable: true, value: () => { throw new DOMException('quota', 'QuotaExceededError') } })
  window.dispatchEvent(new Event('splitsnap:update-ready'))
  await user.click(await screen.findByRole('button', { name: 'Update now' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to save draft. Update remains pending.')
  Object.defineProperty(Storage.prototype, 'setItem', { configurable: true, value: originalSetItem })
})

it('flushes the active draft before accepting a ready update', async () => {
  const user = userEvent.setup()
  let accepted = 0
  window.__splitSnapUpdateReady = true
  window.addEventListener('splitsnap:accept-update', () => { accepted += 1 }, { once: true })
  render(<App />)

  await user.type(screen.getByLabelText('Pre-tax total'), '12')
  await user.type(screen.getByLabelText('Monetary label'), 'USD')
  await user.click(screen.getByRole('button', { name: 'Update now' }))

  expect(accepted).toBe(1)
  expect(localStorage.getItem('split-snap:v1:draft')).toContain('"monetaryLabel":"USD"')
  window.__splitSnapUpdateReady = undefined
})
