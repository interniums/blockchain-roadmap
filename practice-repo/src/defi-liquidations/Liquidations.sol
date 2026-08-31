// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-three-ways-to-close-a-position  (implement, difficulty 3)
 * Exercised by: test/Liquidations.t.sol
 * Run:      forge test --junit --match-path test/Liquidations.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Close factor — A cap on how much of a position one liquidation call may repay, limiting
 *     borrower damage at the cost of leaving dust.
 *   - Fixed-discount liquidation — A governance-set bonus and a first-come race — atomic and
 *     simple, and it hands the entire surplus to whoever wins the ordering fight.
 *   - Dutch-auction liquidation — The ask starts above market and falls until someone takes
 *     it, so the discount is discovered rather than set by governance.
 *   - The liquidation cascade — Forced selling pushes price down, which pushes more positions
 *     under water, which forces more selling — bounded only by block time and exit depth.
 *   - Cascades cross venues — Perpetual-futures liquidations on centralised venues move the
 *     price that on-chain lenders read, so an off-chain deleveraging becomes an on-chain
 *     liquidation event.
 */
contract Liquidations {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
