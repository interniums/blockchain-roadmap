// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-exploit-archaeology-reproduce-three  (break, grain block, difficulty 4)
 * Run:      forge test --junit --match-path 'test/poc/*.t.sol'
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build three runnable proof-of-concept tests in the style of the public exploit-reproduction
 *   corpora, each forking at the block immediately before its attack: one reentrancy-family
 *   exploit, one arithmetic exploit, and one access-control or configuration exploit. Each test
 *   must start from the real pre-attack state, execute the attack from a fresh attacker address,
 *   and assert that the attacker's balance increased. Alongside each test, write one paragraph
 *   naming the invariant that was false at the moment the balance increased - not the line that
 *   was wrong.
 */
contract Poc01Test is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Three passing tests, each forking at the block before its incident and asserting attacker
    /// profit
    function test_criterion01_threePassingTestsEachForkingAtTheBlockBefore() public {
        fail("Three passing tests, each forking at the block before its incident and asserting attacker profit");
    }

    /// The three come from three different vulnerability classes
    function test_criterion02_theThreeComeFromThreeDifferentVulnerabilityClasses() public {
        fail("The three come from three different vulnerability classes");
    }

    /// Each has a written invariant statement, expressed as a boolean over protocol state
    function test_criterion03_eachHasAWrittenInvariantStatementExpressedAsA() public {
        fail("Each has a written invariant statement, expressed as a boolean over protocol state");
    }

    /// Each test selects its own pinned fork block with vm.createSelectFork, so the suite
    /// reproduces offline from cache
    function test_criterion04_eachTestSelectsItsOwnPinnedForkBlockWith() public {
        fail("Each test selects its own pinned fork block with vm.createSelectFork, so the suite reproduces offline from cache");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
