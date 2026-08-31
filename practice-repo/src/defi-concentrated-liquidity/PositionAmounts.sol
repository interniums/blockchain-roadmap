// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-concentrated-liquidity-position-amounts  (implement, difficulty 4)
 * Exercised by: test/PositionAmounts.t.sol
 * Run:      forge test --match-path test/PositionAmounts.t.sol --fork-url $ETH_RPC_URL -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement, in Solidity, a pure function that takes a lower tick, an upper tick, a current
 *   sqrtPriceX96 and a liquidity L, and returns the amounts of token0 and token1 the position
 *   holds. Handle all three cases: current price below the range, inside it, and above it. Do
 *   the tick to sqrtPrice conversion yourself rather than calling a library, and reproduce the
 *   protocol's rounding direction. Then, on a mainnet fork, pick a real Uniswap v3 position,
 *   read its ticks and liquidity from the position manager and the pool's slot0, and compare
 *   your computed amounts against the amounts the protocol itself reports for that position.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Virtual reserves — A v3 position behaves exactly like a constant-product pool restricted
 *     to one price interval, described by reserves that need not physically exist.
 *   - Tick — A discrete price level where price(t) equals 1.0001 to the power t, so one tick
 *     is one basis point of price.
 *   - Square-root price in Q64.96 — The pool stores the square root of price as a fixed-point
 *     integer scaled by 2 to the 96, not the price itself.
 *   - L, the liquidity of a position — L equals the square root of x times y over the virtual
 *     reserves, so a v3 position is a single bar in price-liquidity space.
 */
contract PositionAmounts {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
