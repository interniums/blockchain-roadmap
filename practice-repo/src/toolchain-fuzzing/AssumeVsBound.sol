// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fuzzing-assume-vs-bound  (measure, difficulty 3)
 * Exercised by: test/AssumeVsBound.t.sol
 * Run:      forge test --junit --match-path test/AssumeVsBound.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write the same constraint three ways over a `uint256` parameter — `vm.assume(x >= 1 && x <=
 *   100)`, `x = bound(x, 1, 100)`, and hand-rolled clamping with `if (x > 100) x = 100;` — as
 *   three fuzz tests over one contract. Time each. For the assume version, compute beforehand
 *   what fraction of the uint256 domain satisfies the condition and predict what will happen;
 *   then lower `max_test_rejects` to something small and show the test failing with a rejection
 *   error rather than a property violation. For the clamping version, record the distribution of
 *   values the function actually saw by writing each one into an array and asserting on how many
 *   landed exactly on the boundary.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - assume discards the run — vm.assume(cond) throws away the current run when cond is false
 *     and starts another — it filters by retrying.
 *   - Too many rejections fails the test — Rejections are capped at max_test_rejects (default
 *     65536) and exceeding the cap fails the test with a rejection error, not a property
 *     violation.
 *   - bound maps instead of rejecting — forge-std's bound(x, min, max) maps any input into the
 *     range, so every generated value produces a real run.
 *   - Prefer bound for ranges — this is documented, not folklore — The vm.assume reference
 *     itself recommends bound or modulo for range constraints and reserves assume for narrow
 *     exclusions.
 *   - Clamping is not bounding — `if (x > max) x = max;` piles a huge share of the probability
 *     mass exactly on max and never tests the interior.
 */
contract AssumeVsBound {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
