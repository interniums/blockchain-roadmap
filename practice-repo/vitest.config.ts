import { defineConfig } from 'vitest/config';

/**
 * Two test roots, because the acceptance commands use two.
 *
 * Most of the corpus runs `vitest run test/<file>.test.ts`. Seven infra practices instead run
 * `pnpm vitest run tests/<name>` — vitest's positional argument is a filename *filter*, not a path,
 * so those resolve against `tests/<name>.test.ts`. Both directories are included rather than one
 * being renamed, because the acceptance commands are the contract and they are already authored.
 *
 * `.mjs` is excluded on purpose: seven practices run those under `node --test`, which is a different
 * runner with its own assertion library. Letting vitest also collect them would double-report.
 */
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts', 'tests/**/*.test.ts'],
    // `.spec.ts` is Playwright's, by convention across this repo: all five browser exercises are
    // `tests/*.spec.ts` and no vitest command names a `.spec.ts`. Collecting them here would run
    // them under the wrong runner, where `page` does not exist.
    exclude: ['**/node_modules/**', 'lib/**', 'out/**', 'cache/**', '**/*.spec.ts'],
    environment: 'node',
    // An exercise that hangs should say so rather than sitting there.
    testTimeout: 20_000,
  },
});
