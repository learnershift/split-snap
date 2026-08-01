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
