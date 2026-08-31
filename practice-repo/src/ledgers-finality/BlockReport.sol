// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-exit-rebuild-a-block  (measure, difficulty 5)
 * Exercised by: test/exit/BlockReport.t.sol
 * Run:      forge test --match-path test/exit/BlockReport.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Pick one mainnet block from the last month. Produce a written report and a test suite that,
 *   together, account for that block completely: what it contains, how it was assembled, who
 *   could have lied at each step, and how deep you would wait before believing a payment inside
 *   it. FIVE things have to be in it. ONE. Reconstruct the block hash from the header fields
 *   yourself. List every field, and mark each one live, or a post-Merge fossil that exists only
 *   because the structure could not change. A test asserts your reconstruction equals the real
 *   hash. TWO. For four accounts touched by that block, print the four fields of each account
 *   record, and say where the code and the storage of each actually live — not "in the account",
 *   which is the answer this track exists to break. THREE. Take six transactions and diagnose
 *   each: which of the six failure modes it hit, or that it succeeded. At least one must be a
 *   transaction that vanished or stuck rather than reverting, and your diagnosis has to come
 *   from raw RPC output rather than from a block explorer's label. FOUR. Trace the build path:
 *   searcher, builder, relay, proposer. Name the actual parties where you can identify them, and
 *   for each hop state what that party could have done that nobody downstream would detect.
 *   FIVE. Choose a confirmation policy for a hypothetical product that settles a payment from
 *   this block, and defend it against the concrete cost of reversing the chain at that depth.
 *   State the value at risk you assumed, because the answer is meaningless without it.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Confirmation policy is a product decision — How long to wait before treating something
 *     as done is derived from value at risk, not from a default someone copied.
 *   - The four roles — Searchers find opportunities, builders assemble blocks, relays escrow
 *     and validate them, and proposers sign headers.
 *   - Three levels of done — Head, justified checkpoint and finalized checkpoint are three
 *     different confidence levels, each with a different reversal cost.
 *   - What reorgs actually look like — Ordinary reorgs are one or two slots and cost the
 *     attacker nothing; deep ones require coordination and enormous stake.
 */
contract BlockReport {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
