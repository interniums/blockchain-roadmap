/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wallet-capabilities-partial-batch-failure  (break, grain block, difficulty 3)
 * Run:      pnpm playwright test tests/partial-batch.spec.ts && forge test --match-path test/PartialBatch.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take the flow from the previous exercise and make the second call fail - insufficient
 *   allowance, a paused contract, whatever is convenient. Run it once against an account that
 *   executes the batch atomically and once through the sequential fallback. Capture the on-chain
 *   state after each. Then write the UI copy for the state the sequential run leaves the user
 *   in, and add the code that detects it.
 *
 * Your code goes in src/app-wallet-capabilities/PartialBatch.ts. Nothing here imports it yet —
 * a TypeScript module is its named exports, and this scaffold does not invent them. Export
 * what the exercise needs, then import it above.
 */
import { test } from '@playwright/test';

test.describe('Half a batch', () => {
  // The Foundry test proves the atomic account leaves no trace of the first call after the
  // second fails
  test('01 — The Foundry test proves the atomic account leaves no trace of the first…', async ({ page }) => {
    void page;
    throw new Error('The Foundry test proves the atomic account leaves no trace of the first call after the second fails');
  });

  // The Playwright test proves the sequential run leaves the first call applied and the second
  // not
  test('02 — The Playwright test proves the sequential run leaves the first call…', async ({ page }) => {
    void page;
    throw new Error('The Playwright test proves the sequential run leaves the first call applied and the second not');
  });

  // The app detects the half-applied state and renders a distinct message naming what did and
  // did not happen
  test('03 — The app detects the half-applied state and renders a distinct message…', async ({ page }) => {
    void page;
    throw new Error('The app detects the half-applied state and renders a distinct message naming what did and did not happen');
  });
});
