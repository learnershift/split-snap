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
