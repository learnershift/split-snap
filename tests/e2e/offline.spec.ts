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

test('V10-B04 rejecting update preserves old controller UI and draft', { tag: '@offline' }, async ({ page }) => {
  await page.goto('/split-snap/')
  await page.evaluate(async () => navigator.serviceWorker.ready)
  const beforeController = await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null)
  const draft = '{"schemaVersion":1,"inputs":{"monetaryLabel":"USD","precision":2,"participants":["Ana","Bo"],"preTaxTotalUnits":"1200"}}'
  await page.evaluate((bytes) => localStorage.setItem('split-snap:v1:draft', bytes), draft)

  await page.evaluate(() => window.dispatchEvent(new Event('splitsnap:update-ready')))
  await expect(page.getByRole('dialog', { name: 'Update ready' })).toBeVisible()
  await page.getByRole('button', { name: 'Keep current version' }).click()

  await expect(page.getByRole('dialog', { name: 'Update ready' })).toBeHidden()
  expect(await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? null)).toBe(beforeController)
  expect(await page.evaluate(() => localStorage.getItem('split-snap:v1:draft'))).toBe(draft)
  await expect(page.getByRole('main', { name: 'SplitSnap bill' })).toBeVisible()
})
