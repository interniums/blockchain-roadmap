// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-threat-modeling-capstone-the-document-before-the-bugs  (write, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/ThreatModel.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a protocol of at least three contracts — yours or a real one — and produce a threat
 *   model document that a fuzzer can consume. The test of a threat model is not that it reads
 *   well; it is that its assumptions are written precisely enough for a machine to attack. ZONES
 *   AND BOUNDARIES. Cut the system into trust zones and draw every boundary, including the ones
 *   that leave the chain: the frontend, the signer, the keeper, the oracle feed. For each
 *   crossing, say what an attacker on the far side controls. ACTORS BY CAPABILITY. Enumerate
 *   every actor by what they can cause, not by what they are called. "The owner" is a job title;
 *   "can change the fee recipient without a timelock" is a capability. Anyone who can cause the
 *   same thing is the same actor for this purpose, and saying so is often the finding. FOLLOW
 *   ONE VALUE. Pick a single value — a price, an amount, an address — and follow it across every
 *   boundary from where it originates to where it is trusted. At each hop, name who chose it.
 *   The first hop where the answer is "someone outside the trust zone" is where the model has to
 *   say something. THE OFF-CHAIN SURFACE. Include what a user is actually shown before signing.
 *   Construct one blind- signing scenario where the transaction a user approves does something
 *   other than what the interface said, and say what would have prevented it. ASSUMPTIONS AS
 *   INVARIANTS. Write the trust assumption inventory as invariants: at least four function-level
 *   and two system-level, each expressed as a predicate rather than a sentence. THEN FALSIFY
 *   THEM. Feed those invariants to a handler-based campaign. Report which held, which broke, and
 *   — most usefully — which could not be expressed as written and had to be sharpened. A model
 *   that survives contact unchanged was probably too vague to break. CADENCE. Close with when
 *   this document must be revisited, tied to specific events rather than to a calendar.
 */
contract ThreatModelTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Trust zones and every boundary are drawn, including at least two that leave the chain
    function test_criterion01_trustZonesAndEveryBoundaryAreDrawnIncludingAt() public {
        fail("Trust zones and every boundary are drawn, including at least two that leave the chain");
    }

    /// Each crossing states what an attacker on the far side controls
    function test_criterion02_eachCrossingStatesWhatAnAttackerOnTheFar() public {
        fail("Each crossing states what an attacker on the far side controls");
    }

    /// Actors are enumerated by capability, and any two actors sharing a capability are identified
    /// as equivalent
    function test_criterion03_actorsAreEnumeratedByCapabilityAndAnyTwoActors() public {
        fail("Actors are enumerated by capability, and any two actors sharing a capability are identified as equivalent");
    }

    /// One value is followed across every boundary with the chooser named at each hop, and the
    /// first out-of-zone hop identified
    function test_criterion04_oneValueIsFollowedAcrossEveryBoundaryWithThe() public {
        fail("One value is followed across every boundary with the chooser named at each hop, and the first out-of-zone hop identified");
    }

    /// A blind-signing scenario is constructed where the approved transaction differs from what the
    /// interface showed, with the prevention named
    function test_criterion05_aBlindSigningScenarioIsConstructedWhereTheApproved() public {
        fail("A blind-signing scenario is constructed where the approved transaction differs from what the interface showed, with the prevention named");
    }

    /// At least four function-level and two system-level invariants are written as predicates
    function test_criterion06_atLeastFourFunctionLevelAndTwoSystemLevel() public {
        fail("At least four function-level and two system-level invariants are written as predicates");
    }

    /// A handler-based campaign runs against those invariants and reports which held, which broke,
    /// and which had to be sharpened
    function test_criterion07_aHandlerBasedCampaignRunsAgainstThoseInvariantsAnd() public {
        fail("A handler-based campaign runs against those invariants and reports which held, which broke, and which had to be sharpened");
    }

    /// The document names the events that require revisiting it, not a calendar interval
    function test_criterion08_theDocumentNamesTheEventsThatRequireRevisitingIt() public {
        fail("The document names the events that require revisiting it, not a calendar interval");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
