// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-crypto-order-the-three-guarantees  (measure, difficulty 2)
 * Exercised by: test/HashGuarantees.t.sol
 * Run:      forge test --junit --match-path test/HashGuarantees.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   The three properties a hash offers are not equally strong, and the weakest one is the one
 *   most protocol code depends on. Establish the ordering with numbers rather than adjectives.
 *   For a 256-bit digest, state the expected work to break preimage, second-preimage and
 *   collision resistance, and show the arithmetic — including why the collision figure is half
 *   the digest length rather than the whole of it. Then, for each of three real uses of a digest
 *   in Ethereum — a transaction hash, a Merkle root, a storage key — say which of the three
 *   properties that use actually depends on, and what an attacker who broke it could do. Then
 *   the identity trap. Hash the same input with `keccak256` and with SHA3-256 and show the
 *   digests differ. Print both, and name the specific difference in the construction that causes
 *   it.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Hash function — A deterministic map from arbitrary-length input to a fixed-length
 *     digest, cheap forward and infeasible to invert.
 *   - Preimage resistance — Given a digest, it is infeasible to find any input that hashes to
 *     it.
 *   - Second-preimage resistance — Given one message, it is infeasible to find a different
 *     message with the same digest.
 *   - Collision resistance — It is infeasible to find any pair of distinct inputs sharing a
 *     digest, with both inputs attacker-chosen.
 *   - keccak256 is not SHA3-256 — Ethereum's keccak256 is pre-standardisation Keccak; the same
 *     input yields a different digest than NIST SHA3-256.
 */
contract HashGuarantees {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
