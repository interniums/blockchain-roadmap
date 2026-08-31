// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-accounts-delegate-takeover  (break, difficulty 3)
 * Exercised by: test/DelegateTakeover.t.sol
 * Run:      forge test --junit --match-path test/DelegateTakeover.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a delegate contract with a single function that forwards arbitrary calldata to an
 *   arbitrary target with no access control at all — the naive "batching" delegate people write
 *   first. In a Foundry test, fund an anvil EOA, sign an EIP-7702 authorization for that
 *   delegate with `vm.signAndAttachDelegation` (or `vm.signDelegation` plus
 *   `vm.attachDelegation`), and confirm the account's code is now the 23-byte designator. Then,
 *   from a completely unrelated attacker address, call the delegated EOA and drain its entire
 *   balance. Finally write a second delegate that resists the same attack by requiring that the
 *   caller is the account itself, and prove the drain now reverts.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Delegation designator — The 23-byte value 0xef0100 followed by an address, written into
 *     an account's code slot to point the EVM at that address's code.
 *   - A delegate has total control — The delegate's code executes as your account, so choosing
 *     one is closer to handing over the key than to granting an allowance.
 *   - Set-code transaction (type 0x04) — The EIP-7702 transaction type that carries an
 *     authorization list and installs delegation designators before execution begins.
 *   - Authorization tuple — The signed (chain_id, address, nonce) triple that authorises one
 *     delegation — signed by the account, submittable by anyone.
 */
contract DelegateTakeover {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
