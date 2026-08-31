// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-proof-of-stake-capstone-price-a-defection  (measure, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/Slashing.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a slashing calculator, and use it to make the argument this module exists to make:
 *   that the penalty is not for being wrong, it is for being wrong together. CONSTRUCT ALL THREE
 *   OFFENCES. Produce, as concrete signed message pairs against a real chain config, one double
 *   proposal, one double vote and one surround vote. For the surround vote, demonstrate a pair
 *   that is slashable and a pair that looks similar and is not, with the source and target
 *   epochs of each written out. THE CALCULATOR. Given a validator's balance and the number of
 *   validators slashed in the same window, compute the initial penalty, the correlation penalty,
 *   and the total — and the timeline over which each is applied. Test it against the real values
 *   for at least two historical slashing events. THE CURVE. Plot total loss against the number
 *   of correlated offenders, from one validator to a third of the set. Mark the point where the
 *   loss becomes total. State the number of validators at that point, and what fraction of the
 *   set it is. THE ARGUMENT. In one page: why is the penalty structured this way rather than as
 *   a fixed fine? Answer it in terms of what a fixed fine would fail to deter. Then state what
 *   it costs an honest operator who runs two clients badly and gets slashed alone — and whether
 *   you think that number is correct. THE CLOCK. Finally, show why slot timing makes some of
 *   this unavoidable: given the slot and epoch structure and the committee sampling, say how
 *   long an operator has to notice a misconfiguration before it becomes slashable, and whether
 *   that window is long enough.
 */
contract SlashingTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// All three slashable offences are constructed as concrete signed message pairs against a real
    /// chain config
    function test_criterion01_allThreeSlashableOffencesAreConstructedAsConcreteSigned() public {
        fail("All three slashable offences are constructed as concrete signed message pairs against a real chain config");
    }

    /// A slashable and a non-slashable surround-vote pair are both given, with source and target
    /// epochs written out for each
    function test_criterion02_aSlashableAndANonSlashableSurroundVotePair() public {
        fail("A slashable and a non-slashable surround-vote pair are both given, with source and target epochs written out for each");
    }

    /// The calculator reproduces the real total penalty for at least two historical slashing events
    function test_criterion03_theCalculatorReproducesTheRealTotalPenaltyForAt() public {
        fail("The calculator reproduces the real total penalty for at least two historical slashing events");
    }

    /// Initial penalty, correlation penalty and application timeline are computed separately rather
    /// than as one figure
    function test_criterion04_initialPenaltyCorrelationPenaltyAndApplicationTimelineAreComputed() public {
        fail("Initial penalty, correlation penalty and application timeline are computed separately rather than as one figure");
    }

    /// The loss curve is plotted from one offender to a third of the set, with the point of total
    /// loss marked and stated as both a count and a fraction
    function test_criterion05_theLossCurveIsPlottedFromOneOffenderTo() public {
        fail("The loss curve is plotted from one offender to a third of the set, with the point of total loss marked and stated as both a count and a fraction");
    }

    /// A one-page argument explains the structure in terms of what a fixed fine would fail to deter
    function test_criterion06_aOnePageArgumentExplainsTheStructureInTerms() public {
        fail("A one-page argument explains the structure in terms of what a fixed fine would fail to deter");
    }

    /// The cost to an honest operator slashed alone is stated as a number, with a judgement on
    /// whether it is correct
    function test_criterion07_theCostToAnHonestOperatorSlashedAloneIs() public {
        fail("The cost to an honest operator slashed alone is stated as a number, with a judgement on whether it is correct");
    }

    /// The window an operator has to notice a misconfiguration before it becomes slashable is
    /// derived from slot and epoch structure
    function test_criterion08_theWindowAnOperatorHasToNoticeAMisconfiguration() public {
        fail("The window an operator has to notice a misconfiguration before it becomes slashable is derived from slot and epoch structure");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
