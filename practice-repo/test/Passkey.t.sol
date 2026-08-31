// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Passkey} from "../src/app-passkeys/Passkey.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-passkeys-wrong-curve-wrong-bytes  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Passkey.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
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
 */
contract PasskeyTest is Test {
    /// The subject, from src/app-passkeys/Passkey.sol. Add functions there and call them here.
    Passkey internal subject;

    function setUp() public {
        subject = new Passkey();
    }

    /// A passkey credential is created with where the key lives, what can move it and what unlocks
    /// it all reported
    function test_criterion01_aPasskeyCredentialIsCreatedWithWhereTheKey() public {
        fail(
            "A passkey credential is created with where the key lives, what can move it and what unlocks it all reported"
        );
    }

    /// Onboarding steps are counted for a passkey and a seed phrase, both reported
    function test_criterion02_onboardingStepsAreCountedForAPasskeyAndA() public {
        fail("Onboarding steps are counted for a passkey and a seed phrase, both reported");
    }

    /// Deriving an Ethereum address from the credential is attempted with the failure point stated
    function test_criterion03_derivingAnEthereumAddressFromTheCredentialIsAttempted() public {
        fail("Deriving an Ethereum address from the credential is attempted with the failure point stated");
    }

    /// An account contract verifies a passkey signature and acts on it
    function test_criterion04_anAccountContractVerifiesAPasskeySignatureAndActs() public {
        fail("An account contract verifies a passkey signature and acts on it");
    }

    /// The signed payload is reconstructed from its parts, showing the message as one field inside
    /// it
    function test_criterion05_theSignedPayloadIsReconstructedFromItsPartsShowing() public {
        fail("The signed payload is reconstructed from its parts, showing the message as one field inside it");
    }

    /// The reconstruction is verified on chain against what the device produced
    function test_criterion06_theReconstructionIsVerifiedOnChainAgainstWhatThe() public {
        fail("The reconstruction is verified on chain against what the device produced");
    }

    /// Altering a non-message field leaves the signature valid over a different meaning
    function test_criterion07_alteringANonMessageFieldLeavesTheSignatureValid() public {
        fail("Altering a non-message field leaves the signature valid over a different meaning");
    }

    /// What a contract must check beyond the signature is stated
    function test_criterion08_whatAContractMustCheckBeyondTheSignatureIs() public {
        fail("What a contract must check beyond the signature is stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
