// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-abi-selectors-decoding-is-validation  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/AbiValidation.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Decoding is where the ABI checks your arguments, and packing is where that checking is
 *   thrown away. WHAT DECODING CATCHES. Hand-craft calldata with an out-of-range value for a
 *   narrow type — a `uint8` carrying a value above 255, or a `bool` that is neither 0 nor 1.
 *   Call a normal function with it and show the decoder rejecting it. Report what the revert
 *   looks like. WHAT IT DOES NOT. Now show strict mode is not enforced: craft calldata that
 *   violates the encoding rules — trailing junk after the arguments, or an offset that points
 *   somewhere unexpected — and get it accepted. For each case, state what a strict decoder would
 *   have rejected and why the one you called did not. PACKED THROWS IT AWAY. Take the same
 *   arguments and encode them packed. Show there is no length information and therefore nothing
 *   to validate, and demonstrate the consequence: two different argument tuples whose packed
 *   encoding is identical, used to pass a check that hashes them. FROM THE INSIDE. Finally,
 *   write a function that reads the raw call itself: recover the selector from the calldata and
 *   compare it against the built-in, then decode one argument by hand from a byte offset you
 *   compute. Assert both match what the normal decoding produced.
 */
contract AbiValidationTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Hand-crafted calldata with an out-of-range narrow-type value is rejected by the decoder,
    /// with the revert reported
    function test_criterion01_handCraftedCalldataWithAnOutOfRangeNarrow() public {
        fail("Hand-crafted calldata with an out-of-range narrow-type value is rejected by the decoder, with the revert reported");
    }

    /// Calldata violating strict encoding rules is accepted, with what a strict decoder would have
    /// rejected stated for each case
    function test_criterion02_calldataViolatingStrictEncodingRulesIsAcceptedWithWhat() public {
        fail("Calldata violating strict encoding rules is accepted, with what a strict decoder would have rejected stated for each case");
    }

    /// Packed encoding is shown to carry no length information
    function test_criterion03_packedEncodingIsShownToCarryNoLengthInformation() public {
        fail("Packed encoding is shown to carry no length information");
    }

    /// Two distinct argument tuples produce identical packed bytes and pass a hash-based check
    function test_criterion04_twoDistinctArgumentTuplesProduceIdenticalPackedBytesAnd() public {
        fail("Two distinct argument tuples produce identical packed bytes and pass a hash-based check");
    }

    /// A function recovers the selector from raw calldata and matches it against the built-in
    function test_criterion05_aFunctionRecoversTheSelectorFromRawCalldataAnd() public {
        fail("A function recovers the selector from raw calldata and matches it against the built-in");
    }

    /// One argument is decoded by hand from a computed offset and matches normal decoding
    function test_criterion06_oneArgumentIsDecodedByHandFromAComputed() public {
        fail("One argument is decoded by hand from a computed offset and matches normal decoding");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
