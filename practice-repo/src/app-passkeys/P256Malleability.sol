// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-passkeys-malleable-replay  (break, difficulty 4)
 * Exercised by: test/P256Malleability.t.sol
 * Run:      forge test --match-path test/P256Malleability.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a valid P-256 signature from the previous exercise and compute its counterpart with `s`
 *   replaced by `n - s`. Show the precompile accepts both. Then build an account whose replay
 *   protection keys off the signature bytes and demonstrate a double execution. Fix it two ways
 *   - normalise to low-s on the way in, and key replay protection off the nonce instead - and
 *   say which fix you would ship. Separately, verify only the P-256 signature while skipping the
 *   clientDataJSON checks, and replay an assertion harvested from a different ceremony.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - No low-s enforcement — EIP-7951 deliberately accepts both (r, s) and (r, n - s), because
 *     FIPS 186-5 does not require non-malleable ECDSA.
 *   - The checks the signature does not perform — Verify the ceremony type, the challenge
 *     value and its position, the relying-party binding, and the flag bits - or a valid
 *     signature from elsewhere is accepted.
 *   - Calling the secp256r1 verifier — Address 0x100 takes exactly 160 bytes - h, r, s, qx, qy
 *     - costs 6900 gas, and signals failure by returning nothing at all.
 */
contract P256Malleability {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
