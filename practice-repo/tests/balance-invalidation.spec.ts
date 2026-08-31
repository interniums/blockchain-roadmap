/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wagmi-make-the-balance-update  (fix, grain block, difficulty 3)
 * Run:      pnpm playwright test tests/balance-invalidation.spec.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   You are given an app that reads a balance with `useReadContract` and never updates it after
 *   a transfer. Make it update. Use `useBlockNumber({ watch: true })` together with
 *   `queryClient.invalidateQueries({ queryKey })`, where the query key is built from the
 *   exported `get<X>QueryOptions(config, args)` rather than hand-written. Prove it works by
 *   transferring from a second Anvil account outside the app entirely, so nothing in your own
 *   code path could have triggered the refresh.
 */
import { test } from '@playwright/test';

test.describe('The balance that never changes', () => {
  // The test transfers tokens from a second account via a direct cast or viem call, and asserts
  // the rendered balance changes within two blocks without any user interaction
  test('01 — The test transfers tokens from a second account via a direct cast or…', async ({ page }) => {
    void page;
    throw new Error('The test transfers tokens from a second account via a direct cast or viem call, and asserts the rendered balance changes within two blocks without any user interaction');
  });

  // Replacing the derived query key with a hand-written string key makes the same test fail
  test('02 — Replacing the derived query key with a hand-written string key makes…', async ({ page }) => {
    void page;
    throw new Error('Replacing the derived query key with a hand-written string key makes the same test fail');
  });

  // The fix does not use polling with a fixed interval
  test('03 — The fix does not use polling with a fixed interval', async ({ page }) => {
    void page;
    throw new Error('The fix does not use polling with a fixed interval');
  });
});
