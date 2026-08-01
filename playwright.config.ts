import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4173/split-snap/',
  },
  webServer: {
    command: 'npm run build && node scripts/update-fixture-server.mjs',
    url: 'http://127.0.0.1:4173/split-snap/',
    reuseExistingServer: false,
  },
})
