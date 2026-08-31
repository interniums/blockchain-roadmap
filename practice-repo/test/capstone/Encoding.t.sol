// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-encoding-capstone-one-byte-string  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/Encoding.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a single codec library that speaks all three of this module's encodings, and then use
 *   it to demonstrate the failure that connects them. ABI. Encode and decode a call with a
 *   dynamic argument — a `bytes` and a `string[]` — from scratch. Head and tail, offsets in
 *   words, right-padding for bytes and left-padding for numbers. Round-trip a real mainnet
 *   calldata blob and assert you reproduce it byte for byte, selector included, with the
 *   selector derived from the signature rather than looked up. RLP. Encode and decode the same
 *   transaction envelope. Prove your implementation rejects a non-canonical encoding: a length
 *   prefix that could have been shorter, and a leading zero on an integer. Both must fail, and
 *   your error must say which rule they broke. SSZ. Encode a fixed-size container and a
 *   variable-size one, and compute the Merkle root of each. Show that the root of a container
 *   with one field changed differs, and that the root of the same logical value encoded twice
 *   does not. THE COLLISION. Construct two distinct argument tuples whose `abi.encodePacked`
 *   output is byte-identical, and use them to pass a check that hashes the packed bytes. Then
 *   show the same two tuples produce different `abi.encode` output and fail the same check. This
 *   is the whole module in one test: an ambiguous encoding is one you cannot safely hash.
 */
contract EncodingTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Real mainnet calldata with at least one dynamic argument round-trips byte-for-byte through
    /// your own ABI codec, with the selector derived from the signature
    function test_criterion01_realMainnetCalldataWithAtLeastOneDynamicArgument() public {
        fail("Real mainnet calldata with at least one dynamic argument round-trips byte-for-byte through your own ABI codec, with the selector derived from the signature");
    }

    /// A real transaction round-trips through your own RLP codec byte-for-byte
    function test_criterion02_aRealTransactionRoundTripsThroughYourOwnRlp() public {
        fail("A real transaction round-trips through your own RLP codec byte-for-byte");
    }

    /// A non-minimal length prefix and a leading-zero integer are both rejected, each with an error
    /// naming the canonicality rule broken
    function test_criterion03_aNonMinimalLengthPrefixAndALeadingZero() public {
        fail("A non-minimal length prefix and a leading-zero integer are both rejected, each with an error naming the canonicality rule broken");
    }

    /// SSZ Merkle roots change when a field changes and are stable across two encodings of the same
    /// value
    function test_criterion04_sszMerkleRootsChangeWhenAFieldChangesAnd() public {
        fail("SSZ Merkle roots change when a field changes and are stable across two encodings of the same value");
    }

    /// Two distinct argument tuples produce identical abi.encodePacked bytes, demonstrated rather
    /// than asserted
    function test_criterion05_twoDistinctArgumentTuplesProduceIdenticalAbiEncodepackedBytes() public {
        fail("Two distinct argument tuples produce identical abi.encodePacked bytes, demonstrated rather than asserted");
    }

    /// Those two tuples pass a check that hashes the packed bytes, and fail the same check under
    /// abi.encode
    function test_criterion06_thoseTwoTuplesPassACheckThatHashesThe() public {
        fail("Those two tuples pass a check that hashes the packed bytes, and fail the same check under abi.encode");
    }

    /// No test uses a library encoder or decoder for the format it is testing
    function test_criterion07_noTestUsesALibraryEncoderOrDecoderFor() public {
        fail("No test uses a library encoder or decoder for the format it is testing");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
