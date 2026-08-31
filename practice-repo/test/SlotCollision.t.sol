// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {SlotCollision} from "../src/evm-execution/SlotCollision.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-proxy-slot-collision  (fix, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/SlotCollision.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a minimal proxy that stores its admin address in storage slot 0 and delegatecalls an
 *   implementation. Give the implementation its own state variable declared first, so it also
 *   lands in slot 0. Write a test that calls a perfectly ordinary implementation setter and
 *   demonstrates the proxy's admin has been overwritten — ideally with an attacker-chosen value.
 *   Then fix it by moving the admin pointer to an ERC-1967 style fixed hashed slot, and prove
 *   the same implementation call no longer disturbs it. State in a comment why DELEGATECALL is
 *   what made the collision possible.
 */
contract SlotCollisionTest is Test {
    /// The subject, from src/evm-execution/SlotCollision.sol. Add functions there and call them here.
    SlotCollision internal subject;

    function setUp() public {
        subject = new SlotCollision();
    }

    /// A test that fails on the vulnerable proxy by showing the admin address changed after an
    /// implementation call
    function test_criterion01_aTestThatFailsOnTheVulnerableProxyBy() public {
        fail(
            "A test that fails on the vulnerable proxy by showing the admin address changed after an implementation call"
        );
    }

    /// The same test passing against the ERC-1967-style proxy with the admin unchanged
    function test_criterion02_theSameTestPassingAgainstTheErc1967Style() public {
        fail("The same test passing against the ERC-1967-style proxy with the admin unchanged");
    }

    /// A test asserting the ERC-1967 admin slot value equals the specified keccak-minus-one
    /// derivation
    function test_criterion03_aTestAssertingTheErc1967AdminSlotValue() public {
        fail("A test asserting the ERC-1967 admin slot value equals the specified keccak-minus-one derivation");
    }

    /// A one-line comment explaining which property of DELEGATECALL created the collision
    function test_criterion04_aOneLineCommentExplainingWhichPropertyOfDelegatecall() public {
        fail("A one-line comment explaining which property of DELEGATECALL created the collision");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
