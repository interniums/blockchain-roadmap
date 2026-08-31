// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-curves-pairings-eip2537-encoding-break  (break, grain module, difficulty 4)
 * Run:      forge test --match-path test/Bls12381Encoding.t.sol -vvv --gas-report
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   In a Foundry project forked to a Pectra-or-later chain, write a contract that calls G1ADD at
 *   0x0b and PAIRING_CHECK at 0x0f using vectors taken from the execution-spec-tests for
 *   EIP-2537, and assert the expected outputs. Then break it deliberately in two ways: send an
 *   Fp element as 48 bytes instead of the padded 64, and send a G1 point in its 48-byte
 *   compressed form instead of the 128-byte padded uncompressed form. Assert both revert.
 *   Finally measure gas for G1MSM at k equal to 1, 8 and 64 and compare each measurement against
 *   the EIP's own formula, reading the discount table from the EIP text rather than
 *   extrapolating from two points.
 */
contract Bls12381EncodingTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Positive tests call 0x0b and 0x0f with spec-test vectors and assert the documented outputs
    function test_criterion01_positiveTestsCall0x0bAnd0x0fWithSpecTest() public {
        fail("Positive tests call 0x0b and 0x0f with spec-test vectors and assert the documented outputs");
    }

    /// A test sending an unpadded 48-byte Fp element asserts the precompile call reverts
    function test_criterion02_aTestSendingAnUnpadded48ByteFpElement() public {
        fail("A test sending an unpadded 48-byte Fp element asserts the precompile call reverts");
    }

    /// A test sending a compressed 48-byte G1 point asserts the call reverts, with a comment naming
    /// which encoding rule was violated
    function test_criterion03_aTestSendingACompressed48ByteG1Point() public {
        fail("A test sending a compressed 48-byte G1 point asserts the call reverts, with a comment naming which encoding rule was violated");
    }

    /// Measured G1MSM gas at k = 1, 8 and 64 is recorded and compared in the README against the
    /// EIP's formula including its discount table
    function test_criterion04_measuredG1msmGasAtK18And64() public {
        fail("Measured G1MSM gas at k = 1, 8 and 64 is recorded and compared in the README against the EIP's formula including its discount table");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
