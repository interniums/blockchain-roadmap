// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-lending-shared-oracle-breaks-isolation  (break, difficulty 4)
 * Exercised by: test/IsolationBreak.t.sol
 * Run:      forge test --match-path test/IsolationBreak.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a minimal isolated lending market: one collateral token, one loan token, a pluggable
 *   oracle, a fixed liquidation LTV, and a liquidate function that repays debt and seizes
 *   collateral at an incentive. Deploy two instances that share the same collateral token but
 *   read different oracles, one of which lags or can be moved. Write a test showing an attacker
 *   profitably borrowing against the market with the more favourable oracle and leaving that
 *   market with bad debt, while the other market's suppliers are untouched in accounting terms
 *   and yet exposed through the shared collateral they hold. Then add a supply cap to the
 *   affected market and measure exactly how much the loss is reduced.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Isolated versus pooled markets — A shared pool socialises every listing mistake across
 *     all suppliers; an isolated market confines the loss and fragments the liquidity.
 *   - Bad debt — Debt with no collateral left behind it, which keeps accruing interest and
 *     inflates a phantom asset until the protocol accounts for it explicitly.
 *   - Caps and ceilings — Supply caps, borrow caps and isolation debt ceilings bound the
 *     worst-case loss per asset regardless of how wrong the LTV turned out to be.
 */
contract IsolationBreak {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
