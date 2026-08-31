// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-sign-it-instead-and-batch-it  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/PermitAndBatch.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Two ways to reduce the transaction count, and the failure each one introduces. PERMIT.
 *   Implement a flow that takes a signed allowance instead of an approval transaction. Show the
 *   signature verifying and the allowance appearing without the owner having sent anything. Then
 *   break it twice: replay the same signature and show it rejected, and alter one field of the
 *   signed data and show it rejected. Name the mechanism that stops each. Then find the
 *   practical gap: state what happens when the token does not implement permit, and name the
 *   intermediary approach that covers that case and what it requires the user to trust. BATCHES.
 *   Implement a multi-id transfer moving ten different token ids in one call. Then demonstrate
 *   the property people assume and should check: make one id in the batch fail and show whether
 *   the others applied. State the rule, and say what a caller must do if the answer is not what
 *   they wanted. THE HOOK. Give a receiver a callback and use it to reject a specific id
 *   mid-batch. Then use the same callback to re-enter the sender. Show what the sender's state
 *   looks like at that moment, and state what ordering would have made the re-entry harmless.
 */
contract PermitAndBatchTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A signed allowance produces an allowance with no transaction from the owner
    function test_criterion01_aSignedAllowanceProducesAnAllowanceWithNoTransaction() public {
        fail("A signed allowance produces an allowance with no transaction from the owner");
    }

    /// Replaying the signature is rejected, and altering one signed field is rejected, with the
    /// mechanism named for each
    function test_criterion02_replayingTheSignatureIsRejectedAndAlteringOneSigned() public {
        fail("Replaying the signature is rejected, and altering one signed field is rejected, with the mechanism named for each");
    }

    /// What happens on a token without permit is stated, with the intermediary approach and what it
    /// asks the user to trust
    function test_criterion03_whatHappensOnATokenWithoutPermitIsStated() public {
        fail("What happens on a token without permit is stated, with the intermediary approach and what it asks the user to trust");
    }

    /// Ten token ids move in one call
    function test_criterion04_tenTokenIdsMoveInOneCall() public {
        fail("Ten token ids move in one call");
    }

    /// One id in a batch is made to fail, with whether the others applied shown and the rule stated
    function test_criterion05_oneIdInABatchIsMadeToFail() public {
        fail("One id in a batch is made to fail, with whether the others applied shown and the rule stated");
    }

    /// What a caller must do if the atomicity rule is not what they wanted
    function test_criterion06_whatACallerMustDoIfTheAtomicityRule() public {
        fail("What a caller must do if the atomicity rule is not what they wanted");
    }

    /// A receiver callback rejects a specific id mid-batch
    function test_criterion07_aReceiverCallbackRejectsASpecificIdMidBatch() public {
        fail("A receiver callback rejects a specific id mid-batch");
    }

    /// The callback re-enters the sender, with the sender's state at that moment shown and the safe
    /// ordering stated
    function test_criterion08_theCallbackReEntersTheSenderWithTheSender() public {
        fail("The callback re-enters the sender, with the sender's state at that moment shown and the safe ordering stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
