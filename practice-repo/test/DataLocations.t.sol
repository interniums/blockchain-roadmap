// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-six-places-a-byte-can-live  (measure, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/DataLocations.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   One value, six locations, six prices. Establish the table by measurement. THE WORD. Show
 *   that the machine's unit is 256 bits by storing a single byte and measuring what it cost.
 *   Then show packing working where it works and not working where it does not: pack four small
 *   values into one storage slot and measure the saving, then pack the same four in memory and
 *   show there is no saving. State the rule that explains the difference. THE STACK. Hit both
 *   stack limits. Reach past the sixteenth item and show the compiler failing rather than the
 *   machine — quote the error. Then push past the depth limit at runtime and show what the
 *   machine does instead. Two different failures, two different layers, and the write-up says
 *   which is which. CALLDATA. Show calldata is read-only by attempting to write it. Then show it
 *   is priced at the edge: send the same logical argument as a long calldata payload and as a
 *   short one that the contract expands, and report both total costs including the intrinsic
 *   charge. State which is cheaper and at what size the answer flips. THE TABLE. Close with the
 *   six-row table: stack, calldata, memory, storage, transient storage, and returndata. Cost to
 *   read, cost to write, and lifetime for each — every number measured, none copied.
 */
contract DataLocationsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Storing a single byte is measured, demonstrating the 256-bit word
    function test_criterion01_storingASingleByteIsMeasuredDemonstratingThe256() public {
        fail("Storing a single byte is measured, demonstrating the 256-bit word");
    }

    /// Packing four small values is measured in storage with a saving, and in memory with none
    function test_criterion02_packingFourSmallValuesIsMeasuredInStorageWith() public {
        fail("Packing four small values is measured in storage with a saving, and in memory with none");
    }

    /// The rule explaining the difference is stated
    function test_criterion03_theRuleExplainingTheDifferenceIsStated() public {
        fail("The rule explaining the difference is stated");
    }

    /// Reaching past the sixteenth stack item produces a quoted compiler error
    function test_criterion04_reachingPastTheSixteenthStackItemProducesAQuoted() public {
        fail("Reaching past the sixteenth stack item produces a quoted compiler error");
    }

    /// Exceeding stack depth at runtime is shown with the machine's behaviour, and the two failures
    /// attributed to different layers
    function test_criterion05_exceedingStackDepthAtRuntimeIsShownWithThe() public {
        fail("Exceeding stack depth at runtime is shown with the machine's behaviour, and the two failures attributed to different layers");
    }

    /// Calldata is shown read-only by a failed write attempt
    function test_criterion06_calldataIsShownReadOnlyByAFailedWrite() public {
        fail("Calldata is shown read-only by a failed write attempt");
    }

    /// A long calldata payload and a short expanded one are both costed including intrinsic gas,
    /// with the flip size stated
    function test_criterion07_aLongCalldataPayloadAndAShortExpandedOne() public {
        fail("A long calldata payload and a short expanded one are both costed including intrinsic gas, with the flip size stated");
    }

    /// A six-row table gives read cost, write cost and lifetime for each location, all measured
    function test_criterion08_aSixRowTableGivesReadCostWriteCost() public {
        fail("A six-row table gives read cost, write cost and lifetime for each location, all measured");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
