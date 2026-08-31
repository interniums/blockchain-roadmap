// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-commitments-kzg-point-evaluation-roundtrip  (implement, difficulty 4)
 * Exercised by: test/PointEvaluation.t.sol
 * Run:      forge test --match-path test/PointEvaluation.t.sol -vvv --gas-report
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Using the reference KZG library bindings, take an arbitrary 128 KiB input, pad and encode it
 *   as a blob of 4096 field elements, compute its KZG commitment, and compute an opening proof
 *   at a point z of your choosing. Derive the versioned hash yourself as the 0x01 version byte
 *   followed by bytes 1..32 of the SHA-256 of the commitment, and assert it matches what the
 *   library returns. Then write a Foundry test that assembles the exact 192-byte input for the
 *   precompile at address 0x0A — versioned hash, z, y, commitment, proof — via staticcall,
 *   asserts success, and records the gas consumed. Add negative cases. Read the precompile's gas
 *   constant from the EIP and compare it against what you measured rather than against any
 *   number quoted in a tutorial.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Data is the evaluations of a polynomial — Arbitrary bytes are read as a polynomial's
 *     values over a fixed domain — a blob is exactly 4096 field elements.
 *   - KZG commitments — Commit to a polynomial of any degree as a single 48-byte curve point,
 *     with a 48-byte opening proof.
 *   - KZG opening proof — An opening for p(z) = y is a commitment to the quotient (p(X) −
 *     y)/(X − z), checked with one pairing equation.
 *   - Point-evaluation precompile — The precompile at 0x0A takes exactly 192 bytes and
 *     verifies that a committed polynomial evaluates to y at z.
 */
contract PointEvaluation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
