import { expect, test } from '@playwright/test'

test('V10-B06 accepted update changes controller and reloads once', async ({ page, request }) => {
  await page.goto('/split-snap/')
  await page.evaluate(async () => navigator.serviceWorker.ready)
  await request.get('/__switch-worker')
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then((registration) => registration?.update()))
  await expect(page.getByRole('dialog', { name: 'Update ready' })).toBeVisible()
  await page.getByRole('button', { name: 'Update now' }).click()
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('split-snap:update-reloaded'))).toBe('1')
})

test('V10-B07 incompatible draft survives update until explicit deletion', async ({ page }) => {
  const draft = '{"schemaVersion":2,"inputs":{}}'
  await page.addInitScript((bytes) => localStorage.setItem('split-snap:v1:draft', bytes), draft)
  await page.goto('/split-snap/')
  await expect(page.getByRole('alert')).toContainText('Saved draft needs recovery before it can be used.')
  expect(await page.evaluate(() => localStorage.getItem('split-snap:v1:draft'))).toBe(draft)
})
