// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-passkeys-reconstruct-the-digest  (implement, grain block, difficulty 4)
 * Run:      forge test --match-path test/P256Precompile.t.sol -vv && pnpm vitest run test/webauthn-digest.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   In a browser page, register a credential with `navigator.credentials.create()` and then
 *   obtain an assertion with `navigator.credentials.get()` using a 32-byte challenge you choose.
 *   Dump `authenticatorData`, `clientDataJSON` and the signature. Decode the DER signature into
 *   `r` and `s`. In TypeScript, reconstruct the signed digest as `SHA-256(authenticatorData ‖
 *   SHA-256(clientDataJSON))` and verify it locally. Then write a Foundry test that staticcalls
 *   `0x100` with the resulting 160-byte payload on a fork with the precompile active.
 */
contract P256PrecompileTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The TypeScript test verifies the reconstructed digest against the credential's public key
    /// and locates the challenge bytes inside the raw clientDataJSON
    function test_criterion01_theTypescriptTestVerifiesTheReconstructedDigestAgainstThe() public {
        fail("The TypeScript test verifies the reconstructed digest against the credential's public key and locates the challenge bytes inside the raw clientDataJSON");
    }

    /// The Foundry test asserts a valid payload returns 32 bytes whose value is one
    function test_criterion02_theFoundryTestAssertsAValidPayloadReturns32() public {
        fail("The Foundry test asserts a valid payload returns 32 bytes whose value is one");
    }

    /// Flipping one byte of r makes the Foundry test assert a zero-length return, and the assertion
    /// is on returndatasize rather than on call success
    function test_criterion03_flippingOneByteOfRMakesTheFoundryTest() public {
        fail("Flipping one byte of r makes the Foundry test assert a zero-length return, and the assertion is on returndatasize rather than on call success");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
