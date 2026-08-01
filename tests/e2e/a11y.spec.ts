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

test('V09-B03 dynamic rows and dialogs restore focus', { tag: '@a11y' }, async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Add participant' }).click()
  await expect(page.getByLabel('Participant 3 name')).toBeFocused()
  await page.getByRole('button', { name: 'Remove participant' }).click()
  await expect(page.getByLabel('Participant 2 name')).toBeFocused()

  await page.getByRole('button', { name: 'Start over' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Cancel start over' }).click()
  await expect(page.getByRole('button', { name: 'Start over' })).toBeFocused()
})

test('V09-B04 errors results and rounding are announced', { tag: '@a11y' }, async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Participant 1 name').fill('')
  await page.getByRole('button', { name: 'Calculate split' }).click()
  await expect(page.getByRole('alert')).toContainText('Enter unique participant names.')

  await page.getByLabel('Participant 1 name').fill('Ana')
  await page.getByLabel('Mode').selectOption('itemized')
  await page.getByRole('button', { name: 'Add item' }).click()
  await page.getByLabel('Item 1 amount').fill('1')
  await page.getByRole('button', { name: 'Calculate split' }).click()
  await expect(page.getByRole('status')).toContainText('Grand total: 1')
  await expect(page.getByRole('status')).toContainText('Rounding: Ana received +1 unit.')
})

test('V09-B05 reflows at 320px and 200 percent zoom', { tag: '@a11y' }, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Add participant' }).click()
  await page.getByRole('button', { name: 'Add item' }).click()

  await expect(page.getByLabel('Participant 3 name')).toBeVisible()
  await expect(page.getByLabel('Item 1 amount')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  await page.evaluate(() => { document.body.style.zoom = '2' })
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await expect(page.getByRole('button', { name: 'Calculate split' })).toBeVisible()
})
