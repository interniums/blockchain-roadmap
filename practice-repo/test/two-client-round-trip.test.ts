/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-viem-two-client-round-trip  (implement, grain block, difficulty 2)
 * Run:      pnpm vitest run test/two-client-round-trip.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Against a local Anvil node, write a TypeScript script that does the whole round trip for an
 *   ERC-20 transfer. Create a public client over `http()` and read the token's `decimals` and
 *   the sender's `balanceOf` in a single `multicall`. Format the balance for display with
 *   `formatUnits` - no floating-point arithmetic anywhere in the file. Create a wallet client
 *   from one of Anvil's private keys as a local account. Call `simulateContract` for the
 *   transfer, pass the returned `request` straight to `writeContract`, then
 *   `waitForTransactionReceipt`, and print the formatted balance again. The script must contain
 *   no call to `writeContract` that is not preceded by a successful `simulateContract` on the
 *   same line of reasoning.
 */
import { describe, it, expect } from 'vitest';

describe('Read with one client, write with the other', () => {
  // The test starts Anvil, runs the script, and asserts the printed before and after balances
  // differ by exactly the transferred amount
  it('01 — The test starts Anvil, runs the script, and asserts the printed before…', () => {
    expect.fail('The test starts Anvil, runs the script, and asserts the printed before and after balances differ by exactly the transferred amount');
  });

  // A grep assertion in the test proves the source file contains no `Number(` or `parseFloat`
  // applied to a chain value
  it('02 — A grep assertion in the test proves the source file contains no…', () => {
    expect.fail('A grep assertion in the test proves the source file contains no `Number(` or `parseFloat` applied to a chain value');
  });

  // Removing the `simulateContract` call and pointing the transfer at an amount exceeding the
  // balance makes the test fail with a reverted receipt rather than a pre-signature error
  it('03 — Removing the `simulateContract` call and pointing the transfer at an…', () => {
    expect.fail('Removing the `simulateContract` call and pointing the transfer at an amount exceeding the balance makes the test fail with a reverted receipt rather than a pre-signature error');
  });
});
