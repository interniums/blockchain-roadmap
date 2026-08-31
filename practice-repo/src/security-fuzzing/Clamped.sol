// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-fuzzing-unclamp-and-remeasure  (fix, difficulty 3)
 * Exercised by: test/invariant/Clamped.invariant.t.sol
 * Run:      bash -c 'set -e; forge test --junit --match-path test/invariant/Clamped.invariant.t.sol; forge coverage --match-path test/invariant/Clamped.invariant.t.sol --report summary | tee coverage.txt; test -s docs/harness-measurements.md; test $(git rev-list --count HEAD ^HEAD~3) -eq 3'
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Start from a deliberately bad harness - the fuzzer pointed straight at the target's external
 *   functions, unbounded arguments, a single acting address, no approvals - and measure it:
 *   revert rate, line coverage, and time to first counterexample against a known planted bug.
 *   Then fix it in three separate commits, one change per commit - add a handler, add clamping,
 *   add an actor set - and re-measure after each. Report all three metrics at all four points in
 *   docs/harness-measurements.md and state which single change bought the most.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Revert blindness — A campaign where most calls revert has effectively no throughput; the
 *     revert rate is the first diagnostic.
 *   - Input clamping — Bound fuzzed inputs to plausible ranges so the campaign spends its
 *     budget in reachable state rather than on reverts.
 *   - Handler contract — A wrapper that restricts the fuzzer to realistic actions by realistic
 *     actors instead of raw external functions.
 *   - Coverage-guided fuzzing — Mutate the inputs that reached new code, rather than sampling
 *     blindly.
 */
contract Clamped {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
