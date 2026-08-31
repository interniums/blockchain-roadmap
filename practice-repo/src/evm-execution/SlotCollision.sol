// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-proxy-slot-collision  (fix, difficulty 3)
 * Exercised by: test/SlotCollision.t.sol
 * Run:      forge test --junit --match-path test/SlotCollision.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a minimal proxy that stores its admin address in storage slot 0 and delegatecalls an
 *   implementation. Give the implementation its own state variable declared first, so it also
 *   lands in slot 0. Write a test that calls a perfectly ordinary implementation setter and
 *   demonstrates the proxy's admin has been overwritten — ideally with an attacker-chosen value.
 *   Then fix it by moving the admin pointer to an ERC-1967 style fixed hashed slot, and prove
 *   the same implementation call no longer disturbs it. State in a comment why DELEGATECALL is
 *   what made the collision possible.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - DELEGATECALL is the proxy primitive — Borrowed code, your storage, your identity — which
 *     makes upgradeable proxies possible and makes storage collisions inevitable.
 *   - Four call variants — CALL runs callee code in callee storage; DELEGATECALL runs callee
 *     code in caller storage keeping msg.sender and msg.value; STATICCALL bans mutation;
 *     CALLCODE is the deprecated ancestor.
 *   - Storage survives the delegate — Storage belongs to the delegating account, so switching
 *     delegates hands the new code whatever the old code wrote.
 */
contract SlotCollision {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
