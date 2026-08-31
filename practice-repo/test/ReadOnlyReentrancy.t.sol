// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {ReadOnlyReentrancy} from "../src/security-vulnerability-classes/ReadOnlyReentrancy.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-vulnerability-classes-readonly-reentrancy  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/ReadOnlyReentrancy.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a two-contract system: a pool that holds two assets and exposes a nonReentrant deposit
 *   and withdraw plus a view function returning a share price derived from its balances, and a
 *   consumer contract that reads that share price to decide how much to lend. Every
 *   state-changing function on the pool carries a standard reentrancy guard. Write an attacker
 *   that, during the callback of a withdraw, calls the consumer, which reads the unguarded view
 *   while the pool's state is mid-update, and extracts value. Then produce two fixes and compare
 *   them: guard the read path, and reorder the pool so no externally readable value is ever
 *   inconsistent across an external call.
 */
contract ReadOnlyReentrancyTest is Test {
    /// The subject, from src/security-vulnerability-classes/ReadOnlyReentrancy.sol. Add functions there and call them here.
    ReadOnlyReentrancy internal subject;

    function setUp() public {
        subject = new ReadOnlyReentrancy();
    }

    /// A test proves the attacker profits while every state-changing function on the pool is
    /// guarded
    function test_criterion01_aTestProvesTheAttackerProfitsWhileEveryState() public {
        fail("A test proves the attacker profits while every state-changing function on the pool is guarded");
    }

    /// A test proves the same attack fails once the read path is protected
    function test_criterion02_aTestProvesTheSameAttackFailsOnceThe() public {
        fail("A test proves the same attack fails once the read path is protected");
    }

    /// A third test proves the same attack fails under checks-effects-interactions ordering with no
    /// guard on the view
    function test_criterion03_aThirdTestProvesTheSameAttackFailsUnder() public {
        fail(
            "A third test proves the same attack fails under checks-effects-interactions ordering with no guard on the view"
        );
    }

    /// A written note states which of the two fixes you would ship and what it costs
    function test_criterion04_aWrittenNoteStatesWhichOfTheTwoFixes() public {
        fail("A written note states which of the two fixes you would ship and what it costs");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
