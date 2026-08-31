// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-deploy-verify-address-by-hand  (measure, difficulty 4)
 * Exercised by: test/AddressDerivation.t.sol
 * Run:      forge test --junit --match-path test/AddressDerivation.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Compute a CREATE2 address by hand inside a test — `keccak256(0xff ‖ deployer ‖ salt ‖
 *   keccak256(initcode))` truncated to twenty bytes, where initcode is the creation bytecode
 *   with the ABI-encoded constructor arguments appended — and assert it equals the address
 *   produced by an actual salted deployment. Then change exactly one constructor argument,
 *   predict the new address before running, and assert that too. Repeat once more changing only
 *   the optimizer setting, and confirm the address moves again. Finally, deploy with a plain
 *   CREATE from an account whose nonce you have advanced, and show the address is unrelated to
 *   any of them.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Where a CREATE address comes from — A plain CREATE address is keccak256(rlp(sender,
 *     nonce))[12:] — it depends on the deployer's nonce, so it cannot be reproduced once
 *     nonces diverge.
 *   - The initcode hash includes more than you think — Constructor arguments and compiler
 *     settings are part of the initcode hash, so one changed argument silently changes the
 *     CREATE2 address.
 *   - The 0x4e59 deployer — A community CREATE2 factory exists at the same address on most
 *     chains, and Foundry routes salted new C{salt: s}() through it by default.
 *   - Same address is not same contract — Identical addresses across chains say nothing about
 *     identical code or identical configuration; each chain must be verified on its own.
 */
contract AddressDerivation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
