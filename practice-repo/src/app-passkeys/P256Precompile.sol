// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-passkeys-reconstruct-the-digest  (implement, difficulty 4)
 * Exercised by: test/P256Precompile.t.sol
 * Run:      forge test --match-path test/P256Precompile.t.sol -vv && pnpm vitest run test/webauthn-digest.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   In a browser page, register a credential with `navigator.credentials.create()` and then
 *   obtain an assertion with `navigator.credentials.get()` using a 32-byte challenge you choose.
 *   Dump `authenticatorData`, `clientDataJSON` and the signature. Decode the DER signature into
 *   `r` and `s`. In TypeScript, reconstruct the signed digest as `SHA-256(authenticatorData ‖
 *   SHA-256(clientDataJSON))` and verify it locally. Then write a Foundry test that staticcalls
 *   `0x100` with the resulting 160-byte payload on a fork with the precompile active.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - What WebAuthn actually signs — The authenticator signs authenticatorData concatenated
 *     with SHA-256 of clientDataJSON - your message is only the challenge field inside that
 *     JSON.
 *   - Rebuilding the signed bytes on-chain — The contract hashes clientDataJSON, appends it to
 *     authenticatorData, hashes again, and verifies that digest against the P-256 key.
 *   - Calling the secp256r1 verifier — Address 0x100 takes exactly 160 bytes - h, r, s, qx, qy
 *     - costs 6900 gas, and signals failure by returning nothing at all.
 */
contract P256Precompile {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
