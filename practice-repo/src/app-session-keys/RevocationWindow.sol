// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-measure-revocation-window  (measure, difficulty 3)
 * Exercised by: test/RevocationWindow.t.sol
 * Run:      forge test --match-path test/RevocationWindow.t.sol --gas-report && pnpm tsx scripts/revocation-latency.ts --out latency.json
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Instrument the revocation path for your session-key module. Measure the gas cost of
 *   uninstalling the module or otherwise invalidating the session, and the wall-clock time from
 *   the moment a user would press revoke to the moment the transaction is mined on a public
 *   testnet. Then, on Anvil with auto-mining disabled, demonstrate the race directly: broadcast
 *   the revocation, and from the session key broadcast an operation at a higher fee. Mine and
 *   record which landed.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Revocation is a state change — Early revocation is a transaction - uninstall the module,
 *     bump a nonce, flip a registry bit - with gas, a signer, and inclusion delay.
 *   - The revocation race — Between clicking revoke and the revocation being mined, the key is
 *     still valid - and the revocation is public.
 *   - Expiry costs nothing — A validUntil timestamp ends the authority with no transaction,
 *     which is why short-lived keys are the cheap default.
 */
contract RevocationWindow {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
