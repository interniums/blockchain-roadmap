// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-oracles-there-is-no-price  (break, difficulty 3)
 * Exercised by: test/Oracles.t.sol
 * Run:      forge test --junit --match-path test/Oracles.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   There is no price on a blockchain, only reports about prices. Get four of them and show what
 *   happens when you trust the wrong one. FOUR SOURCES. For one asset, obtain a price from: a
 *   push feed, a pool's spot reserves, a time-weighted pool average, and one off-chain
 *   reference. Report all four at the same block and the spread between them. State which you
 *   would use and for what — the answer differs by use, and giving one answer is wrong. THE
 *   DRAIN. Build a contract that reads a pool's spot price and lends against it. Take a flash
 *   loan, move the pool, borrow against the moved price, and repay. Report the profit. Then fix
 *   it and show the same attack failing — and state what your fix costs in responsiveness,
 *   because every fix here trades freshness for robustness. THE ACCIDENTAL ORACLE. Find a
 *   protocol function that is not called an oracle and is one: an LP token valuation or an
 *   exchange-rate getter that another contract reads as truth. Show that manipulating it moves a
 *   number a third party depends on. Name what makes a function an oracle regardless of its
 *   name. THE BLOCK AFTER. Then the value nobody budgeted for: for one real price update,
 *   examine the block immediately after and identify what was extracted from knowing the new
 *   price before the protocols reacted. State who captured it and who could have.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The price feed as trust boundary — A chain has no native price of anything, so every
 *     DeFi valuation is a number some off-chain process wrote into a contract.
 *   - Spot price is not an oracle — getReserves or slot0 returns the instantaneous marginal
 *     price, which a flash loan can set to almost any value inside one transaction.
 *   - Protocol functions used as oracles — Pricing an LP share or a yield-bearing wrapper by
 *     calling its own conversion function makes that function an oracle — and if it can be
 *     moved in one transaction, so can the price.
 *   - Oracle-extractable value — Whoever lands the transaction immediately after a price
 *     update captures the liquidation bonus, so the oracle's write is an auctionable right.
 */
contract Oracles {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
