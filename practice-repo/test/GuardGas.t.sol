// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-gas-profiling-guard-swap  (measure, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/GuardGas.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement the same function twice, once behind a storage-slot reentrancy guard and once
 *   behind a transient-storage guard, plus an unguarded control. Measure the overhead of each
 *   guard as the difference against the control, and measure the storage guard twice — once
 *   where the lock slot is cold on the first guarded call in the transaction, and once where it
 *   is already warm. Report a range for the storage guard rather than a single number, and
 *   explain the range. Then prove both guards still work by writing an attacker contract that
 *   attempts reentry and asserting it is blocked in both cases.
 */
contract GuardGasTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Measured overheads are reported for the transient guard and for the storage guard in both
    /// the cold-slot and warm-slot cases
    function test_criterion01_measuredOverheadsAreReportedForTheTransientGuardAnd() public {
        fail("Measured overheads are reported for the transient guard and for the storage guard in both the cold-slot and warm-slot cases");
    }

    /// A test asserts the transient guard's overhead is under 400 gas and the warm storage guard's
    /// is over 2500, so the ordering is machine-checked rather than asserted in prose
    function test_criterion02_aTestAssertsTheTransientGuardSOverheadIs() public {
        fail("A test asserts the transient guard's overhead is under 400 gas and the warm storage guard's is over 2500, so the ordering is machine-checked rather than asserted in prose");
    }

    /// A reentrancy attempt is blocked by both implementations, proven by a test that succeeds
    /// against the unguarded control
    function test_criterion03_aReentrancyAttemptIsBlockedByBothImplementationsProven() public {
        fail("A reentrancy attempt is blocked by both implementations, proven by a test that succeeds against the unguarded control");
    }

    /// The write-up states a range for the storage guard and names the condition that puts you at
    /// each end of it
    function test_criterion04_theWriteUpStatesARangeForTheStorage() public {
        fail("The write-up states a range for the storage guard and names the condition that puts you at each end of it");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
