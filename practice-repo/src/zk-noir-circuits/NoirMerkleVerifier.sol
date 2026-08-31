// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-noir-circuits-merkle-membership-to-solidity  (implement, difficulty 4)
 * Exercised by: test/NoirMerkleVerifier.t.sol
 * Run:      forge test --match-path test/NoirMerkleVerifier.t.sol -vvv --gas-report
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a Noir circuit proving knowledge of a Merkle-tree leaf preimage: private inputs are
 *   the leaf preimage and the sibling path, the public input is the root. Compile it, record the
 *   ACIR opcode count and the backend gate count separately, and generate the Solidity verifier
 *   with the backend. Deploy the verifier in a Foundry project and write tests exercising it
 *   with a real proof. Then measure the verifier's gas — no published benchmark for the default
 *   proving scheme's verifier exists, so this number has to be your own. Pin both toolchain
 *   versions in the README and state what breaks if they are mismatched by one release.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Noir — A Rust-like DSL for writing circuits, designed to hide field arithmetic and
 *     backend details behind ordinary-looking code.
 *   - Private and public inputs — Public inputs are visible to the verifier and are part of
 *     what the on-chain contract checks; private inputs are witness only.
 *   - Generating a Solidity verifier — The backend emits a verifier contract for a compiled
 *     circuit, whose public inputs must line up exactly with the circuit's.
 *   - Counting constraints — Gate count is the number that predicts proving time, memory, and
 *     whether a circuit fits inside a recursive step.
 */
contract NoirMerkleVerifier {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
