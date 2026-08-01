import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

import { Sharing } from './Sharing'

it('V07-B02 previews and explicitly writes disclosed plaintext', async () => {
  const user = userEvent.setup()
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })

  render(<Sharing text={'SplitSnap\nPrivate bill text\n'} />)

  expect(screen.getByText((_, element) => element?.tagName === 'PRE' && element.textContent === 'SplitSnap\nPrivate bill text\n')).toBeVisible()
  expect(screen.getByText('Copy writes this exact plaintext to your clipboard.')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Copy result text' }))

  expect(writeText).toHaveBeenCalledWith('SplitSnap\nPrivate bill text\n')
})
