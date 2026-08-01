import { expect, test } from '@playwright/test'

test('V10-B03 reopens and completes F1 offline after initial load', { tag: '@offline' }, async ({ context, page }) => {
  await page.goto('/split-snap/')
  await page.evaluate(async () => navigator.serviceWorker.ready)
  await context.setOffline(true)
  await page.reload()

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

  await expect(page.getByRole('status')).toContainText('Ana: 7.48')
  await expect(page.getByRole('status')).toContainText('Bo: 13.98')
  await expect(page.getByRole('status')).toContainText('Cy: 8.08')
  await expect(page.getByRole('status')).toContainText('Grand total: 29.54')
})
