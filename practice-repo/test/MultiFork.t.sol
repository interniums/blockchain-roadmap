// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {MultiFork} from "../src/toolchain-fork-testing/MultiFork.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fork-testing-persistent-helper  (fix, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/MultiFork.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   You are given a test that creates two forks, deploys a helper contract while the first is
 *   active, switches to the second, and then reverts on a call into the helper. Diagnose it from
 *   the trace and fix it with a persistence declaration rather than by redeploying. Then, in the
 *   same file, reproduce the second trap: call `vm.createSelectFork` twice with the same URL and
 *   show that state written under the first is invisible afterwards, then fix that by retaining
 *   and reusing the fork id. Add an assertion documenting which accounts were persistent before
 *   you declared anything.
 */
contract MultiForkTest is Test {
    /// The subject, from src/toolchain-fork-testing/MultiFork.sol. Add functions there and call them here.
    MultiFork internal subject;

    function setUp() public {
        subject = new MultiFork();
    }

    /// A test reproduces the failure — a call into a contract that exists on one fork and not the
    /// other
    function test_criterion01_aTestReproducesTheFailureACallIntoA() public {
        fail(
            unicode"A test reproduces the failure — a call into a contract that exists on one fork and not the other"
        );
    }

    /// The repaired test passes and the fix is a persistence declaration, with no second deployment
    /// anywhere in the file
    function test_criterion02_theRepairedTestPassesAndTheFixIsA() public {
        fail(
            "The repaired test passes and the fix is a persistence declaration, with no second deployment anywhere in the file"
        );
    }

    /// A test demonstrates that two createSelectFork calls with the same URL yield independent
    /// forks, and a fixed version reuses the id instead
    function test_criterion03_aTestDemonstratesThatTwoCreateselectforkCallsWithThe() public {
        fail(
            "A test demonstrates that two createSelectFork calls with the same URL yield independent forks, and a fixed version reuses the id instead"
        );
    }

    /// An assertion or comment records which accounts survive a fork switch by default
    function test_criterion04_anAssertionOrCommentRecordsWhichAccountsSurviveA() public {
        fail("An assertion or comment records which accounts survive a fork switch by default");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
