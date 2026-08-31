// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-abi-selectors-mine-a-clashing-selector  (break, difficulty 4)
 * Exercised by: test/SelectorClash.t.sol
 * Run:      forge test --junit --match-path test/SelectorClash.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Brute-force a function name of the form attack_<n>() whose four-byte selector equals the
 *   selector of upgradeTo(address). Deploy a minimal proxy whose fallback forwards to an
 *   implementation, give the implementation your mined function, and show that a call the admin
 *   believes goes to the proxy's upgrade path instead reaches the implementation, or the
 *   reverse, depending on which dispatcher sees the calldata first. Then swap in a
 *   transparent-proxy-style caller split and re-run the same test to show the clash is no longer
 *   reachable.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The selector space is small — Selectors live in a 2**32 space, so collisions are cheap
 *     to find and cheap to mine.
 *   - Where a selector collision is dangerous — Collisions matter only where two separately
 *     compiled dispatch surfaces overlap, classically a proxy.
 *   - The dispatcher — solc's legacy codegen emits a binary search over selectors sorted as
 *     integers, not a jump table.
 *   - fallback and receive — Unmatched calldata goes to fallback(); empty calldata with value
 *     goes to receive() if it exists.
 */
contract SelectorClash {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
