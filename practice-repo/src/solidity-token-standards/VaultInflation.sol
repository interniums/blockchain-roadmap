// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-inflation-attack-and-fix  (break, difficulty 4)
 * Exercised by: test/VaultInflation.t.sol
 * Run:      forge test --junit --match-path test/VaultInflation.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a naive ERC-4626 vault that computes shares from balanceOf(address(this)) with no
 *   virtual offset. Run the full first-depositor attack against it: the attacker deposits 1 wei,
 *   donates a large amount directly to the vault address with a plain transfer, the victim
 *   deposits, and the attacker redeems. Then add virtual shares and a decimal offset and re-run
 *   the identical attack, quantifying the attacker's residual profit as a function of the
 *   offset. Finally write an invariant test asserting no participant can extract more than they
 *   put in plus their share of yield, and show it fails against the naive version.
 *
 * The 6 concepts this has to end up demonstrating:
 *   - ERC-4626 tokenized vault — A standard interface for depositing assets, receiving shares,
 *     and redeeming them later.
 *   - Shares versus assets — Shares are claims on a growing pool; the rate is totalAssets
 *     divided by totalSupply.
 *   - Rounding direction is a security property — Every conversion must round in the vault's
 *     favour; rounding toward the user is a slow drain.
 *   - Donation attack — Sending assets directly to the contract, bypassing its accounting
 *     entry point, moves the ratio.
 *   - First-depositor inflation attack — Deposit 1 wei, donate a large amount, and the next
 *     depositor's shares round down to zero.
 *   - Virtual shares and the decimal offset — Include virtual shares and assets in the
 *     conversion so an empty vault still has a defined rate.
 */
contract VaultInflation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
