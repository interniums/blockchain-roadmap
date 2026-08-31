// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {SafeMintReentrancy} from "../src/solidity-token-standards/SafeMintReentrancy.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-safemint-reentrancy-cap  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/SafeMintReentrancy.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write an ERC-721 with a per-wallet mint cap enforced by require(minted[msg.sender] < CAP),
 *   where the counter is incremented after _safeMint. Write an attacker contract whose
 *   onERC721Received calls mint again. Prove the attacker ends up holding more tokens than the
 *   cap allows. Then fix it twice, independently: once by moving the counter increment before
 *   the mint, and once by adding a reentrancy guard, and prove each fix alone reduces the
 *   attacker to exactly the cap.
 */
contract SafeMintReentrancyTest is Test {
    /// The subject, from src/solidity-token-standards/SafeMintReentrancy.sol. Add functions there and call them here.
    SafeMintReentrancy internal subject;

    function setUp() public {
        subject = new SafeMintReentrancy();
    }

    /// A test asserts balanceOf(attacker) is strictly greater than CAP against the vulnerable
    /// contract
    function test_criterion01_aTestAssertsBalanceofAttackerIsStrictlyGreaterThan() public {
        fail("A test asserts balanceOf(attacker) is strictly greater than CAP against the vulnerable contract");
    }

    /// A test asserts balanceOf(attacker) equals CAP against the CEI-ordered contract with no guard
    function test_criterion02_aTestAssertsBalanceofAttackerEqualsCapAgainstThe() public {
        fail("A test asserts balanceOf(attacker) equals CAP against the CEI-ordered contract with no guard");
    }

    /// A separate test asserts the same against the guarded contract with the original ordering
    /// restored
    function test_criterion03_aSeparateTestAssertsTheSameAgainstTheGuarded() public {
        fail("A separate test asserts the same against the guarded contract with the original ordering restored");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
