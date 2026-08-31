// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-account-abstraction-scoped-paymaster  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/ScopedPaymaster.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write and deploy a paymaster that sponsors UserOperations only when the call targets one
 *   specific contract and one specific function selector, with a per-account cap on how much gas
 *   it will cover in a period. Fund its deposit at the EntryPoint. Then submit three
 *   UserOperations through a bundler against a local node: the intended call, the same call to a
 *   different contract, and a different function on the intended contract. Only the first may be
 *   sponsored.
 */
contract ScopedPaymasterTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The intended call is sponsored and the sending account's ETH balance is unchanged
    function test_criterion01_theIntendedCallIsSponsoredAndTheSendingAccount() public {
        fail("The intended call is sponsored and the sending account's ETH balance is unchanged");
    }

    /// Both the wrong-target and wrong-selector operations are rejected during validation, not
    /// during execution
    function test_criterion02_bothTheWrongTargetAndWrongSelectorOperationsAre() public {
        fail("Both the wrong-target and wrong-selector operations are rejected during validation, not during execution");
    }

    /// A fourth test proves the per-account cap is enforced by exhausting it and showing the next
    /// operation is refused
    function test_criterion03_aFourthTestProvesThePerAccountCapIs() public {
        fail("A fourth test proves the per-account cap is enforced by exhausting it and showing the next operation is refused");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
