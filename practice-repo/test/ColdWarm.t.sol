// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-gas-fee-market-cold-warm-probe  (measure, grain block, difficulty 3)
 * Run:      forge test -vv --junit --match-path test/ColdWarm.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a gas probe that measures, from your own machine, the cost of a cold SLOAD, a warm
 *   SLOAD, a cold BALANCE, a warm BALANCE, a cold EXTCODESIZE and a warm EXTCODESIZE. Wrap each
 *   operation in `gasleft()` deltas inside inline assembly, and first calibrate the harness
 *   overhead with an empty measurement so you can subtract it. Record your solc version, forge
 *   version and optimizer setting alongside the numbers, because the numbers are meaningless
 *   without them. Your first attempt will probably report every read as costing single-digit
 *   gas; work out why before reading the hint.
 */
contract ColdWarmTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Six measured figures produced by the learner's own run, each with the harness overhead
    /// subtracted
    function test_criterion01_sixMeasuredFiguresProducedByTheLearnerSOwn() public {
        fail("Six measured figures produced by the learner's own run, each with the harness overhead subtracted");
    }

    /// The cold SLOAD figure lands on 2100 and the cold account-access figures land on 2600 after
    /// subtracting overhead
    function test_criterion02_theColdSloadFigureLandsOn2100AndThe() public {
        fail("The cold SLOAD figure lands on 2100 and the cold account-access figures land on 2600 after subtracting overhead");
    }

    /// The test emits the toolchain versions and optimizer setting alongside the numbers
    function test_criterion03_theTestEmitsTheToolchainVersionsAndOptimizerSetting() public {
        fail("The test emits the toolchain versions and optimizer setting alongside the numbers");
    }

    /// A comment explains why an unsunk read measures as near-free and what change fixes it
    function test_criterion04_aCommentExplainsWhyAnUnsunkReadMeasuresAs() public {
        fail("A comment explains why an unsunk read measures as near-free and what change fixes it");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
