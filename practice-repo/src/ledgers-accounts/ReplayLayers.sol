// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-accounts-three-layers-of-replay  (break, difficulty 3)
 * Exercised by: test/ReplayLayers.t.sol
 * Run:      forge test --junit --match-path test/ReplayLayers.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Replay protection is three separate mechanisms, and knowing which one stops what is the
 *   difference between a working integration and a drained one. THREE REPLAYS, THREE OUTCOMES.
 *   Take one signed transaction and attempt to replay it: on the same chain at the same nonce,
 *   on the same chain at a different nonce, and on a different chain with the same nonce. For
 *   each, say which layer rejected it — the nonce, the chain id, or nothing — and show the
 *   rejection. Then find the case that is not protected. Construct a message signed for one
 *   purpose and accepted for another, where no nonce and no chain id is involved because it
 *   never became a transaction. Name what would have prevented it. THE ASYMMETRY. Separately,
 *   show that ETH is not a token: transfer ETH and transfer an ERC-20 to the same recipient and
 *   enumerate every difference in what the receiving code can observe and control. Then
 *   demonstrate empty-account clearing: create an account, empty it, and show what happens to
 *   the record. Close with one sentence naming the thing this account model made cheap that the
 *   UTXO model made expensive, and one naming the reverse.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - ETH lives in a protocol field — Balance is an integer count of wei in the account record
 *     itself, not an entry in any ledger contract.
 *   - Empty accounts are deleted on touch — An account with nonce 0, balance 0 and no code is
 *     removed from state when touched, so sending it nothing leaves no trace.
 *   - The nonce makes a transaction single-use — Re-broadcasting a signed transaction after it
 *     lands is a no-op, because its nonce is already consumed.
 *   - Cross-chain replay is a separate problem — The nonce does not stop replay on another
 *     chain; EIP-155 folds the chain id into the signed payload to do that.
 *   - What each model buys and what it charges — UTXO gives parallelism and replay-resistance
 *     by construction; accounts give shared mutable state and therefore ordering, contention
 *     and MEV.
 */
contract ReplayLayers {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
