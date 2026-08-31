// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {SessionKeyValidator} from "../src/app-session-keys/SessionKeyValidator.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-scoped-validator  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/SessionKeyValidator.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On Anvil, stand up a modular smart account - or an EOA delegated to modular account code
 *   under EIP-7702 - and install a validator module that accepts a session key only when the
 *   call targets one address, uses one function selector, carries a value at or below a cap, and
 *   arrives before a `validUntil` timestamp. Write the policy as data, not as hardcoded
 *   constants, so a second session with different bounds can be installed alongside the first.
 */
contract SessionKeyValidatorTest is Test {
    /// The subject, from src/app-session-keys/SessionKeyValidator.sol. Add functions there and call them here.
    SessionKeyValidator internal subject;

    function setUp() public {
        subject = new SessionKeyValidator();
    }

    /// Four tests pass - the allowed call succeeds; a call to a different target reverts; a call
    /// over the value cap reverts; a call after validUntil reverts
    function test_criterion01_fourTestsPassTheAllowedCallSucceedsACall() public {
        fail(
            "Four tests pass - the allowed call succeeds; a call to a different target reverts; a call over the value cap reverts; a call after validUntil reverts"
        );
    }

    /// A fifth test installs a second session with different bounds and proves the two do not
    /// interfere
    function test_criterion02_aFifthTestInstallsASecondSessionWithDifferent() public {
        fail("A fifth test installs a second session with different bounds and proves the two do not interfere");
    }

    /// No test passes because of a check performed off-chain
    function test_criterion03_noTestPassesBecauseOfACheckPerformedOff() public {
        fail("No test passes because of a check performed off-chain");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
