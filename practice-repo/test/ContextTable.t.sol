// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-calls-delegatecall-context-table  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ContextTable.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write Caller and Target, where Target.probe() reports address(this), msg.sender, msg.value
 *   and address(this).balance. Invoke it five ways from Caller: a typed external call, a
 *   low-level .call, a .delegatecall, a .staticcall, and this.probe() on a copy of the function
 *   inside Caller itself. Before running, fill in a five-row by four-column prediction table in
 *   a comment. Then assert every cell in a Foundry test. The staticcall row cannot report by
 *   emitting, since LOG is forbidden in a static context — returning the values instead is part
 *   of the exercise.
 */
contract ContextTableTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Every cell of the five-by-four table is asserted, and the assertions match the prediction
    /// comment
    function test_criterion01_everyCellOfTheFiveByFourTableIs() public {
        fail("Every cell of the five-by-four table is asserted, and the assertions match the prediction comment");
    }

    /// A test proves that emitting a log inside the staticcall path reverts, and the passing
    /// version returns the values instead
    function test_criterion02_aTestProvesThatEmittingALogInsideThe() public {
        fail("A test proves that emitting a log inside the staticcall path reverts, and the passing version returns the values instead");
    }

    /// A test asserts msg.sender inside the delegatecalled probe is the original caller and not the
    /// Caller contract
    function test_criterion03_aTestAssertsMsgSenderInsideTheDelegatecalledProbe() public {
        fail("A test asserts msg.sender inside the delegatecalled probe is the original caller and not the Caller contract");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
