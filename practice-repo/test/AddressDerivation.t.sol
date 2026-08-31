// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-deploy-verify-address-by-hand  (measure, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/AddressDerivation.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Compute a CREATE2 address by hand inside a test — `keccak256(0xff ‖ deployer ‖ salt ‖
 *   keccak256(initcode))` truncated to twenty bytes, where initcode is the creation bytecode
 *   with the ABI-encoded constructor arguments appended — and assert it equals the address
 *   produced by an actual salted deployment. Then change exactly one constructor argument,
 *   predict the new address before running, and assert that too. Repeat once more changing only
 *   the optimizer setting, and confirm the address moves again. Finally, deploy with a plain
 *   CREATE from an account whose nonce you have advanced, and show the address is unrelated to
 *   any of them.
 */
contract AddressDerivationTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test computes the CREATE2 address from its four inputs and asserts equality with a real
    /// salted deployment
    function test_criterion01_aTestComputesTheCreate2AddressFromItsFour() public {
        fail("A test computes the CREATE2 address from its four inputs and asserts equality with a real salted deployment");
    }

    /// Changing one constructor argument changes the address, and the new address is predicted
    /// before deployment rather than read back afterwards
    function test_criterion02_changingOneConstructorArgumentChangesTheAddressAndThe() public {
        fail("Changing one constructor argument changes the address, and the new address is predicted before deployment rather than read back afterwards");
    }

    /// A test shows the plain CREATE address depending on the deployer's nonce
    function test_criterion03_aTestShowsThePlainCreateAddressDependingOn() public {
        fail("A test shows the plain CREATE address depending on the deployer's nonce");
    }

    /// A written note names the three things that changed the initcode hash across the exercise
    function test_criterion04_aWrittenNoteNamesTheThreeThingsThatChanged() public {
        fail("A written note names the three things that changed the initcode hash across the exercise");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
