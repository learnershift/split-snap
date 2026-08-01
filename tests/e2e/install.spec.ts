import { expect, test } from '@playwright/test'

test('V10-B01 manifest is scoped to split-snap with valid icons', { tag: '@install' }, async ({ page, request }) => {
  await page.goto('/split-snap/')

  const response = await request.get('/split-snap/manifest.webmanifest')
  expect(response.status()).toBe(200)

  const manifest = await response.json()
  expect(manifest).toMatchObject({
    name: 'SplitSnap',
    short_name: 'SplitSnap',
    start_url: '/split-snap/',
    scope: '/split-snap/',
    display: 'standalone',
  })
  const expectedIcons = [
    { src: '/split-snap/icons/icon-192.png', sizes: '192x192' },
    { src: '/split-snap/icons/icon-512.png', sizes: '512x512' },
    { src: '/split-snap/icons/icon-maskable-512.png', sizes: '512x512', purpose: 'maskable' },
  ]
  expect(manifest.icons).toEqual(expect.arrayContaining(expectedIcons.map((icon) => expect.objectContaining(icon))))

  for (const icon of expectedIcons) {
    const iconResponse = await request.get(icon.src)
    expect(iconResponse.status()).toBe(200)
    expect(iconResponse.headers()['content-type']).toContain('image/png')
    const dimensions = await page.evaluate(async (src) => {
      const image = new Image()
      image.src = src
      await image.decode()
      return { width: image.naturalWidth, height: image.naturalHeight }
    }, icon.src)
    expect(dimensions).toEqual({ width: Number(icon.sizes.split('x')[0]), height: Number(icon.sizes.split('x')[1]) })
  }
})

test('V10-B02 every shell and precache resource returns 200', { tag: '@install' }, async ({ page, request }) => {
  await page.goto('/split-snap/')
  const registration = await page.evaluate(() => navigator.serviceWorker.getRegistration())
  expect(registration).toBeDefined()
  await page.evaluate(async () => navigator.serviceWorker.ready)

  const worker = await request.get('/split-snap/sw.js')
  expect(worker.status()).toBe(200)
  const source = await worker.text()
  const urls = [...source.matchAll(/url:"([^"]+)"/g)].map((match) => match[1])
  expect(urls).toContain('index.html')

  for (const url of urls) {
    expect((await request.get(url)).status()).toBe(200)
  }
  await expect(page).toHaveTitle(/SplitSnap/)
})
