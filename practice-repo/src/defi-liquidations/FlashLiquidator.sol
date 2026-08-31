// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-flash-loan-liquidator  (implement, difficulty 5)
 * Exercised by: test/FlashLiquidator.t.sol
 * Run:      forge test --match-path test/FlashLiquidator.t.sol --fork-url $ETH_RPC_URL -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   On a mainnet fork, write a liquidator contract that in a single transaction flash-borrows
 *   the debt asset, calls a lending protocol's liquidation function on an eligible position,
 *   receives the discounted collateral, swaps it back to the debt asset on a DEX, repays the
 *   flash loan with its fee, and keeps the remainder. Drive a real position under water by
 *   manipulating the fork's oracle answer rather than waiting for one. Then re-run the same
 *   liquidation with progressively worse exit execution and with progressively higher gas
 *   prices, and record the point at which the trade turns negative for a given position size.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The capital-free liquidator — Flash-borrow the debt asset, repay, seize, swap, repay the
 *     loan, keep the spread — so capital is not the barrier, ordering is.
 *   - The liquidation incentive — The discount at which a liquidator buys seized collateral,
 *     which must exceed gas plus exit slippage plus inventory risk or nobody calls the
 *     function.
 *   - Gas coupling — Liquidation profitability falls as congestion rises, and congestion peaks
 *     during crashes — so the incentive shrinks exactly when it must grow.
 *   - The flash loan — An uncollateralised loan that is valid only if it is repaid before the
 *     same transaction ends.
 */
contract FlashLiquidator {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
