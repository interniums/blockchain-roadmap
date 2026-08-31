// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-hooks-malicious-hook  (break, grain module, difficulty 5)
 * Run:      forge test --match-path test/MaliciousHook.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a Uniswap v4 hook that looks ordinary and extracts value from swappers. Mine a CREATE2
 *   salt so the deployed address carries the permission bits for the callbacks you need. In the
 *   swap callbacks, take a share of the swap beyond the pool's advertised fee, and route it to
 *   an address you control. Make the extraction conditional so that a naive static simulation
 *   from a fresh address does not reveal it — for example, exempt the first caller, or behave
 *   differently for a caller with no prior interaction. Then write, as a document in the
 *   repository, the checklist a user or router would have to run to detect this class of hook
 *   before trading, and honestly mark which of your checks your own hook would defeat.
 */
contract MaliciousHookTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test shows a swapper receiving materially less output on the hooked pool than on an
    /// identical unhooked pool, with the difference landing at the attacker address
    function test_criterion01_aTestShowsASwapperReceivingMateriallyLessOutput() public {
        fail("A test shows a swapper receiving materially less output on the hooked pool than on an identical unhooked pool, with the difference landing at the attacker address");
    }

    /// A test asserts the hook's deployed address carries exactly the permission bits for the
    /// callbacks it uses, and that changing the salt breaks deployment
    function test_criterion02_aTestAssertsTheHookSDeployedAddressCarries() public {
        fail("A test asserts the hook's deployed address carries exactly the permission bits for the callbacks it uses, and that changing the salt breaks deployment");
    }

    /// A test demonstrates the conditional behaviour — the same call returns a benign result under
    /// one condition and an extractive one under another
    function test_criterion03_aTestDemonstratesTheConditionalBehaviourTheSameCall() public {
        fail(unicode"A test demonstrates the conditional behaviour — the same call returns a benign result under one condition and an extractive one under another");
    }

    /// The repository contains a checklist naming at least five concrete checks, with the ones this
    /// hook defeats marked as such
    function test_criterion04_theRepositoryContainsAChecklistNamingAtLeastFive() public {
        fail("The repository contains a checklist naming at least five concrete checks, with the ones this hook defeats marked as such");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
