// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {HashGuarantees} from "../src/fundamentals-crypto/HashGuarantees.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-crypto-order-the-three-guarantees  (measure, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/HashGuarantees.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   The three properties a hash offers are not equally strong, and the weakest one is the one
 *   most protocol code depends on. Establish the ordering with numbers rather than adjectives.
 *   For a 256-bit digest, state the expected work to break preimage, second-preimage and
 *   collision resistance, and show the arithmetic — including why the collision figure is half
 *   the digest length rather than the whole of it. Then, for each of three real uses of a digest
 *   in Ethereum — a transaction hash, a Merkle root, a storage key — say which of the three
 *   properties that use actually depends on, and what an attacker who broke it could do. Then
 *   the identity trap. Hash the same input with `keccak256` and with SHA3-256 and show the
 *   digests differ. Print both, and name the specific difference in the construction that causes
 *   it.
 */
contract HashGuaranteesTest is Test {
    /// The subject, from src/fundamentals-crypto/HashGuarantees.sol. Add functions there and call them here.
    HashGuarantees internal subject;

    function setUp() public {
        subject = new HashGuarantees();
    }

    /// Expected work for all three properties is stated for a 256-bit digest, with the arithmetic
    /// shown
    function test_criterion01_expectedWorkForAllThreePropertiesIsStatedFor() public {
        fail("Expected work for all three properties is stated for a 256-bit digest, with the arithmetic shown");
    }

    /// The write-up explains why collision resistance is half the digest length
    function test_criterion02_theWriteUpExplainsWhyCollisionResistanceIsHalf() public {
        fail("The write-up explains why collision resistance is half the digest length");
    }

    /// Three real uses of a digest are each mapped to the property they depend on, with the
    /// consequence of breaking it
    function test_criterion03_threeRealUsesOfADigestAreEachMapped() public {
        fail(
            "Three real uses of a digest are each mapped to the property they depend on, with the consequence of breaking it"
        );
    }

    /// A test shows keccak256 and SHA3-256 producing different digests for the same input, with
    /// both printed
    function test_criterion04_aTestShowsKeccak256AndSha3256ProducingDifferent() public {
        fail("A test shows keccak256 and SHA3-256 producing different digests for the same input, with both printed");
    }

    /// The construction difference responsible is named specifically
    function test_criterion05_theConstructionDifferenceResponsibleIsNamedSpecifically() public {
        fail("The construction difference responsible is named specifically");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
