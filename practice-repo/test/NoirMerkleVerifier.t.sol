// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-noir-circuits-merkle-membership-to-solidity  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/NoirMerkleVerifier.t.sol -vvv --gas-report
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a Noir circuit proving knowledge of a Merkle-tree leaf preimage: private inputs are
 *   the leaf preimage and the sibling path, the public input is the root. Compile it, record the
 *   ACIR opcode count and the backend gate count separately, and generate the Solidity verifier
 *   with the backend. Deploy the verifier in a Foundry project and write tests exercising it
 *   with a real proof. Then measure the verifier's gas — no published benchmark for the default
 *   proving scheme's verifier exists, so this number has to be your own. Pin both toolchain
 *   versions in the README and state what breaks if they are mismatched by one release.
 */
contract NoirMerkleVerifierTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test passes a valid proof with the correct public root and asserts verification succeeds
    function test_criterion01_aTestPassesAValidProofWithTheCorrect() public {
        fail("A test passes a valid proof with the correct public root and asserts verification succeeds");
    }

    /// A test passes the same proof with a root differing by one bit and asserts verification fails
    function test_criterion02_aTestPassesTheSameProofWithARoot() public {
        fail("A test passes the same proof with a root differing by one bit and asserts verification fails");
    }

    /// The gas report records measured verification gas, and the README states it as a measured
    /// figure with the toolchain versions that produced it
    function test_criterion03_theGasReportRecordsMeasuredVerificationGasAndThe() public {
        fail("The gas report records measured verification gas, and the README states it as a measured figure with the toolchain versions that produced it");
    }

    /// The README lists ACIR opcode count and backend gate count as two separate numbers with a
    /// sentence on why they differ
    function test_criterion04_theReadmeListsAcirOpcodeCountAndBackendGate() public {
        fail("The README lists ACIR opcode count and backend gate count as two separate numbers with a sentence on why they differ");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
