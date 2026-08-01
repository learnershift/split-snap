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
