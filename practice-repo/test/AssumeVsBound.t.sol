// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fuzzing-assume-vs-bound  (measure, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/AssumeVsBound.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
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
 */
contract AssumeVsBoundTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The bound version passes with the full configured run count and the clamp version passes too
    function test_criterion01_theBoundVersionPassesWithTheFullConfiguredRun() public {
        fail("The bound version passes with the full configured run count and the clamp version passes too");
    }

    /// A test asserts that under clamping, more than half the observed values equal the upper bound
    /// exactly
    function test_criterion02_aTestAssertsThatUnderClampingMoreThanHalf() public {
        fail("A test asserts that under clamping, more than half the observed values equal the upper bound exactly");
    }

    /// A test configured with a small max_test_rejects fails with a rejection error, and the
    /// learner can distinguish that output from a property violation at a glance
    function test_criterion03_aTestConfiguredWithASmallMaxTestRejects() public {
        fail("A test configured with a small max_test_rejects fails with a rejection error, and the learner can distinguish that output from a property violation at a glance");
    }

    /// Wall-clock timings for all three are recorded, with a one-line explanation of the assume
    /// version's acceptance probability
    function test_criterion04_wallClockTimingsForAllThreeAreRecordedWith() public {
        fail("Wall-clock timings for all three are recorded, with a one-line explanation of the assume version's acceptance probability");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
