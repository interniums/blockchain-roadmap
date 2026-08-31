// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-silent-call-failure  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/SilentFailure.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write contract `A` that updates its own state and then low-level-calls contract `B`,
 *   discarding the returned boolean. Make `B` always revert. Write a Foundry test asserting that
 *   A's transaction succeeds and that A's state changed anyway. Then extend the exercise: leave
 *   B non-reverting but gas-hungry, and have the test call A while forwarding a gas amount
 *   chosen so that B runs out while A completes — the same silent failure produced by a
 *   different mechanism. Finally fix A so both cases revert, and show that the revert payload
 *   from B is bubbled up unchanged.
 */
contract SilentFailureTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A passing test in which the outer transaction succeeds, A's state changed, and B reverted
    function test_criterion01_aPassingTestInWhichTheOuterTransactionSucceeds() public {
        fail("A passing test in which the outer transaction succeeds, A's state changed, and B reverted");
    }

    /// A second passing test producing the same silent failure via insufficient forwarded gas
    /// rather than a revert
    function test_criterion02_aSecondPassingTestProducingTheSameSilentFailure() public {
        fail("A second passing test producing the same silent failure via insufficient forwarded gas rather than a revert");
    }

    /// A third test on the fixed version proving it reverts, with B's custom error selector
    /// preserved in the bubbled data
    function test_criterion03_aThirdTestOnTheFixedVersionProvingIt() public {
        fail("A third test on the fixed version proving it reverts, with B's custom error selector preserved in the bubbled data");
    }

    /// A comment distinguishing the two failure mechanisms and explaining why the fix catches both
    function test_criterion04_aCommentDistinguishingTheTwoFailureMechanismsAndExplaining() public {
        fail("A comment distinguishing the two failure mechanisms and explaining why the fix catches both");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
