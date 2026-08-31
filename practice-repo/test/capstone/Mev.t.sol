// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Mev} from "../../src/defi-mev/Mev.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-mev-capstone-follow-one-swap  (measure, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/Mev.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take one real swap that was sandwiched on mainnet. Reconstruct the whole supply chain around
 *   it, and price every mitigation against it. THE ATTACK, RECONSTRUCTED. Fork before the
 *   bundle. Reproduce the sandwich: front-run, victim, back-run. Compute the attacker's profit
 *   and the victim's loss, and show they are not the same number — say where the difference
 *   went. THE BUDGET. Show the victim's slippage tolerance was the attacker's budget: sweep the
 *   tolerance and plot attacker profit against it. Find the tolerance at which the attack stops
 *   being worth it, and state what that tolerance would have cost the victim in failed
 *   transactions instead. THE TAXONOMY, APPLIED. Classify four extractions from the same block —
 *   including one atomic arbitrage and one liquidation — as requiring a specific user to be
 *   worse off, or as capture of a public inconsistency. Then take the arbitrage and argue it is
 *   loss-versus-rebalancing borne by liquidity providers rather than a victimless correction.
 *   Name who paid. THE SUPPLY CHAIN. For the block your swap landed in, name every hop from
 *   wallet to proposer and state, per hop, who could see the transaction and who could reorder
 *   it. Identify the relay and say what trusting it means concretely. FOUR MITIGATIONS, PRICED.
 *   Private order flow, an intent with solver competition, an encrypted mempool, and an
 *   oracle-position auction. For each: what it prevents, what it moves rather than prevents, who
 *   is now trusted instead, and the latency or fee cost. The write-up must say which one you
 *   would actually ship and what you are accepting. THE L2 CASE. Finally, take the same swap on
 *   an L2 and say why the analysis collapses to one party, and what that means for a user who
 *   assumed the mitigations above apply.
 */
contract MevTest is Test {
    /// The subject, from src/defi-mev/Mev.sol. Add functions there and call them here.
    Mev internal subject;

    function setUp() public {
        subject = new Mev();
    }

    /// A real sandwich is reproduced on a fork with front-run, victim and back-run transactions
    function test_criterion01_aRealSandwichIsReproducedOnAForkWith() public {
        fail("A real sandwich is reproduced on a fork with front-run, victim and back-run transactions");
    }

    /// Attacker profit and victim loss are computed separately, with the difference accounted for
    function test_criterion02_attackerProfitAndVictimLossAreComputedSeparatelyWith() public {
        fail("Attacker profit and victim loss are computed separately, with the difference accounted for");
    }

    /// Slippage tolerance is swept against attacker profit, with the break-even tolerance and its
    /// cost in failed transactions stated
    function test_criterion03_slippageToleranceIsSweptAgainstAttackerProfitWithThe() public {
        fail(
            "Slippage tolerance is swept against attacker profit, with the break-even tolerance and its cost in failed transactions stated"
        );
    }

    /// Four extractions from one block are classified as user-harming or public-inconsistency
    /// capture
    function test_criterion04_fourExtractionsFromOneBlockAreClassifiedAsUser() public {
        fail("Four extractions from one block are classified as user-harming or public-inconsistency capture");
    }

    /// The atomic arbitrage is argued as loss-versus-rebalancing with the paying party named
    function test_criterion05_theAtomicArbitrageIsArguedAsLossVersusRebalancing() public {
        fail("The atomic arbitrage is argued as loss-versus-rebalancing with the paying party named");
    }

    /// Every supply-chain hop is named with who can see and who can reorder at each
    function test_criterion06_everySupplyChainHopIsNamedWithWhoCan() public {
        fail("Every supply-chain hop is named with who can see and who can reorder at each");
    }

    /// The relay is identified and what trusting it means is stated concretely
    function test_criterion07_theRelayIsIdentifiedAndWhatTrustingItMeans() public {
        fail("The relay is identified and what trusting it means is stated concretely");
    }

    /// Four mitigations each have what they prevent, what they merely move, who becomes trusted,
    /// and a latency or fee cost
    function test_criterion08_fourMitigationsEachHaveWhatTheyPreventWhatThey() public {
        fail(
            "Four mitigations each have what they prevent, what they merely move, who becomes trusted, and a latency or fee cost"
        );
    }

    /// A shipping recommendation states what is being accepted
    function test_criterion09_aShippingRecommendationStatesWhatIsBeingAccepted() public {
        fail("A shipping recommendation states what is being accepted");
    }

    /// The L2 analysis explains the collapse to one party and its consequence for the user
    function test_criterion10_theL2AnalysisExplainsTheCollapseToOneParty() public {
        fail("The L2 analysis explains the collapse to one party and its consequence for the user");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
