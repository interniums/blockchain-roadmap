// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-privacy-applications-link-your-own-withdrawal  (break, difficulty 5)
 * Exercised by: test/ShieldedPoolLinkage.t.sol
 * Run:      forge test --match-path test/ShieldedPoolLinkage.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a minimal fixed-denomination shielded pool in Foundry: deposits append a note
 *   commitment to an on-chain Merkle tree, withdrawals present a proof of membership and publish
 *   a nullifier that the contract records. Then break it twice. First, cryptographically:
 *   implement the nullifier as a hash of the note commitment rather than of the spending secret,
 *   and write a script that reconstructs the deposit-to-withdrawal mapping from public data
 *   alone. Second, operationally: with the correct nullifier in place, deposit from address A,
 *   withdraw to a fresh address B, then fund B's gas from A, and write the heuristic that
 *   recovers the A-to-B link anyway. Fix the first by deriving the nullifier from the spending
 *   key, and the second by routing the withdrawal through a relayer. Then compute the effective
 *   anonymity set for one withdrawal — deposits of the same denomination inside a plausible time
 *   window — and state your filtering assumptions.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Nullifier — Spending a note publishes a one-way, deterministic value derived from its
 *     secret, which prevents double-spends without revealing which note was spent.
 *   - Both nullifier properties are load-bearing — Determined by the note or double-spends
 *     become possible; uncorrelated with the commitment or the privacy is gone.
 *   - Deanonymisation is a metadata problem — Timing, IP address, gas funding, RPC provider
 *     and the destination address deanonymise users far more often than any cryptographic
 *     weakness.
 *   - Anonymity is a liquidity property — Privacy is bounded by the set of participants you
 *     could plausibly be — a pool with a handful of users gives none, whatever the
 *     cryptography.
 *   - Relayer — A fresh withdrawal address has no gas, so a third party submits the
 *     transaction for a fee — solving one leak and introducing a censor.
 */
contract ShieldedPoolLinkage {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
