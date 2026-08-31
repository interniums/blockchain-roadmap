// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-the-allowance-and-the-race  (break, difficulty 3)
 * Exercised by: test/ApproveRace.t.sol
 * Run:      forge test --junit --match-path test/ApproveRace.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   A token is a mapping in someone else's contract, and an allowance is a second mapping that a
 *   great deal of received wisdom is built on. Test the wisdom. THE LEDGER. Demonstrate that
 *   your balance is a row in a contract you do not control: change a token's balance mapping
 *   directly in a test and show the "your" balance follow. State what that means for any code
 *   treating a token balance as an asset it holds. THE RACE. Execute it. Set an allowance, then
 *   have the spender front-run a change to that allowance and extract both the old and the new
 *   amount. Report the total taken and show it exceeding either individual approval. THE
 *   MITIGATIONS. Implement two: approve-to-zero-first, and an increase/decrease pair. For each,
 *   show it preventing your attack, and then state what it costs — in transactions, in gas, and
 *   in what happens if the first of two transactions lands and the second does not. THE HONEST
 *   CONCLUSION. Now argue against the exercise. The race requires the spender to already be
 *   approved and hostile. State what an already-approved hostile spender can do anyway without
 *   the race, and then answer the question this module actually asks: is the approve race where
 *   the money goes? Support the answer with what the alternative failure would cost.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - An ERC-20 is one contract's ledger — A token is not an object a user holds; it is a
 *     balanceOf mapping inside one contract.
 *   - The allowance model — Spending someone else's tokens takes two transactions: approve on
 *     the token, then transferFrom.
 *   - The approve race — Changing a non-zero allowance to another non-zero value is
 *     front-runnable for old plus new.
 *   - Mitigating the approve race — Approve to zero first, use safeIncreaseAllowance or
 *     forceApprove, or avoid standing allowances.
 *   - The race is rated low for a reason — It requires a spender you already approved and are
 *     willing to be robbed by; phishing loses far more.
 */
contract ApproveRace {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
