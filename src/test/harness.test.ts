import { expect, it } from 'vitest'

it('V00-B01 runs the locked test harness', () => {
  expect(document.querySelector('#root')).not.toBeNull()
})
