// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-storage-layout-packing-gas-measurement  (measure, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/PackingGas.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy two contracts holding identical fields — a uint128, a uint128 and a uint256 —
 *   declared in two different orders, plus a third variant that inserts a struct between two
 *   small fields. For each, produce a slot map from forge inspect storage-layout and measure
 *   deployment gas and the gas of writing all three fields in one transaction and of writing
 *   only one field. Then find and document an access pattern under which the packed layout is
 *   more expensive than the unpacked one.
 */
contract PackingGasTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the two orderings occupy a different number of slots, using values taken from
    /// forge inspect storage-layout
    function test_criterion01_aTestAssertsTheTwoOrderingsOccupyADifferent() public {
        fail("A test asserts the two orderings occupy a different number of slots, using values taken from forge inspect storage-layout");
    }

    /// Measured write-all and write-one gas is recorded for every variant with the environment
    /// (solc version, optimizer setting) stated
    function test_criterion02_measuredWriteAllAndWriteOneGasIsRecorded() public {
        fail("Measured write-all and write-one gas is recorded for every variant with the environment (solc version, optimizer setting) stated");
    }

    /// A test demonstrates at least one access pattern where the packed layout costs more, and the
    /// file explains why in terms of masking
    function test_criterion03_aTestDemonstratesAtLeastOneAccessPatternWhere() public {
        fail("A test demonstrates at least one access pattern where the packed layout costs more, and the file explains why in terms of masking");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
