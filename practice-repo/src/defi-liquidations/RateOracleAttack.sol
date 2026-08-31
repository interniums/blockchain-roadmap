// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-rate-oracle-hard-liquidation  (break, difficulty 4)
 * Exercised by: test/RateOracleAttack.t.sol
 * Run:      forge test --match-path test/RateOracleAttack.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Reproduce the shape of the March 2026 LlamaLend sDOLA incident locally. Build an
 *   ERC-4626-style savings vault whose share-to-asset conversion rate is used directly as a
 *   lending oracle by a minimal borrow market. Give the vault an unpermissioned entry point — a
 *   stake or a direct donation of assets — that any caller may use and that moves the conversion
 *   rate within a single transaction. Then write a test that makes a healthy borrower
 *   hard-liquidatable inside one block using only unpermissioned calls, and quantify the
 *   attacker's profit against their cost. Finally implement a defence — a rate-limited or
 *   checkpointed exchange rate that can move only a bounded amount per unit time — and show the
 *   same attack test now fails.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - LLAMMA's oracle coupling — The internal price is pinned to an external oracle and
 *     arbitrage does the rebalancing, so a movable oracle can force positions into soft
 *     liquidation and then under water on demand.
 *   - Protocol functions used as oracles — Pricing an LP share or a yield-bearing wrapper by
 *     calling its own conversion function makes that function an oracle — and if it can be
 *     moved in one transaction, so can the price.
 *   - The unliquidatable threshold — Once debt exceeds collateral value minus the incentive,
 *     rational liquidators stop and the residual is bad debt however many keepers are
 *     watching.
 */
contract RateOracleAttack {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
