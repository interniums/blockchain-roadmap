// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-accounts-defeat-the-origin-guard  (break, difficulty 4)
 * Exercised by: test/OriginGuard.t.sol
 * Run:      forge test --match-path test/OriginGuard.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a contract with the classic anti-contract guard, `require(msg.sender == tx.origin, "no
 *   contracts")`, protecting a function that should only ever be callable by a human — a mint, a
 *   claim, whatever fits. Then defeat it. Have an EOA sign a delegation to an attacker contract
 *   using Foundry's `vm.signAndAttachDelegation`, and call the guarded function from that
 *   account. The guard will pass, because the caller really is the transaction origin, while
 *   arbitrary attacker code executes as that caller. Prove both halves in
 *   `test/OriginGuard.t.sol`: one test showing a plain contract caller is correctly rejected,
 *   and one showing the delegated EOA sails through and runs code. Finish by writing a second
 *   guard that actually expresses the property the first one was reaching for, and a test that
 *   your bypass fails against it.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Having code no longer means being a contract — Since Pectra an EOA can carry a code
 *     hash, so "has code" no longer implies "is a contract" and the tx.origin guard is broken.
 *   - Code is content-addressed, not embedded — `codeHash` is the keccak of the bytecode; the
 *     bytecode itself is fetched by hash from outside the record.
 *   - The nonce of a key-controlled account — For an EOA the nonce counts transactions sent,
 *     and a transaction is valid only if its nonce equals the account's current one exactly.
 */
contract OriginGuard {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
