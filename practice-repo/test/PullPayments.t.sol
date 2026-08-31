// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {PullPayments} from "../src/solidity-contract-patterns/PullPayments.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-contract-patterns-push-to-pull-conversion  (fix, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/PullPayments.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Start from a distribute(address[] recipients) that pushes ETH inside a loop using .transfer.
 *   Prove three separate failures against it: a recipient whose receive() reverts blocks
 *   everyone, a recipient whose receive() burns gas blocks everyone, and a smart-contract wallet
 *   whose receive() legitimately costs more than 2300 gas fails even though nothing is wrong
 *   with it. Convert to pull payments with a credits mapping and a withdraw() using
 *   call{value:}("") with a checked return, and prove all three now succeed for everyone else.
 */
contract PullPaymentsTest is Test {
    /// The subject, from src/solidity-contract-patterns/PullPayments.sol. Add functions there and call them here.
    PullPayments internal subject;

    function setUp() public {
        subject = new PullPayments();
    }

    /// Three tests each prove a distinct failure of the push version — reverting recipient,
    /// gas-burning recipient, and a recipient needing more than the 2300-gas stipend
    function test_criterion01_threeTestsEachProveADistinctFailureOfThe() public {
        fail(
            unicode"Three tests each prove a distinct failure of the push version — reverting recipient, gas-burning recipient, and a recipient needing more than the 2300-gas stipend"
        );
    }

    /// The same three scenarios all pass against the pull version, with every other recipient paid
    function test_criterion02_theSameThreeScenariosAllPassAgainstThePull() public {
        fail("The same three scenarios all pass against the pull version, with every other recipient paid");
    }

    /// A test asserts the pull version checks the return value of the low-level call and reverts on
    /// failure
    function test_criterion03_aTestAssertsThePullVersionChecksTheReturn() public {
        fail("A test asserts the pull version checks the return value of the low-level call and reverts on failure");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
