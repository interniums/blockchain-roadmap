// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-usdt-integration-break  (break, difficulty 3)
 * Exercised by: test/WeirdTokens.t.sol
 * Run:      forge test --junit --match-path test/WeirdTokens.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   On a mainnet fork, write a vault that moves tokens with the plain IERC20 interface and
 *   deposit USDT into it. Prove the call reverts, and prove that swapping in SafeERC20 makes the
 *   identical test pass. Then, locally, implement a 2 percent fee-on-transfer mock from the
 *   weird-erc20 catalogue, have three users deposit into a vault that credits the requested
 *   amount, and have them withdraw in sequence. Prove the last withdrawal fails for insufficient
 *   balance, and prove the balance-delta version does not.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Tokens that return nothing — USDT and others return no data from transfer, so a
 *     bool-typed call reverts on the empty returndata.
 *   - SafeERC20 — Wraps the call in a low-level call and treats no returndata plus code at the
 *     address as success.
 *   - Fee-on-transfer tokens — Some tokens tax or burn on transfer, so the amount received is
 *     less than the amount sent.
 *   - Credit the measured delta — Record balanceOf(this) before and after the transfer and
 *     credit the difference.
 *   - The weird-ERC-20 taxonomy — ERC-20 compliant is a spectrum, and each deviation breaks a
 *     different integration assumption.
 */
contract WeirdTokens {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
