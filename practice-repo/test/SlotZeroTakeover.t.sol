// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-calls-delegatecall-slot-zero-takeover  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/SlotZeroTakeover.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a proxy whose slot 0 holds address implementation and an implementation whose slot 0
 *   holds uint256 totalSupply. Call, through the proxy, a perfectly ordinary function that sets
 *   totalSupply = 1. Prove that the proxy's implementation pointer is now address(0x01), and
 *   then prove the more unsettling half: every subsequent call through the proxy returns success
 *   with empty return data, because the target has no code. Then move the proxy's state to the
 *   EIP-1967 slot with inline assembly and re-run the identical breaking test.
 */
contract SlotZeroTakeoverTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts vm.load of the proxy's slot 0 changed to the value written by the
    /// implementation
    function test_criterion01_aTestAssertsVmLoadOfTheProxyS() public {
        fail("A test asserts vm.load of the proxy's slot 0 changed to the value written by the implementation");
    }

    /// A test asserts a later call through the corrupted proxy returns success with zero-length
    /// returndata
    function test_criterion02_aTestAssertsALaterCallThroughTheCorrupted() public {
        fail("A test asserts a later call through the corrupted proxy returns success with zero-length returndata");
    }

    /// The same breaking test run against the EIP-1967 version leaves the implementation slot
    /// unchanged, verified with vm.load of
    /// 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
    function test_criterion03_theSameBreakingTestRunAgainstTheEip1967() public {
        fail("The same breaking test run against the EIP-1967 version leaves the implementation slot unchanged, verified with vm.load of 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
