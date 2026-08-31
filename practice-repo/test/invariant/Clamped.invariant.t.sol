// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-fuzzing-unclamp-and-remeasure  (fix, grain block, difficulty 3)
 * Run:      bash -c 'set -e; forge test --junit --match-path test/invariant/Clamped.invariant.t.sol; forge coverage --match-path test/invariant/Clamped.invariant.t.sol --report summary | tee coverage.txt; test -s docs/harness-measurements.md; test $(git rev-list --count HEAD ^HEAD~3) -eq 3'
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Start from a deliberately bad harness - the fuzzer pointed straight at the target's external
 *   functions, unbounded arguments, a single acting address, no approvals - and measure it:
 *   revert rate, line coverage, and time to first counterexample against a known planted bug.
 *   Then fix it in three separate commits, one change per commit - add a handler, add clamping,
 *   add an actor set - and re-measure after each. Report all three metrics at all four points in
 *   docs/harness-measurements.md and state which single change bought the most.
 */
contract ClampedInvariantTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Revert rate falls below twenty percent and coverage strictly increases at the same call
    /// budget
    function test_criterion01_revertRateFallsBelowTwentyPercentAndCoverageStrictly() public {
        fail("Revert rate falls below twenty percent and coverage strictly increases at the same call budget");
    }

    /// Three separate commits, each isolating one change, with metrics recorded after each
    function test_criterion02_threeSeparateCommitsEachIsolatingOneChangeWithMetrics() public {
        fail("Three separate commits, each isolating one change, with metrics recorded after each");
    }

    /// The planted bug is found in the fixed harness and was not found in the original within the
    /// same budget
    function test_criterion03_thePlantedBugIsFoundInTheFixedHarness() public {
        fail("The planted bug is found in the fixed harness and was not found in the original within the same budget");
    }

    /// A written statement of which change mattered most, supported by the measurements
    function test_criterion04_aWrittenStatementOfWhichChangeMatteredMostSupported() public {
        fail("A written statement of which change mattered most, supported by the measurements");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
