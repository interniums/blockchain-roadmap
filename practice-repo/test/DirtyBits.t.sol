// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-yul-assembly-dirty-address-bits  (fix, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/DirtyBits.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write an assembly block that compares two `address` values with `eq` and no masking, and
 *   construct a case where one word carries non-zero garbage in its upper twelve bytes so the
 *   comparison returns false for what is logically the same address. Then show the second half
 *   of the same problem: hash the unmasked word and show the digest differs from the digest of
 *   the clean address. Fix both by masking, deriving the mask in code from the type's width
 *   rather than pasting a hex constant. Add a third case using `lt` where `slt` was meant, and
 *   show it silently produces the wrong branch.
 */
contract DirtyBitsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test that fails before the fix by showing two logically equal addresses comparing unequal
    function test_criterion01_aTestThatFailsBeforeTheFixByShowing() public {
        fail("A test that fails before the fix by showing two logically equal addresses comparing unequal");
    }

    /// A test showing keccak256 of the dirty word differs from keccak256 of the clean one
    function test_criterion02_aTestShowingKeccak256OfTheDirtyWordDiffers() public {
        fail("A test showing keccak256 of the dirty word differs from keccak256 of the clean one");
    }

    /// The same tests passing after masking, with the mask derived rather than hardcoded
    function test_criterion03_theSameTestsPassingAfterMaskingWithTheMask() public {
        fail("The same tests passing after masking, with the mask derived rather than hardcoded");
    }

    /// A third test showing lt versus slt producing different branches for a negative value
    function test_criterion04_aThirdTestShowingLtVersusSltProducingDifferent() public {
        fail("A third test showing lt versus slt producing different branches for a negative value");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
