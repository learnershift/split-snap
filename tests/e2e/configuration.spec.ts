import { expect, test } from '@playwright/test'

test('Playwright configuration serves the SplitSnap shell', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'SplitSnap' })).toBeVisible()
})
