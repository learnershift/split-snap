import { expect, test } from '@playwright/test'

test('V11-B01 never transmits the canary bill', { tag: '@privacy' }, async ({ page }) => {
  const canary = 'CANARY-BILL-PRIVATE-001'
  const transmitted: string[] = []
  const consoleMessages: string[] = []
  page.on('request', (request) => transmitted.push(`${request.method()} ${new URL(request.url()).pathname} ${JSON.stringify(request.headers())} ${request.postData() ?? ''}`))
  page.on('console', (message) => consoleMessages.push(message.text()))
  await page.addInitScript(() => {
    for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'] as const) {
      Object.defineProperty(window, name, { configurable: true, value: () => { throw new Error(`forbidden ${name}`) } })
    }
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: () => { throw new Error('forbidden beacon') } })
  })
  await page.goto('/split-snap/')
  await page.getByLabel('Pre-tax total').fill(canary)
  await page.waitForTimeout(100)
  expect(transmitted.join('\n')).not.toContain(canary)
  expect(consoleMessages.join('\n')).not.toContain(canary)
  expect(transmitted.every((entry) => /^GET \/split-snap\/(?:$|index\.html|assets\/[^/]+|manifest\.webmanifest|icons\/[^/]+|sw\.js|workbox-[^/]+|registerSW\.js)$/.test(entry.split(' {')[0])), transmitted.join('\n')).toBe(true)
})

test('V11-B02 build contains no remote executable tracker or font', { tag: '@privacy' }, async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/split-snap/')
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true)
  const markup = await page.content()
  expect(markup).not.toMatch(/https?:\/\//i)
})

test('V11-B03 requests no permission and never reads clipboard', { tag: '@privacy' }, async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query: () => { throw new Error('permission requested') } } })
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { readText: () => { throw new Error('clipboard read') } } })
  })
  await page.goto('/split-snap/')
  await expect(page.getByRole('main', { name: 'SplitSnap bill' })).toBeVisible()
})

test('V11-B04 meta CSP blocks product connections', { tag: '@privacy' }, async ({ page }) => {
  await page.goto('/split-snap/')
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'")
})

test('V11-B05 renders canary Unicode as text without URL or console leakage', { tag: '@privacy' }, async ({ page }) => {
  const canary = '한글-☃-<img>'
  const messages: string[] = []
  page.on('console', (message) => messages.push(message.text()))
  await page.goto('/split-snap/')
  await page.getByLabel('Monetary label').fill(canary)
  await expect(page.getByText(`Monetary label: ${canary}`)).toBeVisible()
  expect(page.url()).not.toContain(canary)
  expect(messages.join('\n')).not.toContain(canary)
})
