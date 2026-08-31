// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-three-roots-and-a-window  (implement, difficulty 3)
 * Exercised by: test/ReceiptProof.t.sol
 * Run:      forge test --junit --match-path test/ReceiptProof.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   A header commits to three separate tries, and each one lets you prove a different thing to
 *   someone who has only the header. Build the proof for one of them. THE PROOF. For a real
 *   block, take one transaction receipt and construct a Merkle proof of it against the header's
 *   receipts root. Verify it with only the header and the proof — no node, no RPC. Then corrupt
 *   one byte of the receipt and show verification fail. THREE ROOTS, THREE JOBS. State what each
 *   of the three roots commits to, and demonstrate the key difference: the state root is keyed
 *   by account and is an output of execution, while the transactions and receipts roots are
 *   keyed by index. Show one consequence of index-keying that account-keying does not have. THE
 *   BLOOM. Use the block's logs bloom to test for an event that is present and one that is not.
 *   Then show the property that makes it a filter and not an index: construct a query the bloom
 *   says might match and the block does not actually contain. State what a client must do next,
 *   and what that means for anyone treating the bloom as an answer. THE WINDOW. Finally, read
 *   the parent beacon block root from inside a contract and say what having it makes possible
 *   that was not possible before it existed.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The state root is post-execution — `stateRoot` is the account trie root *after* the
 *     block executes, so it is an outcome, not an input.
 *   - Transactions root — The root of an index-keyed trie over the block's transactions,
 *     committing to what was included and in what order.
 *   - Receipts root — The root of an index-keyed trie over receipts, which is what makes an
 *     event log provable off-chain.
 *   - The block's bloom filter — A 2048-bit filter over every log address and topic in the
 *     block; false positives are expected, false negatives are not.
 *   - A window from the EVM into consensus — EIP-4788 puts the previous beacon block root in
 *     the execution header and exposes it on-chain, so contracts can verify consensus-layer
 *     state without an oracle.
 */
contract ReceiptProof {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
