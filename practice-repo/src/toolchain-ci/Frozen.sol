// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-ci-false-positive-gate  (break, difficulty 3)
 * Exercised by: test/gas/Frozen.t.sol
 * Run:      forge test --junit --match-path test/gas/Frozen.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Set up `forge snapshot --check` as a gate over a repository. Now add a single new test that
 *   exercises an existing function on a cheap path, changing no production code at all, and show
 *   the gate failing. Explain precisely why. Then implement the fix that keeps the signal
 *   without the false positive: move gas measurement into a small frozen suite under `test/gas/`
 *   whose contents change only deliberately, pin its fuzz seed, and gate on that file alone
 *   while the functional suite is free to churn. Prove the new arrangement by adding another
 *   functional test and showing the frozen numbers do not move. As a coda, add a test that
 *   executes every line of a contract and asserts nothing, and report the coverage number it
 *   produces.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Gating on the snapshot — forge snapshot --check hard-fails on any gas change — useful
 *     for a frozen gas suite, hostile when the suite churns.
 *   - Gas as a pull-request comment — A bot re-runs the gas report on base and head and
 *     comments the delta, turning gas into review feedback instead of a hidden regression.
 *   - The report describes your test suite — Those numbers are the distribution of calls your
 *     tests make, not the distribution real users will make.
 *   - Coverage measures execution, not assertion — A suite can hit every line while asserting
 *     almost nothing, so coverage is a floor on effort and never evidence of correctness.
 */
contract Frozen {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
