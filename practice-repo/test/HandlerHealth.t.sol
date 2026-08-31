// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-invariant-testing-fix-revert-rate  (fix, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/HandlerHealth.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   You are given a passing invariant campaign whose handler reverts on the overwhelming
 *   majority of generated calls — unbounded amounts, withdrawals from actors with no balance,
 *   transfers to address(0). Turn on the campaign metrics and record the per-function revert and
 *   discard rates before changing anything. Repair the handler so that calls are constructed to
 *   be able to succeed: bound amounts against the actor's actual balance, select actors from a
 *   fixed set, and skip operations whose preconditions are unmet rather than letting them
 *   revert. Record the rates again, and demonstrate that the repaired campaign now reaches a
 *   state the original never did by asserting on a state variable that only a deep sequence can
 *   produce.
 */
contract HandlerHealthTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Before-and-after revert rates are captured for each handler function
    function test_criterion01_beforeAndAfterRevertRatesAreCapturedForEach() public {
        fail("Before-and-after revert rates are captured for each handler function");
    }

    /// After the fix, a test asserts that the campaign reached a state requiring a multi-call
    /// sequence, which fails against the original handler
    function test_criterion02_afterTheFixATestAssertsThatTheCampaign() public {
        fail("After the fix, a test asserts that the campaign reached a state requiring a multi-call sequence, which fails against the original handler");
    }

    /// The invariant still passes on the correct implementation and still fails on a seeded bug
    function test_criterion03_theInvariantStillPassesOnTheCorrectImplementationAnd() public {
        fail("The invariant still passes on the correct implementation and still fails on a seeded bug");
    }

    /// The learner can state, in one sentence, why the original campaign's green result carried
    /// almost no information
    function test_criterion04_theLearnerCanStateInOneSentenceWhyThe() public {
        fail("The learner can state, in one sentence, why the original campaign's green result carried almost no information");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
