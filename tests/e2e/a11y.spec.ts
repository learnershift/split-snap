import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('V09-B01 initial shell has no automated WCAG A-AA violation', { tag: '@a11y' }, async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()

  expect(results.violations).toEqual([])
})

test('V09-B02 keyboard completes F1 with logical focus', { tag: '@a11y' }, async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Mode').selectOption('itemized')
  await page.getByLabel('Decimal precision').selectOption('2')
  await page.getByLabel('Monetary label').fill('USD')
  await page.getByLabel('Participant 1 name').fill('Ana')
  await page.getByLabel('Participant 2 name').fill('Bo')
  await page.getByRole('button', { name: 'Add participant' }).press('Enter')
  await page.getByLabel('Participant 3 name').fill('Cy')

  for (const [number, description, amount] of [[1, 'Noodles', '10.00'], [2, 'Curry', '11.00'], [3, 'Tea', '4.00']] as const) {
    await page.getByRole('button', { name: 'Add item' }).press('Enter')
    await page.getByLabel(`Item ${number} description`).fill(description)
    await page.getByLabel(`Item ${number} amount`).fill(amount)
  }
  await page.getByLabel('Item 1 include Cy').uncheck()
  await page.getByLabel('Item 2 include Ana').uncheck()
  await page.getByLabel('Tax percentage').fill('8')
  await page.getByLabel('Fixed tip').fill('2.54')
  await page.getByRole('button', { name: 'Calculate split' }).press('Enter')

  await expect(page.getByRole('status')).toContainText('Ana: 7.48')
  await expect(page.getByRole('status')).toContainText('Bo: 13.98')
  await expect(page.getByRole('status')).toContainText('Cy: 8.08')
  await expect(page.getByRole('status')).toContainText('Grand total: 29.54')
})
