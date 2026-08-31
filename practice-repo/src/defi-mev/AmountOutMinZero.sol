// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-mev-zero-min-out  (break, difficulty 3)
 * Exercised by: test/AmountOutMinZero.t.sol
 * Run:      forge test --match-path test/AmountOutMinZero.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Deploy a naive DEX router that forwards a user's swap with amountOutMin set to zero and no
 *   deadline. Write a Foundry test that sandwiches a user of that router and takes an
 *   arbitrarily large share of their trade — parameterise the attack so the test can assert that
 *   increasing the attacker's capital increases the extraction without bound up to the pool's
 *   depth. Then write a fixed router that computes a minimum output from a price obtained
 *   independently of the pool it is about to trade against, and enforces a deadline. Show the
 *   same attack against the fixed router is unprofitable, and state precisely what the fixed
 *   router now trusts that the broken one did not.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The sandwich — Buy ahead of a victim's swap to push the price, let them execute worse,
 *     then sell behind them — funded entirely by their slippage tolerance.
 *   - Slippage tolerance is a security parameter — Setting a wide tolerance does not make the
 *     trade succeed; it authorises up to that much extraction.
 *   - Slippage tolerance — The minimum output you are willing to accept — a security parameter
 *     that wallets present as a convenience dial.
 */
contract AmountOutMinZero {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
