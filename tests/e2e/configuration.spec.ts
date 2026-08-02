import { expect, test } from '@playwright/test'

test('Playwright configuration serves the SplitSnap shell', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'SplitSnap' })).toBeVisible()
})

test('fixture server serves the shell when navigation has query parameters', async ({ page }) => {
  await page.goto('/split-snap/?fixture=1')
  await expect(page.getByRole('heading', { name: 'SplitSnap' })).toBeVisible()
})
