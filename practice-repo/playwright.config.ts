import { defineConfig } from '@playwright/test';

/**
 * The five browser exercises. They are `tests/*.spec.ts`, which is also how vitest knows to leave
 * them alone.
 *
 * No `webServer` is configured: each of these practices asks you to point the test at the app you
 * built for it, and guessing a port here would fail in a way that looked like the test's fault.
 * Two of them run named projects (`--project=capable`, `--project=legacy`) to contrast a wallet
 * that advertises a capability against one that does not, so both exist up front.
 */
export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.spec.ts',
  reporter: process.env.CI ? 'junit' : 'list',
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'capable', use: { userAgent: 'chainpath-capable' } },
    { name: 'legacy', use: { userAgent: 'chainpath-legacy' } },
  ],
});
