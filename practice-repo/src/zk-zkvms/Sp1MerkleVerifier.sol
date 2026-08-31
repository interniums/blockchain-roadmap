// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-zkvms-prove-merkle-membership  (implement, difficulty 3)
 * Exercised by: test/Sp1MerkleVerifier.t.sol
 * Run:      forge test --match-path test/Sp1MerkleVerifier.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write an SP1 guest program in Rust that takes a leaf value and a Merkle path as private
 *   inputs and a Merkle root as a public input, recomputes the root from leaf plus path, and
 *   asserts it equals the public root. Commit the root and a caller-supplied nonce as the
 *   program's public values. Build the host program that supplies a real path from a tree you
 *   construct, generate a proof, and export the proof bytes plus public values. Then deploy the
 *   generated Solidity verifier in a Foundry project and write tests that submit the proof. Pin
 *   the SP1 toolchain version in the repository and record it in the README, because the guest,
 *   the prover and the verifier contract must all come from the same release. Report proving
 *   wall-clock in seconds, peak memory in gigabytes, and proof size in bytes.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - zkVM — A machine that proves a program executed correctly, so you write ordinary Rust
 *     instead of a circuit.
 *   - Guest program — The code whose execution is proved, compiled to the zkVM's instruction
 *     set rather than to your host machine.
 *   - On-chain verification is what makes off-chain work trustworthy — An L1 contract checks
 *     the proof, so a chain can accept the result of a computation it never ran.
 */
contract Sp1MerkleVerifier {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
