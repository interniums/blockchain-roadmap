// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {SlotDerivation} from "../src/evm-state-tries/SlotDerivation.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-state-tries-slot-archaeology  (measure, grain block, difficulty 3)
 * Run:      forge test -vv --junit --match-path test/SlotDerivation.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   For a deployed ERC-20 on a pinned fork, compute the storage slot holding a chosen holder's
 *   balance as `keccak256(abi.encode(holder, balancesSlot))` and read it with `vm.load`. Compare
 *   it against what `balanceOf` returns, for three different holders. Then measure the gas of
 *   three storage transitions on a scratch contract in the same test run — zero to non-zero,
 *   non-zero to a different non-zero, and non-zero to zero — recording the numbers from your own
 *   run rather than from a table. Make sure each measured read or write is assigned into a
 *   storage sink so the compiler cannot eliminate it as dead code.
 */
contract SlotDerivationTest is Test {
    /// The subject, from src/evm-state-tries/SlotDerivation.sol. Add functions there and call them here.
    SlotDerivation internal subject;

    function setUp() public {
        subject = new SlotDerivation();
    }

    /// The derived slot value equals balanceOf for three distinct holders
    function test_criterion01_theDerivedSlotValueEqualsBalanceofForThreeDistinct() public {
        fail("The derived slot value equals balanceOf for three distinct holders");
    }

    /// The test emits three measured gas figures for the three SSTORE transitions from the
    /// learner's own run
    function test_criterion02_theTestEmitsThreeMeasuredGasFiguresForThe() public {
        fail("The test emits three measured gas figures for the three SSTORE transitions from the learner's own run");
    }

    /// A test asserts that a slot that has never been written and a slot explicitly written to zero
    /// read identically
    function test_criterion03_aTestAssertsThatASlotThatHasNever() public {
        fail(
            "A test asserts that a slot that has never been written and a slot explicitly written to zero read identically"
        );
    }

    /// The test file states the slot formula in a comment, written from memory rather than pasted
    function test_criterion04_theTestFileStatesTheSlotFormulaInA() public {
        fail("The test file states the slot formula in a comment, written from memory rather than pasted");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
