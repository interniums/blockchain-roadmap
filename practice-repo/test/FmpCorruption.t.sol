// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-fmp-corruption  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/FmpCorruption.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Inside an inline assembly block, deliberately write to memory below 0x80 — first to the
 *   free-memory pointer at 0x40, then in a second variant to the permanently-zero slot at 0x60.
 *   After each, allocate a new dynamic array in ordinary Solidity and observe what happens to
 *   it. Write tests that assert the corruption concretely: an array whose length or contents are
 *   wrong, or two allocations that overlap. For each variant, name in a comment which reserved
 *   region was clobbered and which piece of compiler-generated behaviour depended on it. Then
 *   write the corrected version that allocates properly by reading and advancing the pointer.
 */
contract FmpCorruptionTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A failing-then-passing pair of tests for the 0x40 corruption, with an assertion on the
    /// concrete wrong value
    function test_criterion01_aFailingThenPassingPairOfTestsForThe() public {
        fail("A failing-then-passing pair of tests for the 0x40 corruption, with an assertion on the concrete wrong value");
    }

    /// A second pair for the 0x60 zero-slot corruption
    function test_criterion02_aSecondPairForThe0x60ZeroSlotCorruption() public {
        fail("A second pair for the 0x60 zero-slot corruption");
    }

    /// Each test names the clobbered region and the compiler behaviour that relied on it
    function test_criterion03_eachTestNamesTheClobberedRegionAndTheCompiler() public {
        fail("Each test names the clobbered region and the compiler behaviour that relied on it");
    }

    /// The corrected version reads 0x40, uses the bytes it names, and writes the advanced pointer
    /// back
    function test_criterion04_theCorrectedVersionReads0x40UsesTheBytesIt() public {
        fail("The corrected version reads 0x40, uses the bytes it names, and writes the advanced pointer back");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
