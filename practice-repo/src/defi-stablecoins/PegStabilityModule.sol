// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-stablecoins-psm-arbitrage  (implement, difficulty 3)
 * Exercised by: test/PegStabilityModule.t.sol
 * Run:      forge test --match-path test/PegStabilityModule.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a peg stability module holding a reserve stablecoin, which mints your own
 *   stablecoin one-for-one on deposit and burns one-for-one on withdrawal, with configurable in
 *   and out fees and a debt ceiling. Deploy it alongside a constant-product pool trading your
 *   stablecoin against the reserve asset. Then write tests that push the pool price away from
 *   parity and demonstrate an arbitrageur closing the gap through the module — proving that the
 *   width of the band the price settles into is exactly the fee. Finally, exhaust the debt
 *   ceiling and show what happens to the peg when the arbitrage is no longer available.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The peg stability module — A contract that swaps a whitelisted asset for the stablecoin
 *     one-for-one at near-zero fee — pinning the peg hard and importing that asset's risk
 *     wholesale.
 *   - A peg is an outcome, not a property — No contract can set a market price; a peg is what
 *     arbitrageurs produce when a deviation creates a profitable trade.
 *   - The redemption right — The strength of a peg equals the strength of the redemption right
 *     — who may redeem, at what size, at what fee, how fast, and whether the issuer can
 *     refuse.
 *   - The secondary-market peg — Almost nobody redeems; they sell on a venue, so the visible
 *     price can deviate from redemption value by exactly the cost and latency of arbitrage.
 */
contract PegStabilityModule {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
