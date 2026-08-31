// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-account-abstraction-drain-a-paymaster  (break, grain block, difficulty 3)
 * Run:      forge test --match-path test/PaymasterDrain.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a paymaster that sponsors any UserOperation from any account - the shape that appears
 *   in most "gasless onboarding" demos. From an unrelated account, drain its EntryPoint deposit
 *   by submitting valid, expensive, sponsored operations. Measure how much you extracted and how
 *   many operations it took. Then apply the scoping from the previous exercise and show the same
 *   attack fails.
 */
contract PaymasterDrainTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test drives the permissive paymaster's deposit to zero from an account with no
    /// relationship to the application, and asserts the amount extracted
    function test_criterion01_aTestDrivesThePermissivePaymasterSDepositTo() public {
        fail("A test drives the permissive paymaster's deposit to zero from an account with no relationship to the application, and asserts the amount extracted");
    }

    /// The same attack against the scoped paymaster reverts during validation
    function test_criterion02_theSameAttackAgainstTheScopedPaymasterRevertsDuring() public {
        fail("The same attack against the scoped paymaster reverts during validation");
    }

    /// The test reports the number of operations required, and a comment states what that number
    /// would be at mainnet gas prices
    function test_criterion03_theTestReportsTheNumberOfOperationsRequiredAnd() public {
        fail("The test reports the number of operations required, and a comment states what that number would be at mainnet gas prices");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
