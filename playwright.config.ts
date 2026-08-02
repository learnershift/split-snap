import { defineConfig } from '@playwright/test'

const distDirectory = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.DIST_DIR

export default defineConfig({
  workers: 1,
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4173/split-snap/',
  },
  webServer: {
    command: distDirectory ? 'node scripts/update-fixture-server.mjs' : 'npm run build && node scripts/update-fixture-server.mjs',
    url: 'http://127.0.0.1:4173/split-snap/',
    reuseExistingServer: false,
  },
})
