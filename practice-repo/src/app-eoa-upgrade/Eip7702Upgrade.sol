// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-eoa-upgrade-delegate-and-clear  (implement, difficulty 4)
 * Exercised by: test/Eip7702Upgrade.t.sol
 * Run:      forge test --match-path test/Eip7702Upgrade.t.sol && pnpm vitest run test/sign-authorization.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   On Anvil, take a funded EOA and delegate it to a minimal batch-executor contract using
 *   viem's `signAuthorization` and a type-0x4 transaction carrying an `authorizationList`. Do it
 *   twice: once with a separate sponsor account paying for the transaction, and once with the
 *   authorizing account submitting its own upgrade - getting the nonce right in each case. Then
 *   execute a two-call batch through the delegated account. Finally, clear the delegation with
 *   an authorization pointing at the zero address and prove the account's code is empty again.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - Signing an authorization from the app — viem's signAuthorization produces the EIP-7702
 *     tuple, and the transaction carries it in authorizationList.
 *   - What the upgrade screen owes the user — A 7702 upgrade is one signature that persists
 *     until cleared, so the consent screen must name the delegate and the way back.
 */
contract Eip7702Upgrade {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
