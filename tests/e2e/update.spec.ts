import { expect, test } from '@playwright/test'

test('V10-B06 accepted update changes controller and reloads once', async ({ page, request }) => {
  await page.goto('/split-snap/')
  await page.evaluate(async () => navigator.serviceWorker.ready)
  const switched = await request.get('/__switch-worker')
  expect(switched.status()).toBe(200)
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    await new Promise<void>((resolve) => {
      if (registration?.waiting) return resolve()
      registration?.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => {
        if (registration.waiting) resolve()
      }))
      registration?.update()
    })
  })
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

test('V10-B08 activation removes obsolete static cache only', async ({ page, request }) => {
  await page.goto('/split-snap/')
  await page.waitForTimeout(250)
  await page.getByLabel('Pre-tax total').fill('1')
  const draft = await page.evaluate(() => localStorage.getItem('split-snap:v1:draft'))
  expect(draft).not.toBeNull()
  await page.evaluate(async () => {
    localStorage.setItem('unrelated', 'keep')
    await caches.open('split-snap-static-old')
    await caches.open('unrelated-cache')
    sessionStorage.removeItem('split-snap:update-reloaded')
  })
  const switched = await request.get('/__switch-worker')
  expect(switched.status()).toBe(200)
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    await new Promise<void>((resolve) => {
      if (registration?.waiting) return resolve()
      registration?.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => {
        if (registration.waiting) resolve()
      }))
      registration?.update()
    })
  })
  await expect(page.getByRole('button', { name: 'Update now' })).toBeVisible()
  const reloaded = page.waitForEvent('load')
  await page.getByRole('button', { name: 'Update now' }).click()
  await reloaded
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('split-snap:update-reloaded'))).toBe('1')
  await expect.poll(() => page.evaluate(() => caches.keys())).not.toContain('split-snap-static-old')
  expect(await page.evaluate(() => localStorage.getItem('split-snap:v1:draft'))).toBe(draft)
  expect(await page.evaluate(() => localStorage.getItem('unrelated'))).toBe('keep')
  expect(await page.evaluate(() => caches.keys())).toContain('unrelated-cache')
})
