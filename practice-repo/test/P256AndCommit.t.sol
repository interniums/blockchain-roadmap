// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {P256AndCommit} from "../src/fundamentals-crypto/P256AndCommit.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-crypto-a-key-you-cannot-export  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/P256AndCommit.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Two things a contract can now do that it could not before, and one property that binds them.
 *   THE OTHER CURVE. Produce a P-256 signature — from a device secure element if you have one,
 *   otherwise from a library — and verify it on chain through the precompile. Report the gas.
 *   Then verify the same signature the old way, in Solidity without the precompile, and report
 *   that gas too. State the ratio, because that ratio is the entire reason this is newly
 *   practical. Then say precisely what a P-256 key held in a phone's secure element gives you
 *   that a secp256k1 key in application memory does not, and what it takes away. THE COMMITMENT.
 *   Implement a hash commitment: commit now, reveal later, verify the reveal matches. Then break
 *   a naive version — commit to a value from a small set and recover it by brute force — and fix
 *   it. A comment states which of the two commitment properties your naive version failed, and
 *   which the fix restored.
 */
contract P256AndCommitTest is Test {
    /// The subject, from src/fundamentals-crypto/P256AndCommit.sol. Add functions there and call them here.
    P256AndCommit internal subject;

    function setUp() public {
        subject = new P256AndCommit();
    }

    /// A P-256 signature verifies on chain through the precompile, with the gas reported
    function test_criterion01_aP256SignatureVerifiesOnChainThroughThe() public {
        fail("A P-256 signature verifies on chain through the precompile, with the gas reported");
    }

    /// The same signature verifies via Solidity without the precompile, with the gas reported and
    /// the ratio stated
    function test_criterion02_theSameSignatureVerifiesViaSolidityWithoutThePrecompile() public {
        fail(
            "The same signature verifies via Solidity without the precompile, with the gas reported and the ratio stated"
        );
    }

    /// The write-up states what a secure-element key gains and what it costs, against a key in
    /// application memory
    function test_criterion03_theWriteUpStatesWhatASecureElementKey() public {
        fail(
            "The write-up states what a secure-element key gains and what it costs, against a key in application memory"
        );
    }

    /// A hash commitment is implemented with commit, reveal and verification
    function test_criterion04_aHashCommitmentIsImplementedWithCommitRevealAnd() public {
        fail("A hash commitment is implemented with commit, reveal and verification");
    }

    /// A naive commitment over a small value set is broken by brute force
    function test_criterion05_aNaiveCommitmentOverASmallValueSetIs() public {
        fail("A naive commitment over a small value set is broken by brute force");
    }

    /// A comment names which commitment property failed and which the fix restored
    function test_criterion06_aCommentNamesWhichCommitmentPropertyFailedAndWhich() public {
        fail("A comment names which commitment property failed and which the fix restored");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
