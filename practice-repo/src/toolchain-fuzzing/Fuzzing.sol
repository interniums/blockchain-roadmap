// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fuzzing-capstone-the-constraint-hid-the-bug  (measure, difficulty 4)
 * Exercised by: test/capstone/Fuzzing.t.sol
 * Run:      forge test --junit --match-path test/capstone/Fuzzing.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   The hard part of fuzzing is not writing the property. It is that your input constraints are
 *   part of the test, and a constraint can exclude the only inputs that would have failed. This
 *   exercise makes that concrete by planting a bug in a place your first instinct will hide. THE
 *   TARGET. Write a function with a bug reachable only at a boundary — the maximum of a range, a
 *   zero, or a value just above a threshold. Write down which input class triggers it before you
 *   write any test. HIDE IT. Write a property test that constrains inputs with `vm.assume` in a
 *   way that excludes the triggering class. Show it passing at the default run count. Then
 *   report the rejection count and show that you were near the reject ceiling — the signal that
 *   your test was mostly not running. HIDE IT AGAIN, DIFFERENTLY. Now use a naive `bound`
 *   instead, and demonstrate the bias it introduces: show the distribution of values your bound
 *   actually produces and where it clusters. Show the test still passing. FIND IT. Fix the
 *   constraints so the test fails. State what you changed and why, in terms of the input class
 *   you wrote down at the start. THE DICTIONARY AND FIXTURES. Add a fuzz dictionary and fixtures
 *   containing the boundary values, and show the failure is now found in far fewer runs. Report
 *   the run count before and after. REPRODUCE IT. Capture the counterexample, show it persisted,
 *   and reproduce the exact failure from a seed on a clean checkout. Read the counterexample out
 *   loud in the write-up: what were the inputs, and why is that the boundary. THE LIMIT.
 *   Finally, construct a second bug that stateless fuzzing cannot find no matter how you
 *   constrain it, and say in one sentence what it needs instead.
 *
 * The 14 concepts this has to end up demonstrating:
 *   - Properties versus examples — A unit test asserts an outcome for one input you chose; a
 *     fuzz test asserts a property that must hold for inputs you did not choose.
 *   - Stateless fuzzing — testFuzz calls one function with random arguments from a fresh
 *     post-setUp state each run — it cannot find sequence bugs.
 *   - Parameters are what make a test fuzzed — Any test function that takes arguments is
 *     fuzzed; the testFuzz prefix is a convention for humans.
 *   - The fuzzer does not sample uniformly — A weighted dictionary of boundary values, storage
 *     contents and PUSH-byte constants is mixed into the random stream.
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
 *   - Overconstraining — Every assume and bound narrows the search, so a heavily constrained
 *     fuzz test can pass while never reaching the region where the bug lives.
 *   - Fixtures — A fixture is a named dataset; a table test runs once per entry, so
 *     known-nasty values get tried by construction rather than by luck.
 *   - Seeds trade flakiness for coverage — Without a pinned [fuzz] seed each run draws fresh
 *     inputs; pinning makes CI reproducible and freezes the search.
 *   - Failures are persisted and replayed — Failing inputs are written to cache/fuzz and
 *     replayed on later runs, so a fixed bug stays regression-tested.
 *   - Working a counterexample — A failure prints the concrete arguments that broke the
 *     property; the workflow is to promote them into a named unit test, then fix.
 */
contract Fuzzing {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
