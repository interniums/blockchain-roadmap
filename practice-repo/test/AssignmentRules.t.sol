// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-language-core-assignment-rules-gas  (measure, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/AssignmentRules.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a contract with a storage array uint[] x and three external functions that each take
 *   the same input a different way: (uint[] memory a), (uint[] calldata a), and (uint[] calldata
 *   a) that reads only a[0]. Each of the first two assigns into x so the deep copy actually
 *   happens. Add a fourth function that takes a local uint[] storage pointer into x, reassigns
 *   the pointer, and writes through it, with assertions proving which of the two operations
 *   touched state. Drive all four from a Foundry test at input lengths 1, 10 and 100, capturing
 *   gas with vm.startSnapshotGas or gasleft() deltas, and assert the expected shape of each
 *   curve rather than a fixed number.
 */
contract AssignmentRulesTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the memory-parameter version's gas grows with input length while the
    /// read-only calldata version stays roughly flat
    function test_criterion01_aTestAssertsTheMemoryParameterVersionSGas() public {
        fail("A test asserts the memory-parameter version's gas grows with input length while the read-only calldata version stays roughly flat");
    }

    /// A test proves that assigning to a local storage pointer changes no state and that writing
    /// through it does
    function test_criterion02_aTestProvesThatAssigningToALocalStorage() public {
        fail("A test proves that assigning to a local storage pointer changes no state and that writing through it does");
    }

    /// Each test name states which of the four assignment rules it exercises
    function test_criterion03_eachTestNameStatesWhichOfTheFourAssignment() public {
        fail("Each test name states which of the four assignment rules it exercises");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
