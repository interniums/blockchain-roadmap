// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-unit-testing-nested-expect-revert  (fix, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ExpectRevertTraps.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   You are given a Vault with a `withdraw(uint256)` that reverts with a custom
 *   `InsufficientBalance(uint256 requested, uint256 available)` error, and a test written as
 *   `vm.expectRevert(Vault.InsufficientBalance.selector);
 *   vault.withdraw(token.balanceOf(user));`. First prove the test is worthless: make `withdraw`
 *   correct — so that it does not revert at all — and show the test still passes. Then repair it
 *   by hoisting the inner call, and tighten the assertion from a bare selector to the fully
 *   ABI-encoded revert data including both arguments. Finally add a case that wraps a low-level
 *   `.call` in expectRevert and assert on the returned boolean correctly, not intuitively.
 */
contract ExpectRevertTrapsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test demonstrates that the nested form passes against a withdraw implementation that never
    /// reverts
    function test_criterion01_aTestDemonstratesThatTheNestedFormPassesAgainst() public {
        fail("A test demonstrates that the nested form passes against a withdraw implementation that never reverts");
    }

    /// The repaired test fails when withdraw stops reverting, and passes when it reverts correctly
    function test_criterion02_theRepairedTestFailsWhenWithdrawStopsRevertingAnd() public {
        fail("The repaired test fails when withdraw stops reverting, and passes when it reverts correctly");
    }

    /// One test matches the full encoded revert data and fails if either error argument is wrong
    function test_criterion03_oneTestMatchesTheFullEncodedRevertDataAnd() public {
        fail("One test matches the full encoded revert data and fails if either error argument is wrong");
    }

    /// One test wraps a low-level call and asserts the correct value of the returned success
    /// boolean, with a comment explaining what that boolean now means
    function test_criterion04_oneTestWrapsALowLevelCallAndAsserts() public {
        fail("One test wraps a low-level call and asserts the correct value of the returned success boolean, with a comment explaining what that boolean now means");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
