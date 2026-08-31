// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-accounts-delegate-takeover  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/DelegateTakeover.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a delegate contract with a single function that forwards arbitrary calldata to an
 *   arbitrary target with no access control at all — the naive "batching" delegate people write
 *   first. In a Foundry test, fund an anvil EOA, sign an EIP-7702 authorization for that
 *   delegate with `vm.signAndAttachDelegation` (or `vm.signDelegation` plus
 *   `vm.attachDelegation`), and confirm the account's code is now the 23-byte designator. Then,
 *   from a completely unrelated attacker address, call the delegated EOA and drain its entire
 *   balance. Finally write a second delegate that resists the same attack by requiring that the
 *   caller is the account itself, and prove the drain now reverts.
 */
contract DelegateTakeoverTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the delegated account's code is exactly 23 bytes and begins with 0xef0100
    /// followed by the delegate address
    function test_criterion01_aTestAssertsTheDelegatedAccountSCodeIs() public {
        fail("A test asserts the delegated account's code is exactly 23 bytes and begins with 0xef0100 followed by the delegate address");
    }

    /// A test proves an unrelated third-party address can move the delegated account's entire ETH
    /// balance
    function test_criterion02_aTestProvesAnUnrelatedThirdPartyAddressCan() public {
        fail("A test proves an unrelated third-party address can move the delegated account's entire ETH balance");
    }

    /// A second test proves the hardened delegate reverts on the identical attacker call
    function test_criterion03_aSecondTestProvesTheHardenedDelegateRevertsOn() public {
        fail("A second test proves the hardened delegate reverts on the identical attacker call");
    }

    /// The test file contains a comment naming which property the naive delegate failed to enforce
    function test_criterion04_theTestFileContainsACommentNamingWhichProperty() public {
        fail("The test file contains a comment naming which property the naive delegate failed to enforce");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
