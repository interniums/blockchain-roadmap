// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-incident-response-bounded-pause-vault  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/BoundedPause.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement a vault with the mature pause pattern: a low-threshold guardian multisig can pause
 *   immediately; only governance can unpause early; the pause expires automatically after a
 *   fixed window and the protocol resumes without anyone acting; and a cooldown after expiry
 *   prevents an immediate re-pause. Add one rung below full pause - a per-block withdrawal cap
 *   that the guardian can lower without stopping the protocol - so the drill in this module has
 *   more than one option. Prove all of it in Foundry, including the adversarial property: a
 *   guardian acting in bad faith cannot keep user funds frozen indefinitely.
 */
contract BoundedPauseTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test proves the guardian can pause at the low threshold and cannot unpause
    function test_criterion01_aTestProvesTheGuardianCanPauseAtThe() public {
        fail("A test proves the guardian can pause at the low threshold and cannot unpause");
    }

    /// A test proves the pause expires without any transaction being sent, and withdrawals succeed
    /// immediately after expiry
    function test_criterion02_aTestProvesThePauseExpiresWithoutAnyTransaction() public {
        fail("A test proves the pause expires without any transaction being sent, and withdrawals succeed immediately after expiry");
    }

    /// A test proves a guardian re-pausing during the cooldown reverts, and computes the maximum
    /// fraction of time a bad-faith guardian can keep the protocol paused
    function test_criterion03_aTestProvesAGuardianRePausingDuringThe() public {
        fail("A test proves a guardian re-pausing during the cooldown reverts, and computes the maximum fraction of time a bad-faith guardian can keep the protocol paused");
    }

    /// A test proves the withdrawal cap can be lowered by the guardian while the protocol stays
    /// live, and that honest users can still exit at the reduced rate
    function test_criterion04_aTestProvesTheWithdrawalCapCanBeLowered() public {
        fail("A test proves the withdrawal cap can be lowered by the guardian while the protocol stays live, and that honest users can still exit at the reduced rate");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
