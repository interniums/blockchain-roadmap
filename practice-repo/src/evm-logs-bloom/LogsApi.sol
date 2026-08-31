// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-logs-bloom-the-api-you-shipped  (break, difficulty 3)
 * Exercised by: test/LogsApi.t.sol
 * Run:      forge test --junit --match-path test/LogsApi.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Logs are a one-way channel, and the shape you emit is a contract with everyone downstream
 *   whether you meant it or not. WRITE-ONLY. Write a contract that tries to read one of its own
 *   past events and show it cannot. Then show that logs are nonetheless committed to by the
 *   block, by proving one against the receipts root. Both facts are true at once and the pair is
 *   the point. REVERTS TAKE THEM. Emit an event and then revert the frame. Show the log absent.
 *   Then emit in a sub-call that reverts while the outer call succeeds, and show what happens to
 *   that log. State the rule. QUERY IT PROPERLY. Emit fifty events across several blocks with
 *   varied indexed arguments. Then write four queries against them that demonstrate the topic
 *   semantics: match on the first topic only, match on a later topic, match either of two values
 *   in one position, and a query that returns nothing because the positional rule was
 *   misunderstood. Explain that last one. THE API. Now change the event: reorder two arguments
 *   and move one from indexed to unindexed. Show which of your four queries break and which
 *   silently return wrong results. The silent ones are the finding. Close with the versioning
 *   rule you would adopt, in one sentence.
 *
 * The 6 concepts this has to end up demonstrating:
 *   - Logs are write-only — LOG0-LOG4 append records to the receipt, and no opcode anywhere in
 *     the EVM can read a log back.
 *   - The shape of a log record — An emitting address, zero to four 32-byte topics, and an
 *     arbitrary-length data blob — the digit in LOG0..LOG4 is the topic count.
 *   - Logs are committed to the chain — A log lives in a receipt, receipts hash into
 *     receiptsRoot, and receiptsRoot is in the header — so a log is as provable as a
 *     transaction.
 *   - Logs revert with their frame — An event emitted in a frame that later reverts is
 *     discarded, so a log in a receipt is evidence the code path completed.
 *   - How eth_getLogs matching works — Topics match positionally — position i must equal one
 *     of the values you gave for position i, null is a wildcard, and it is an AND across
 *     positions with an OR inside each.
 *   - An event signature is a published API — Indexers, subgraphs, wallets and analytics all
 *     key on topic0, so changing an event signature is a breaking change with no compiler to
 *     catch it downstream.
 */
contract LogsApi {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
