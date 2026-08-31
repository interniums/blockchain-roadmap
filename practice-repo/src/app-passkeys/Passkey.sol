// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-passkeys-wrong-curve-wrong-bytes  (implement, difficulty 3)
 * Exercised by: test/Passkey.t.sol
 * Run:      forge test --junit --match-path test/Passkey.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   A passkey is on the wrong curve and signs the wrong bytes, and it is still the best consumer
 *   onboarding available. Build it and be precise about both problems. WHAT IT IS. Create a
 *   passkey credential and report exactly what exists afterwards: where the private key lives,
 *   what can move it, and what unlocks it. Then state the onboarding win in concrete steps —
 *   count the steps a user takes with a passkey and with a seed phrase, and report both numbers.
 *   THE WRONG CURVE. Show that the credential's public key cannot be an Ethereum address:
 *   attempt the derivation and state where it fails. Then state the consequence — that the
 *   account must be a contract — and demonstrate the minimum: an account contract that verifies
 *   a passkey signature and acts on it. THE WRONG BYTES. Show what the authenticator actually
 *   signed. It is not your message: reconstruct the signed payload from its parts and show your
 *   message is one field inside a hash inside it. Then verify that reconstruction on chain and
 *   assert it matches what the device produced. Then the failure that follows: alter one field
 *   of the payload that is not your message, and show the signature still verifying over a
 *   different meaning. State what a contract must check beyond the signature.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Passkey — A WebAuthn credential - a P-256 keypair held in device secure hardware,
 *     unlocked by biometric or PIN, with a non-exportable private key.
 *   - Why a product wants passkeys — No seed phrase, no extension, a biometric per action, and
 *     phishing resistance that comes from the credential being bound to a domain.
 *   - The curve mismatch — Ethereum EOAs sign on secp256k1 and passkeys sign on secp256r1, so
 *     a passkey can never be an EOA key.
 *   - A passkey controls funds only through a contract — Because of the curve, a passkey must
 *     act through code that verifies P-256 - a smart account, an ERC-1271 signer, or a
 *     delegated EOA.
 */
contract Passkey {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
