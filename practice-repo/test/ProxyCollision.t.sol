// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-proxies-upgrades-slot-zero-collision-and-fix  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ProxyCollision.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a proxy that keeps its implementation address and its admin address as ordinary
 *   declared state variables, and an implementation whose first two state variables are an
 *   unrelated uint256 and an unrelated address. Through the proxy, call an ordinary setter on
 *   the implementation and take over the proxy — first repointing the implementation, then, in a
 *   second scenario, becoming the admin. Fix by moving both proxy variables to their EIP-1967
 *   slots with inline assembly, and re-run both attacks.
 */
contract ProxyCollisionTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test proves an attacker-chosen address ends up in the proxy's implementation position
    /// after calling an innocuous implementation function
    function test_criterion01_aTestProvesAnAttackerChosenAddressEndsUp() public {
        fail("A test proves an attacker-chosen address ends up in the proxy's implementation position after calling an innocuous implementation function");
    }

    /// A second test proves the admin position can be captured the same way
    function test_criterion02_aSecondTestProvesTheAdminPositionCanBe() public {
        fail("A second test proves the admin position can be captured the same way");
    }

    /// Both tests fail to corrupt anything against the EIP-1967 version, verified by reading the
    /// two standard slots with vm.load
    function test_criterion03_bothTestsFailToCorruptAnythingAgainstTheEip() public {
        fail("Both tests fail to corrupt anything against the EIP-1967 version, verified by reading the two standard slots with vm.load");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
