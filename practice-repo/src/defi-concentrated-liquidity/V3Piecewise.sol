// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-concentrated-liquidity-v3-is-v2-piecewise  (measure, difficulty 3)
 * Exercised by: test/V3Piecewise.t.sol
 * Run:      forge test --junit --match-path test/V3Piecewise.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Concentrated liquidity is not a new market maker. Demonstrate that by rebuilding one out of
 *   the old one. Take a real concentrated-liquidity pool and read its current liquidity and its
 *   active range. Then implement a plain constant-product pool parameterised so that, within
 *   that range, it quotes the same prices. Compare quotes across ten trade sizes inside the
 *   range and report the difference — it should be at rounding level, and if it is not, find out
 *   why. Then cross a boundary. Take a trade large enough to exhaust the active range and show
 *   your single-curve model diverging from the real pool. Report where the divergence begins,
 *   and then extend your model to a piecewise one: two curves with a switch at the boundary.
 *   Show the divergence disappear. Finally state the claim precisely, in one paragraph: what is
 *   identical between the two designs and what is genuinely new. The new part is not the
 *   pricing.
 *
 * The 1 concepts this has to end up demonstrating:
 *   - v3 as piecewise v2 — The v3 curve is a constant-product curve whose liquidity changes at
 *     the ticks where LPs chose to place it.
 */
contract V3Piecewise {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
