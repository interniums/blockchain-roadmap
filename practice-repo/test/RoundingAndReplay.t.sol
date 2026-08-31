// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {RoundingAndReplay} from "../src/security-vulnerability-classes/RoundingAndReplay.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-vulnerability-classes-a-wei-at-a-time  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/RoundingAndReplay.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Two classes that lose real money and look like nothing in a diff. ROUNDING. Build a contract
 *   that converts between two units — shares and assets, or a fee split — with a division that
 *   rounds in the caller's favour. Then extract value from it by repetition: run the operation
 *   many times and show the cumulative gain. Report the per-call gain, the number of calls to
 *   profit past gas, and the total. Then fix it and prove the fix: an invariant campaign
 *   asserting the contract never owes more than it holds across arbitrary sequences. State which
 *   direction each conversion now rounds and why that direction is the safe one. REPLAY. Build a
 *   function that accepts a signed authorisation and acts on it. Execute the same signature
 *   twice and take twice. Then fix it three ways — a nonce, a deadline, and marking the digest
 *   used — and for each state what it does and does not prevent. One of the three still permits
 *   an attack; find which and show it. Then the cross-context case: take a signature that is
 *   valid for one contract and get a second contract to accept it. Name the field that should
 *   have prevented it.
 */
contract RoundingAndReplayTest is Test {
    /// The subject, from src/security-vulnerability-classes/RoundingAndReplay.sol. Add functions there and call them here.
    RoundingAndReplay internal subject;

    function setUp() public {
        subject = new RoundingAndReplay();
    }

    /// A rounding bug is exploited by repetition, with per-call gain, break-even call count and
    /// total reported
    function test_criterion01_aRoundingBugIsExploitedByRepetitionWithPer() public {
        fail("A rounding bug is exploited by repetition, with per-call gain, break-even call count and total reported");
    }

    /// The fix is proven by an invariant campaign over arbitrary sequences asserting the contract
    /// never owes more than it holds
    function test_criterion02_theFixIsProvenByAnInvariantCampaignOver() public {
        fail(
            "The fix is proven by an invariant campaign over arbitrary sequences asserting the contract never owes more than it holds"
        );
    }

    /// The rounding direction of each conversion is stated with why it is safe
    function test_criterion03_theRoundingDirectionOfEachConversionIsStatedWith() public {
        fail("The rounding direction of each conversion is stated with why it is safe");
    }

    /// One signature is accepted twice, taking twice
    function test_criterion04_oneSignatureIsAcceptedTwiceTakingTwice() public {
        fail("One signature is accepted twice, taking twice");
    }

    /// Nonce, deadline and used-digest fixes are each implemented with what they do and do not
    /// prevent
    function test_criterion05_nonceDeadlineAndUsedDigestFixesAreEachImplemented() public {
        fail("Nonce, deadline and used-digest fixes are each implemented with what they do and do not prevent");
    }

    /// The fix that still permits an attack is identified and the attack shown
    function test_criterion06_theFixThatStillPermitsAnAttackIsIdentified() public {
        fail("The fix that still permits an attack is identified and the attack shown");
    }

    /// A signature valid for one contract is accepted by another, with the missing field named
    function test_criterion07_aSignatureValidForOneContractIsAcceptedBy() public {
        fail("A signature valid for one contract is accepted by another, with the missing field named");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
