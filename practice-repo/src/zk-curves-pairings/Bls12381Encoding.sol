// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-curves-pairings-eip2537-encoding-break  (break, difficulty 4)
 * Exercised by: test/Bls12381Encoding.t.sol
 * Run:      forge test --match-path test/Bls12381Encoding.t.sol -vvv --gas-report
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   In a Foundry project forked to a Pectra-or-later chain, write a contract that calls G1ADD at
 *   0x0b and PAIRING_CHECK at 0x0f using vectors taken from the execution-spec-tests for
 *   EIP-2537, and assert the expected outputs. Then break it deliberately in two ways: send an
 *   Fp element as 48 bytes instead of the padded 64, and send a G1 point in its 48-byte
 *   compressed form instead of the 128-byte padded uncompressed form. Assert both revert.
 *   Finally measure gas for G1MSM at k equal to 1, 8 and 64 and compare each measurement against
 *   the EIP's own formula, reading the discount table from the EIP text rather than
 *   extrapolating from two points.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The BLS12-381 precompiles — EIP-2537 added seven BLS12-381 operations at 0x0b–0x11, with
 *     padded uncompressed encodings that differ from the 48-byte compressed form.
 *   - G1 and G2 are not interchangeable — G2 elements are about twice the size and much
 *     costlier to operate on, so protocols place the frequently transmitted object in G1.
 *   - BLS12-381 — The curve of Ethereum consensus signatures and blob commitments, designed
 *     with modern attacks in mind.
 *   - Multi-scalar multiplication — Computing a sum of many scalar multiples at once, with a
 *     volume discount — the dominant cost inside provers and the reason the precompiles expose
 *     it directly.
 */
contract Bls12381Encoding {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
