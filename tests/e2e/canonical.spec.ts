import { expect, test } from '@playwright/test'

test('V12 canonical F1-F4 journeys', async ({ page }) => {
  const diagnostics: string[] = []
  page.on('pageerror', (error) => diagnostics.push(`pageerror: ${error.message}`))
  page.on('console', (message) => diagnostics.push(`console: ${message.type()} ${message.text()}`))
  await page.goto('/split-snap/')
  await page.waitForTimeout(300)
  if ((await page.locator('#root').innerHTML()) === '') throw new Error(JSON.stringify({ diagnostics, html: await page.content() }))
  await page.getByLabel('Mode').selectOption('itemized')
  await page.getByLabel('Decimal precision').selectOption('2')
  await page.getByLabel('Monetary label').fill('USD')
  await page.getByLabel('Participant 1 name').fill('Ana')
  await page.getByLabel('Participant 2 name').fill('Bo')
  await page.getByRole('button', { name: 'Add participant' }).click()
  await page.getByLabel('Participant 3 name').fill('Cy')
  for (const [number, description, amount] of [[1, 'Noodles', '10.00'], [2, 'Curry', '11.00'], [3, 'Tea', '4.00']] as const) {
    await page.getByRole('button', { name: 'Add item' }).click()
    await page.getByLabel(`Item ${number} description`).fill(description)
    await page.getByLabel(`Item ${number} amount`).fill(amount)
  }
  await page.getByLabel('Item 1 include Cy').uncheck()
  await page.getByLabel('Item 2 include Ana').uncheck()
  await page.getByLabel('Tax percentage').fill('8')
  await page.getByLabel('Fixed tip').fill('2.54')
  await page.getByRole('button', { name: 'Calculate split' }).click()
  await expect(page.getByRole('status')).toContainText('Grand total: 29.54')
  await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible()
})
