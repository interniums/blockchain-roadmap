// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-calls-delegatecall-slot-zero-takeover  (break, difficulty 3)
 * Exercised by: test/SlotZeroTakeover.t.sol
 * Run:      forge test --junit --match-path test/SlotZeroTakeover.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a proxy whose slot 0 holds address implementation and an implementation whose slot 0
 *   holds uint256 totalSupply. Call, through the proxy, a perfectly ordinary function that sets
 *   totalSupply = 1. Prove that the proxy's implementation pointer is now address(0x01), and
 *   then prove the more unsettling half: every subsequent call through the proxy returns success
 *   with empty return data, because the target has no code. Then move the proxy's state to the
 *   EIP-1967 slot with inline assembly and re-run the identical breaking test.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Storage matching is the whole risk — Delegatecall matches storage by slot position,
 *     never by variable name.
 *   - A call to an address with no code succeeds — The EVM returns success with empty data
 *     when the target has no code; low-level calls skip Solidity's check.
 *   - Proxies keep their state out of the numbered range — Proxy state lives at pseudorandom
 *     slots such as keccak256('eip1967.proxy.implementation') - 1.
 */
contract SlotZeroTakeover {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
