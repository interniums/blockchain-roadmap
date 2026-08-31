// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-incentives-run-both-auctions  (measure, difficulty 3)
 * Exercised by: test/Auctions.t.sol
 * Run:      forge test --junit --match-path test/Auctions.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 7 concepts this has to end up demonstrating:
 *   - Mechanism design — Designing the rules so that participants acting in pure self-interest
 *     produce the outcome you wanted — game theory run backwards.
 *   - Incentive compatibility — A mechanism where honest behaviour is each participant's best
 *     strategy, so honesty needs no enforcement.
 *   - First-price auction — Bidders pay what they bid, so everyone must guess how far to shade
 *     their bid — strategically complex and wasteful.
 *   - Second-price auction — Bidders pay the runner-up's bid, which makes truthful bidding
 *     dominant — and which a block producer can trivially game by inserting fake bids.
 *   - DSIC — dominant-strategy incentive compatibility — Truthful bidding is optimal for a
 *     user no matter what every other participant does.
 *   - MMIC — myopic miner incentive compatibility — The block producer cannot profit by
 *     deviating within a single block.
 *   - OCA-proofness — Off-chain-agreement proofness — no side deal between the block producer
 *     and users beats following the protocol.
 */
contract Auctions {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
