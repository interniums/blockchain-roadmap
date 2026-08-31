// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-threat-modeling-tx-origin-7702  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/TxOriginGuard.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a contract whose sensitive function is guarded by require(msg.sender == tx.origin),
 *   stated in its comments as meaning "callers must not be contracts". On a Pectra-or-later
 *   fork, use an EIP-7702 delegation to make an EOA execute attacker-supplied contract logic
 *   while still satisfying the guard, and drain or otherwise misuse the guarded function. Then
 *   write the one-paragraph threat-model consequence: which assumption in a pre-Pectra
 *   trust-assumption inventory this invalidates, and what the guard should have been checking
 *   instead.
 */
contract TxOriginGuardTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test proves the guarded function executes attacker logic through a delegated EOA
    function test_criterion01_aTestProvesTheGuardedFunctionExecutesAttackerLogic() public {
        fail("A test proves the guarded function executes attacker logic through a delegated EOA");
    }

    /// A second test shows the same attack failing against a guard that checks an explicit
    /// allowlist or capability instead
    function test_criterion02_aSecondTestShowsTheSameAttackFailingAgainst() public {
        fail("A second test shows the same attack failing against a guard that checks an explicit allowlist or capability instead");
    }

    /// The written note names the invalidated assumption, not just the failing line
    function test_criterion03_theWrittenNoteNamesTheInvalidatedAssumptionNotJust() public {
        fail("The written note names the invalidated assumption, not just the failing line");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
