import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('V09-B01 initial shell has no automated WCAG A-AA violation', { tag: '@a11y' }, async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()

  expect(results.violations).toEqual([])
})
