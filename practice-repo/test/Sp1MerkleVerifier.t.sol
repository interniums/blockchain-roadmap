// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-zkvms-prove-merkle-membership  (implement, grain block, difficulty 3)
 * Run:      forge test --match-path test/Sp1MerkleVerifier.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write an SP1 guest program in Rust that takes a leaf value and a Merkle path as private
 *   inputs and a Merkle root as a public input, recomputes the root from leaf plus path, and
 *   asserts it equals the public root. Commit the root and a caller-supplied nonce as the
 *   program's public values. Build the host program that supplies a real path from a tree you
 *   construct, generate a proof, and export the proof bytes plus public values. Then deploy the
 *   generated Solidity verifier in a Foundry project and write tests that submit the proof. Pin
 *   the SP1 toolchain version in the repository and record it in the README, because the guest,
 *   the prover and the verifier contract must all come from the same release. Report proving
 *   wall-clock in seconds, peak memory in gigabytes, and proof size in bytes.
 */
contract Sp1MerkleVerifierTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test submits the real proof and the matching public values and the verifier returns
    /// success
    function test_criterion01_aTestSubmitsTheRealProofAndTheMatching() public {
        fail("A test submits the real proof and the matching public values and the verifier returns success");
    }

    /// A second test flips one byte of the proof and asserts the call reverts or returns false
    function test_criterion02_aSecondTestFlipsOneByteOfTheProof() public {
        fail("A second test flips one byte of the proof and asserts the call reverts or returns false");
    }

    /// A third test submits the unmodified proof with a different Merkle root as the public input
    /// and asserts it fails
    function test_criterion03_aThirdTestSubmitsTheUnmodifiedProofWithA() public {
        fail("A third test submits the unmodified proof with a different Merkle root as the public input and asserts it fails");
    }

    /// The README records the pinned SP1 version plus proving wall-clock in seconds, peak RSS in
    /// GB, and proof size in bytes
    function test_criterion04_theReadmeRecordsThePinnedSp1VersionPlusProving() public {
        fail("The README records the pinned SP1 version plus proving wall-clock in seconds, peak RSS in GB, and proof size in bytes");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
