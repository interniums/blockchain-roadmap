// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-abi-selectors-hand-encode-calldata  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/HandEncoded.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Working from the ABI specification alone, write an encoder for
 *   f(uint256,uint32[],bytes10,bytes) in a language of your choice, then diff its output byte
 *   for byte against cast calldata for the same arguments. Repeat for a nested signature such as
 *   g(uint256[][],string[]) so that the inner offsets restart from the inner block. Then write a
 *   Foundry test that feeds your bytes to a deployed contract with a raw call and asserts the
 *   decoded arguments come back correct, and a second test asserting that hashing the signature
 *   with uint instead of uint256 produces a different, wrong selector.
 */
contract HandEncodedTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The hand-produced calldata for both signatures is embedded as a literal in the test and a
    /// raw call with it succeeds and returns the expected values
    function test_criterion01_theHandProducedCalldataForBothSignaturesIsEmbedded() public {
        fail("The hand-produced calldata for both signatures is embedded as a literal in the test and a raw call with it succeeds and returns the expected values");
    }

    /// A test asserts that keccak256("f(uint,uint32[],bytes10,bytes)") does not equal the real
    /// selector
    function test_criterion02_aTestAssertsThatKeccak256FUintUint32Bytes10() public {
        fail("A test asserts that keccak256(\"f(uint,uint32[],bytes10,bytes)\") does not equal the real selector");
    }

    /// The file annotates each 32-byte word of the nested example as head, tail, offset or length
    function test_criterion03_theFileAnnotatesEach32ByteWordOfThe() public {
        fail("The file annotates each 32-byte word of the nested example as head, tail, offset or length");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
