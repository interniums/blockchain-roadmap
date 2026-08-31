/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wallet-capabilities-batch-with-fallback  (implement, grain block, difficulty 3)
 * Run:      pnpm playwright test tests/sendcalls-fallback.spec.ts --project=capable --project=legacy
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build an approve-then-deposit flow that submits both calls through `sendCalls` with
 *   `experimental_fallback` enabled, after querying the connected wallet's capabilities and
 *   rendering what it reported. Run the same build against two connectors: one wallet that
 *   implements `wallet_sendCalls` and one that does not. The application code must be identical
 *   in both runs - all branching happens on the capability response and inside viem's fallback,
 *   not on the wallet's name.
 */
import { test } from '@playwright/test';

test.describe('One code path, two generations of wallet', () => {
  // Both projects reach the same success state and the test asserts the final on-chain state
  // matches
  test('01 — Both projects reach the same success state and the test asserts the…', async ({ page }) => {
    void page;
    throw new Error('Both projects reach the same success state and the test asserts the final on-chain state matches');
  });

  // The test asserts one wallet prompt in the capable run and two in the legacy run
  test('02 — The test asserts one wallet prompt in the capable run and two in the…', async ({ page }) => {
    void page;
    throw new Error('The test asserts one wallet prompt in the capable run and two in the legacy run');
  });

  // A source assertion proves no branch in the application code inspects a wallet name, id, or
  // user agent
  test('03 — A source assertion proves no branch in the application code inspects a…', async ({ page }) => {
    void page;
    throw new Error('A source assertion proves no branch in the application code inspects a wallet name, id, or user agent');
  });
});
