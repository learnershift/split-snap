import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import '../main'

it('V01-B01 renders the semantic mobile shell', () => {
  expect(screen.getByRole('heading', { name: 'SplitSnap' })).toBeVisible()
  expect(screen.getByRole('main', { name: 'SplitSnap bill' })).toBeVisible()
  expect(screen.getByRole('form', { name: 'Bill details' })).toBeVisible()
})
