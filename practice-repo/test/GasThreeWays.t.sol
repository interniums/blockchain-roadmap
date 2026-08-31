// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-gas-profiling-three-numbers  (measure, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/GasThreeWays.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take one storage-writing function and measure it three ways: from the aggregate gas report,
 *   from the same run with isolation enabled, and from a named snapshot region bracketing only
 *   the call itself. Then measure it a fourth way with a hand-rolled `gasleft()` probe — and
 *   make the probe correct, which for any read means assigning the result into a storage sink so
 *   it cannot be eliminated. Deliberately write the naive version first, observe that every read
 *   costs the same implausibly small number, and record that as a finding. Subtract the harness
 *   overhead. Write down, for each of the four numbers, exactly what is included and what is
 *   excluded, and which one is closest to what a user pays.
 */
contract GasThreeWaysTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Four numbers are recorded for the same function, with the isolation setting stated for each
    function test_criterion01_fourNumbersAreRecordedForTheSameFunctionWith() public {
        fail("Four numbers are recorded for the same function, with the isolation setting stated for each");
    }

    /// A test asserts that the naive probe over a read produces a value below a threshold that no
    /// real cold read could produce, demonstrating the elimination
    function test_criterion02_aTestAssertsThatTheNaiveProbeOverA() public {
        fail("A test asserts that the naive probe over a read produces a value below a threshold that no real cold read could produce, demonstrating the elimination");
    }

    /// The sink-based probe reproduces the documented cold and warm read costs to within the
    /// harness overhead
    function test_criterion03_theSinkBasedProbeReproducesTheDocumentedColdAnd() public {
        fail("The sink-based probe reproduces the documented cold and warm read costs to within the harness overhead");
    }

    /// A written note states which of the four numbers is closest to a mainnet transaction cost and
    /// names the two components still missing from it
    function test_criterion04_aWrittenNoteStatesWhichOfTheFourNumbers() public {
        fail("A written note states which of the four numbers is closest to a mainnet transaction cost and names the two components still missing from it");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
