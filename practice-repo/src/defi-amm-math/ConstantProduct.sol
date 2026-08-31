// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-amm-math-build-cpmm  (implement, difficulty 2)
 * Exercised by: test/ConstantProduct.t.sol
 * Run:      forge test --match-path test/ConstantProduct.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a two-token constant-product pool in Solidity with addLiquidity, removeLiquidity and
 *   swapExactIn. Charge a 30 basis point fee on the input amount before the invariant check.
 *   Mint LP shares proportional to the contributed value on the first deposit and proportional
 *   to the existing supply thereafter. Do not use any external library for the swap maths;
 *   derive the output formula yourself. Then write a Foundry invariant test with a handler that
 *   performs random deposits, withdrawals and swaps of bounded size, and a ghost accumulator
 *   tracking every fee charged. The invariant to assert is that reserve0 times reserve1 never
 *   decreases across any operation that is not a liquidity removal, and that the LP share price
 *   is non-decreasing.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The constant-product invariant — A pool holding reserves x and y keeps x times y at or
 *     above a constant k, so the marginal price is just the reserve ratio.
 *   - Price impact — Trade size moves you along the curve, so the average price you pay is
 *     always worse than the marginal price you were quoted.
 *   - Impermanent loss — The invariant forces an LP to sell the asset that is rising, so the
 *     position underperforms simply holding the two tokens.
 */
contract ConstantProduct {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
