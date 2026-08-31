// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-three-ways-to-close-a-position  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Liquidations.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   A liquidation is a forced sale, and the mechanism decides who absorbs the loss. Implement
 *   three and compare from the borrower's side rather than the liquidator's. THREE MECHANISMS.
 *   Build the same underwater position and close it three ways: a fixed discount with a close
 *   factor, a full close at a fixed discount, and a descending-price auction. For each report
 *   what the borrower lost, what the liquidator gained, and what the protocol was left holding.
 *   The close factor is the interesting parameter. Sweep it and plot borrower loss against it.
 *   Find the value at which partial liquidation stops helping the borrower, and say what is
 *   happening at that point. THE AUCTION. For the descending-price version, report the time to
 *   clear and the clearing discount. Then make it fail: reduce liquidator competition and show
 *   the price falling further than the fixed-discount case would have. State the condition under
 *   which each mechanism is the better one for the borrower — they are different conditions, and
 *   naming both is the exercise. THE CASCADE. Now make one liquidation cause another. Build two
 *   positions sharing a collateral asset, and show the first liquidation's price impact pushing
 *   the second underwater. Report the size at which it triggers. Then extend it across two
 *   venues: show a liquidation on one venue moving a price that a second venue reads, and state
 *   what that means for anyone modelling liquidation risk on a single protocol.
 */
contract LiquidationsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The same underwater position is closed by fixed discount with a close factor, full fixed
    /// discount, and descending-price auction
    function test_criterion01_theSameUnderwaterPositionIsClosedByFixedDiscount() public {
        fail("The same underwater position is closed by fixed discount with a close factor, full fixed discount, and descending-price auction");
    }

    /// Borrower loss, liquidator gain and protocol residual are reported for all three
    function test_criterion02_borrowerLossLiquidatorGainAndProtocolResidualAreReported() public {
        fail("Borrower loss, liquidator gain and protocol residual are reported for all three");
    }

    /// Close factor is swept with borrower loss plotted, and the value where partial liquidation
    /// stops helping identified
    function test_criterion03_closeFactorIsSweptWithBorrowerLossPlottedAnd() public {
        fail("Close factor is swept with borrower loss plotted, and the value where partial liquidation stops helping identified");
    }

    /// Auction clear time and clearing discount are reported
    function test_criterion04_auctionClearTimeAndClearingDiscountAreReported() public {
        fail("Auction clear time and clearing discount are reported");
    }

    /// Reduced liquidator competition is shown driving the auction price below the fixed-discount
    /// outcome
    function test_criterion05_reducedLiquidatorCompetitionIsShownDrivingTheAuctionPrice() public {
        fail("Reduced liquidator competition is shown driving the auction price below the fixed-discount outcome");
    }

    /// The condition favouring each mechanism for the borrower is stated, and they differ
    function test_criterion06_theConditionFavouringEachMechanismForTheBorrowerIs() public {
        fail("The condition favouring each mechanism for the borrower is stated, and they differ");
    }

    /// One liquidation's price impact is shown pushing a second position underwater, with the
    /// triggering size reported
    function test_criterion07_oneLiquidationSPriceImpactIsShownPushingA() public {
        fail("One liquidation's price impact is shown pushing a second position underwater, with the triggering size reported");
    }

    /// A cross-venue cascade is demonstrated with the consequence for single-protocol risk models
    /// stated
    function test_criterion08_aCrossVenueCascadeIsDemonstratedWithTheConsequence() public {
        fail("A cross-venue cascade is demonstrated with the consequence for single-protocol risk models stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
