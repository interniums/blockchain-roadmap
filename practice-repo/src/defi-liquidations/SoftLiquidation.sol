// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-liquidate-a-little-at-a-time  (measure, difficulty 4)
 * Exercised by: test/SoftLiquidation.t.sol
 * Run:      forge test --junit --match-path test/SoftLiquidation.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 4 concepts this has to end up demonstrating:
 *   - LLAMMA bands — The price range is cut into N bands and the collateral is spread across
 *     them, each band a concentrated-liquidity range holding collateral, stablecoin, or a mix.
 *   - Soft liquidation — Arbitrageurs convert the borrower's collateral into stablecoin band
 *     by band as price falls, with no liquidation event, close factor or bonus.
 *   - The A parameter — A sets band width and therefore maximum LTV, so band count is a dial
 *     between leverage and soft-liquidation smoothness.
 *   - The cost of soft liquidation — Each oscillation through the bands sells low and buys
 *     high, so the borrower bleeds value in proportion to realised volatility inside the
 *     range.
 */
contract SoftLiquidation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
