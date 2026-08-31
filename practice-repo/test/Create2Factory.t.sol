// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Create2Factory} from "../src/evm-execution/Create2Factory.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-create2-factory  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/Create2Factory.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a factory with `deploy(bytes32 salt, bytes memory initcode)` using CREATE2, plus a
 *   pure `predict(bytes32 salt, bytes32 initcodeHash)` that implements `keccak256(0xff ‖
 *   address(this) ‖ salt ‖ initcodeHash)[12:]` by hand in assembly. Prove `predict` matches the
 *   deployed address for three different salts. Then prove the trap: deploy the same contract
 *   source with a different constructor argument and show the address changes, and deploy
 *   through CREATE instead and show the address depends on the factory's nonce rather than on
 *   the initcode.
 */
contract Create2FactoryTest is Test {
    /// The subject, from src/evm-execution/Create2Factory.sol. Add functions there and call them here.
    Create2Factory internal subject;

    function setUp() public {
        subject = new Create2Factory();
    }

    /// predict matches the actual deployed address for three distinct salts
    function test_criterion01_predictMatchesTheActualDeployedAddressForThreeDistinct() public {
        fail("predict matches the actual deployed address for three distinct salts");
    }

    /// A test proves changing one constructor argument changes the CREATE2 address
    function test_criterion02_aTestProvesChangingOneConstructorArgumentChangesThe() public {
        fail("A test proves changing one constructor argument changes the CREATE2 address");
    }

    /// A test proves the CREATE address changes when the factory's nonce changes, with identical
    /// initcode
    function test_criterion03_aTestProvesTheCreateAddressChangesWhenThe() public {
        fail("A test proves the CREATE address changes when the factory's nonce changes, with identical initcode");
    }

    /// The assembly implementation of predict does not call any library helper
    function test_criterion04_theAssemblyImplementationOfPredictDoesNotCallAny() public {
        fail("The assembly implementation of predict does not call any library helper");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
