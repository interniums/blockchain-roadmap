// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-liquidate-a-little-at-a-time  (measure, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/SoftLiquidation.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Soft liquidation replaces a cliff with a slope. The slope is not free, and this exercise is
 *   to measure the bill. THE BANDS. Implement or model the banded mechanism: collateral
 *   distributed across price bands, converted gradually as the price moves through them. Take
 *   one position and one price path down and back up, and report the state after each band
 *   crossing — how much collateral was converted, at what price, and what the position holds at
 *   the end. THE ROUND TRIP. Now the finding: the price returns to where it started and the
 *   position does not. Report the loss as a percentage of the original position, and account for
 *   where it went — who received it. THE DIAL. Sweep the amplification parameter. For at least
 *   four values, report the maximum leverage it permits and the round-trip loss under the same
 *   price path. Plot both against the parameter. State the trade in one sentence, with numbers
 *   in it. Then find the regime where the mechanism is worse than a hard liquidation: a price
 *   path under which a borrower would have preferred to be liquidated once. Describe the path
 *   and report both outcomes. Close with the parameter value you would choose for a lender, and
 *   the price behaviour you are assuming when you choose it.
 */
contract SoftLiquidationTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A banded mechanism is implemented or modelled with collateral distributed across price bands
    function test_criterion01_aBandedMechanismIsImplementedOrModelledWithCollateral() public {
        fail("A banded mechanism is implemented or modelled with collateral distributed across price bands");
    }

    /// State after each band crossing is reported with amount converted and price
    function test_criterion02_stateAfterEachBandCrossingIsReportedWithAmount() public {
        fail("State after each band crossing is reported with amount converted and price");
    }

    /// A round-trip price path is shown leaving the position worse off, with the loss as a
    /// percentage and the recipient identified
    function test_criterion03_aRoundTripPricePathIsShownLeavingThe() public {
        fail("A round-trip price path is shown leaving the position worse off, with the loss as a percentage and the recipient identified");
    }

    /// The amplification parameter is swept over at least four values with maximum leverage and
    /// round-trip loss reported for each
    function test_criterion04_theAmplificationParameterIsSweptOverAtLeastFour() public {
        fail("The amplification parameter is swept over at least four values with maximum leverage and round-trip loss reported for each");
    }

    /// Both are plotted against the parameter with a one-sentence trade statement containing
    /// numbers
    function test_criterion05_bothArePlottedAgainstTheParameterWithAOne() public {
        fail("Both are plotted against the parameter with a one-sentence trade statement containing numbers");
    }

    /// A price path is found under which hard liquidation would have been preferable, with both
    /// outcomes reported
    function test_criterion06_aPricePathIsFoundUnderWhichHardLiquidation() public {
        fail("A price path is found under which hard liquidation would have been preferable, with both outcomes reported");
    }

    /// A parameter choice is made with the assumed price behaviour stated
    function test_criterion07_aParameterChoiceIsMadeWithTheAssumedPrice() public {
        fail("A parameter choice is made with the assumed price behaviour stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
