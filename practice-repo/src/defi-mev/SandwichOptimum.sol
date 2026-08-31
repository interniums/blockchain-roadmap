// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-mev-sandwich-optimum  (measure, difficulty 3)
 * Exercised by: test/SandwichOptimum.t.sol
 * Run:      forge test --match-path test/SandwichOptimum.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a sandwich simulator against a constant-product pool. Given reserves, fee, a victim
 *   swap size and the victim's minimum-output bound, compute the attacker's profit as a function
 *   of frontrun size, find the optimum, and identify the frontrun size at which the victim's
 *   transaction would revert. Then sweep the victim's slippage tolerance from tight to wide and
 *   plot attacker profit against it. Report the tolerance at which sandwiching stops being
 *   profitable for a given victim size, and separately report what happens as the victim's own
 *   price impact approaches the tolerance.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The sandwich — Buy ahead of a victim's swap to push the price, let them execute worse,
 *     then sell behind them — funded entirely by their slippage tolerance.
 *   - Slippage tolerance is a security parameter — Setting a wide tolerance does not make the
 *     trade succeed; it authorises up to that much extraction.
 *   - Slippage tolerance — The minimum output you are willing to accept — a security parameter
 *     that wallets present as a convenience dial.
 *   - Price impact — Trade size moves you along the curve, so the average price you pay is
 *     always worse than the marginal price you were quoted.
 */
contract SandwichOptimum {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
