// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fuzzing-conservation-property  (implement, difficulty 3)
 * Exercised by: test/ConservationFuzz.t.sol
 * Run:      forge test --junit --match-path test/ConservationFuzz.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a minimal ERC-20-like token and fuzz `transfer(address to, uint256 amount)` for the
 *   property that the sum of the sender's and recipient's balances is unchanged. Exclude only
 *   what genuinely must be excluded with assume — address(0), the token itself, the test
 *   contract, and the cheatcode address 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D — and bound
 *   the amount rather than assuming it. Then introduce a deliberate rounding bug, such as a fee
 *   that truncates, and show the fuzzer producing a concrete counterexample. Promote those exact
 *   arguments into a named `test_` case, fix the bug, and confirm both the named case and the
 *   campaign pass. Finally, tighten the bounds until the same bug stops being found, and write
 *   down the bound that hid it.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Properties versus examples — A unit test asserts an outcome for one input you chose; a
 *     fuzz test asserts a property that must hold for inputs you did not choose.
 *   - Stateless fuzzing — testFuzz calls one function with random arguments from a fresh
 *     post-setUp state each run — it cannot find sequence bugs.
 *   - What assume is still right for — Excluding a handful of specific addresses — zero, the
 *     cheatcode address, the test contract — where the rejection rate is negligible.
 *   - Working a counterexample — A failure prints the concrete arguments that broke the
 *     property; the workflow is to promote them into a named unit test, then fix.
 *   - Overconstraining — Every assume and bound narrows the search, so a heavily constrained
 *     fuzz test can pass while never reaching the region where the bug lives.
 */
contract ConservationFuzz {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
