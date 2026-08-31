// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-gas-fee-market-access-list-breakeven  (measure, grain block, difficulty 3)
 * Run:      forge test -vv --junit --match-path test/AccessListBreakeven.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a call path that touches several external contracts and several storage slots. Send it
 *   on anvil three ways: as a type-0 transaction, as a type-1 transaction with an access list
 *   containing exactly the items the call touches, and as a type-1 transaction with an access
 *   list that over-declares — listing items the call never touches. Record total gas used for
 *   each. Then vary the number of correctly declared entries and find the break-even point at
 *   which the up-front charge is repaid by warm pricing. Report the crossover as a number of
 *   entries, with the reasoning.
 */
contract AccessListBreakevenTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Three measured totals for the three transaction shapes, from the learner's own run
    function test_criterion01_threeMeasuredTotalsForTheThreeTransactionShapesFrom() public {
        fail("Three measured totals for the three transaction shapes, from the learner's own run");
    }

    /// The over-declared list demonstrably costs more than no list at all
    function test_criterion02_theOverDeclaredListDemonstrablyCostsMoreThanNo() public {
        fail("The over-declared list demonstrably costs more than no list at all");
    }

    /// A stated break-even entry count with the arithmetic that produces it from the measured
    /// per-entry and cold/warm figures
    function test_criterion03_aStatedBreakEvenEntryCountWithTheArithmetic() public {
        fail("A stated break-even entry count with the arithmetic that produces it from the measured per-entry and cold/warm figures");
    }

    /// A one-sentence rule for when a caller should attach an access list in production
    function test_criterion04_aOneSentenceRuleForWhenACallerShould() public {
        fail("A one-sentence rule for when a caller should attach an access list in production");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
