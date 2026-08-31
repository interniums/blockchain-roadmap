// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-oracles-the-consumer-is-liable  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/PullOracle.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   In a pull model nobody pushes a price on chain for you. You fetch it, you pay for it, and
 *   you are responsible for checking it — which means the failure modes are yours. FETCH AND
 *   VERIFY. Retrieve a signed price off chain and verify it on chain yourself: signature,
 *   publisher identity, and the age of the observation. Report the gas. Then break each check in
 *   turn — wrong signer, stale timestamp, tampered price — and show each rejected with a
 *   distinct error. Three checks, three failures, three errors. THE STALENESS DECISION. There is
 *   no correct maximum age, only a choice. State yours for two different uses — a liquidation
 *   and a display — and defend both. Then show what happens at the boundary: submit a price
 *   exactly at your threshold and one just past it. THE INTERVAL. The feed reports uncertainty
 *   as well as a price, and most integrations ignore it. Read it, and then build a contract that
 *   actually uses it: refuse to act when the interval is too wide relative to the position at
 *   risk. Demonstrate a refusal, and report a real moment when the interval widened enough to
 *   trigger it — or, if you cannot find one, state what conditions would produce it. Close with
 *   the liability sentence: name every failure in this exercise that a push model would have
 *   made somebody else's problem, and say whether you would still choose pull.
 */
contract PullOracleTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A signed price is fetched off chain and verified on chain for signature, publisher and
    /// observation age, with the gas reported
    function test_criterion01_aSignedPriceIsFetchedOffChainAndVerified() public {
        fail("A signed price is fetched off chain and verified on chain for signature, publisher and observation age, with the gas reported");
    }

    /// Wrong signer, stale timestamp and tampered price are each rejected with a distinct error
    function test_criterion02_wrongSignerStaleTimestampAndTamperedPriceAreEach() public {
        fail("Wrong signer, stale timestamp and tampered price are each rejected with a distinct error");
    }

    /// A maximum age is chosen and defended for a liquidation and for a display use
    function test_criterion03_aMaximumAgeIsChosenAndDefendedForA() public {
        fail("A maximum age is chosen and defended for a liquidation and for a display use");
    }

    /// Prices exactly at and just past the threshold are both submitted with the outcomes shown
    function test_criterion04_pricesExactlyAtAndJustPastTheThresholdAre() public {
        fail("Prices exactly at and just past the threshold are both submitted with the outcomes shown");
    }

    /// The confidence interval is read and used to refuse action when too wide relative to the
    /// position
    function test_criterion05_theConfidenceIntervalIsReadAndUsedToRefuse() public {
        fail("The confidence interval is read and used to refuse action when too wide relative to the position");
    }

    /// A refusal is demonstrated, with a real widening moment reported or the conditions that would
    /// produce one stated
    function test_criterion06_aRefusalIsDemonstratedWithARealWideningMoment() public {
        fail("A refusal is demonstrated, with a real widening moment reported or the conditions that would produce one stated");
    }

    /// Every failure in the exercise that a push model would have made someone else's problem is
    /// named, with a pull-versus-push verdict
    function test_criterion07_everyFailureInTheExerciseThatAPushModel() public {
        fail("Every failure in the exercise that a push model would have made someone else's problem is named, with a pull-versus-push verdict");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
