// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-exploit-archaeology-fix-rounding-directions  (fix, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/invariant/StableRounding.invariant.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a stable-swap style pool implementation with the Balancer V2 rounding-direction
 *   inconsistency reproduced in its scaling and down-scaling routines. First write an invariant
 *   test that detects the drift by executing at least sixty-five sequential micro-swaps within a
 *   single test and asserting that the pool invariant does not decrease. Confirm the test fails
 *   on the original code. Then correct the rounding directions so both halves round against the
 *   user, and confirm the same test passes without weakening the assertion. Finish with the
 *   attacker-economics note: state the gas cost of the sixty-five-swap sequence and the profit
 *   per unit of capital, and say at what pool size the attack stops being worth firing.
 */
contract StableRoundingInvariantTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The invariant test fails on the unfixed implementation and passes on the fixed one
    function test_criterion01_theInvariantTestFailsOnTheUnfixedImplementationAnd() public {
        fail("The invariant test fails on the unfixed implementation and passes on the fixed one");
    }

    /// The assertion is unchanged between the two runs
    function test_criterion02_theAssertionIsUnchangedBetweenTheTwoRuns() public {
        fail("The assertion is unchanged between the two runs");
    }

    /// The test exercises at least sixty-five sequential operations in one transaction
    function test_criterion03_theTestExercisesAtLeastSixtyFiveSequentialOperations() public {
        fail("The test exercises at least sixty-five sequential operations in one transaction");
    }

    /// A written note gives the gas cost and the break-even pool size
    function test_criterion04_aWrittenNoteGivesTheGasCostAndThe() public {
        fail("A written note gives the gas cost and the break-even pool size");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
