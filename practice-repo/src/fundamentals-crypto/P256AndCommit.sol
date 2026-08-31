// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-crypto-a-key-you-cannot-export  (implement, difficulty 3)
 * Exercised by: test/P256AndCommit.t.sol
 * Run:      forge test --junit --match-path test/P256AndCommit.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Two things a contract can now do that it could not before, and one property that binds them.
 *   THE OTHER CURVE. Produce a P-256 signature — from a device secure element if you have one,
 *   otherwise from a library — and verify it on chain through the precompile. Report the gas.
 *   Then verify the same signature the old way, in Solidity without the precompile, and report
 *   that gas too. State the ratio, because that ratio is the entire reason this is newly
 *   practical. Then say precisely what a P-256 key held in a phone's secure element gives you
 *   that a secp256k1 key in application memory does not, and what it takes away. THE COMMITMENT.
 *   Implement a hash commitment: commit now, reveal later, verify the reveal matches. Then break
 *   a naive version — commit to a value from a small set and recover it by brute force — and fix
 *   it. A comment states which of the two commitment properties your naive version failed, and
 *   which the fix restored.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - secp256r1 (P-256) — The NIST curve used by Secure Enclave, Android Keystore and WebAuthn
 *     — a different curve from Ethereum's secp256k1.
 *   - The P256VERIFY precompile — EIP-7951 adds a precompile at address `0x100` that verifies
 *     secp256r1 signatures natively for 6900 gas.
 *   - Commitment — A value that binds you to a secret without revealing it; it must be both
 *     hiding and binding.
 *   - Hash commitment — `keccak256(value ‖ salt)` — the salt supplies hiding, collision
 *     resistance supplies binding.
 */
contract P256AndCommit {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
