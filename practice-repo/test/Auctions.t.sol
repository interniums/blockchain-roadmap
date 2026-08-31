// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-incentives-run-both-auctions  (measure, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Auctions.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Simulate both auction formats with bidders who lie when lying pays, and show which format
 *   survives. THE SIMULATION. Implement a first-price and a second-price auction over the same
 *   private valuations. Give each bidder two strategies: bid your true value, or shade it. Run
 *   both formats and report, for each: revenue, allocation efficiency, and how much a shading
 *   bidder gained over a truthful one. In the first-price auction, shading pays. Show by how
 *   much, and show that the amount depends on beliefs about other bidders — which is the
 *   practical objection, not the theoretical one. In the second-price auction, show truthful
 *   bidding is optimal for a bidder against any opponent strategy you try. That is incentive
 *   compatibility, demonstrated rather than asserted. THEN WHY IT IS STILL A TRAP HERE. One
 *   party in a blockchain fee auction is also the auctioneer. Add a bidder who runs the auction:
 *   let them see all bids and insert their own afterwards. Show the second-price guarantee
 *   collapsing, and state which of the three properties — DSIC, MMIC, OCA-proofness — that
 *   violates. Then say which of the three the other two formats each fail, so all three
 *   properties have been distinguished by a concrete failure rather than by definition.
 */
contract AuctionsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Both auction formats are simulated over identical private valuations
    function test_criterion01_bothAuctionFormatsAreSimulatedOverIdenticalPrivateValuations() public {
        fail("Both auction formats are simulated over identical private valuations");
    }

    /// Revenue, allocation efficiency and the shading bidder's gain are reported for each format
    function test_criterion02_revenueAllocationEfficiencyAndTheShadingBidderSGain() public {
        fail("Revenue, allocation efficiency and the shading bidder's gain are reported for each format");
    }

    /// First-price shading gain is quantified and shown to depend on beliefs about other bidders
    function test_criterion03_firstPriceShadingGainIsQuantifiedAndShownTo() public {
        fail("First-price shading gain is quantified and shown to depend on beliefs about other bidders");
    }

    /// Truthful bidding is shown optimal in the second-price format against several opponent
    /// strategies
    function test_criterion04_truthfulBiddingIsShownOptimalInTheSecondPrice() public {
        fail("Truthful bidding is shown optimal in the second-price format against several opponent strategies");
    }

    /// An auctioneer who bids last is shown collapsing the second-price guarantee
    function test_criterion05_anAuctioneerWhoBidsLastIsShownCollapsingThe() public {
        fail("An auctioneer who bids last is shown collapsing the second-price guarantee");
    }

    /// That collapse is attributed to a specific one of DSIC, MMIC or OCA-proofness
    function test_criterion06_thatCollapseIsAttributedToASpecificOneOf() public {
        fail("That collapse is attributed to a specific one of DSIC, MMIC or OCA-proofness");
    }

    /// Each of the three properties is distinguished by a concrete failure rather than by
    /// definition
    function test_criterion07_eachOfTheThreePropertiesIsDistinguishedByA() public {
        fail("Each of the three properties is distinguished by a concrete failure rather than by definition");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
