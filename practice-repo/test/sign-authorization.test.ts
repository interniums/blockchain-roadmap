/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-eoa-upgrade-delegate-and-clear  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/Eip7702Upgrade.t.sol && pnpm vitest run test/sign-authorization.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On Anvil, take a funded EOA and delegate it to a minimal batch-executor contract using
 *   viem's `signAuthorization` and a type-0x4 transaction carrying an `authorizationList`. Do it
 *   twice: once with a separate sponsor account paying for the transaction, and once with the
 *   authorizing account submitting its own upgrade - getting the nonce right in each case. Then
 *   execute a two-call batch through the delegated account. Finally, clear the delegation with
 *   an authorization pointing at the zero address and prove the account's code is empty again.
 */
import { describe, it, expect } from 'vitest';

describe('Upgrade an account, then take it back', () => {
  // After the sponsored upgrade the account's code is the delegation designator naming the
  // executor, and the sponsor paid the gas
  it('01 — After the sponsored upgrade the account\'s code is the delegation…', () => {
    expect.fail('After the sponsored upgrade the account\'s code is the delegation designator naming the executor, and the sponsor paid the gas');
  });

  // The self-submitted upgrade succeeds, and the test documents which nonce value the
  // authorization had to use and why it differs from the sponsored case
  it('02 — The self-submitted upgrade succeeds, and the test documents which nonce…', () => {
    expect.fail('The self-submitted upgrade succeeds, and the test documents which nonce value the authorization had to use and why it differs from the sponsored case');
  });

  // After clearing, the account's code length is zero and the batch call reverts
  it('03 — After clearing, the account\'s code length is zero and the batch call…', () => {
    expect.fail('After clearing, the account\'s code length is zero and the batch call reverts');
  });
});
