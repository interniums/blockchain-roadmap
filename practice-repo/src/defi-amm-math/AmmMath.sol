// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-amm-math-capstone-derive-the-curve  (implement, difficulty 4)
 * Exercised by: test/capstone/AmmMath.t.sol
 * Run:      forge test --junit --match-path test/capstone/AmmMath.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a constant-product pool from the invariant up, then use it to produce every figure
 *   a trader and a liquidity provider experience — each derived rather than looked up. THE
 *   CURVE. Implement swap, add and remove against the invariant. A test asserts the invariant
 *   holds or grows across every operation, never shrinks, including with fees. PRICE IMPACT.
 *   Quote the same trade at four sizes spanning three orders of magnitude, and plot execution
 *   price against size. Derive the closed form for price impact from the invariant and assert
 *   your implementation matches it to a stated tolerance. Then answer, with a number: at what
 *   fraction of the reserves does a trade lose more to impact than to fees? SLIPPAGE IS A
 *   BUDGET. Set a slippage tolerance and show a trade filling at a worse price than quoted but
 *   inside tolerance. Then show what a 50% tolerance permits, and state in one sentence what a
 *   slippage parameter actually is from an attacker's point of view. WHAT AN LP LOSES. Compute
 *   impermanent loss for a price move you choose, and separate it into the two components:
 *   divergence from holding, and fees earned. Show the break-even price move at which the fees
 *   cover the divergence. Then say in one sentence why "impermanent" is the wrong word. A
 *   FLATTER CURVE. Implement the stableswap invariant and compare it against constant product on
 *   the same trade near parity and far from it. Show the amplification parameter moving where
 *   the curve stops behaving like a stablecoin curve, with the number at which it flips. THE
 *   UNCOLLATERALISED LOAN. Take a flash loan, use it to move your own pool's price, and show the
 *   quote another contract reads mid-transaction. Then state what that means for anyone treating
 *   a pool reserve as a price.
 *
 * The 6 concepts this has to end up demonstrating:
 *   - The constant-product invariant — A pool holding reserves x and y keeps x times y at or
 *     above a constant k, so the marginal price is just the reserve ratio.
 *   - Price impact — Trade size moves you along the curve, so the average price you pay is
 *     always worse than the marginal price you were quoted.
 *   - Slippage tolerance — The minimum output you are willing to accept — a security parameter
 *     that wallets present as a convenience dial.
 *   - Impermanent loss — The invariant forces an LP to sell the asset that is rising, so the
 *     position underperforms simply holding the two tokens.
 *   - The StableSwap invariant — A curve deliberately flattened near parity, so assets that
 *     should trade one-for-one suffer almost no price impact until reserves become badly
 *     imbalanced.
 *   - The flash loan — An uncollateralised loan that is valid only if it is repaid before the
 *     same transaction ends.
 */
contract AmmMath {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
