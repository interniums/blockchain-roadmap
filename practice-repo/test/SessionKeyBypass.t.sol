// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-bypass-your-own-policy  (break, grain block, difficulty 4)
 * Run:      forge test --match-path test/SessionKeyBypass.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Attack your own validator from the previous exercise with at least three approaches: replay
 *   the same session authorisation on a second chain id; exhaust the value cap and then replay
 *   an earlier accepted call to spend past it; and invoke a different function whose selector
 *   you can influence. Find at least one working bypass. Then patch it, name the policy
 *   dimension that was missing, and add the regression test.
 */
contract SessionKeyBypassTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// At least one test demonstrates a working bypass against the original module and is marked as
    /// such
    function test_criterion01_atLeastOneTestDemonstratesAWorkingBypassAgainst() public {
        fail("At least one test demonstrates a working bypass against the original module and is marked as such");
    }

    /// After the patch, that test asserts a revert instead, and the previously passing
    /// legitimate-use tests still pass
    function test_criterion02_afterThePatchThatTestAssertsARevertInstead() public {
        fail("After the patch, that test asserts a revert instead, and the previously passing legitimate-use tests still pass");
    }

    /// A comment in the test file names the policy dimension the bypass exploited
    function test_criterion03_aCommentInTheTestFileNamesThePolicy() public {
        fail("A comment in the test file names the policy dimension the bypass exploited");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
