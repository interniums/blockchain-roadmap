// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-oracles-there-is-no-price  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Oracles.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   There is no price on a blockchain, only reports about prices. Get four of them and show what
 *   happens when you trust the wrong one. FOUR SOURCES. For one asset, obtain a price from: a
 *   push feed, a pool's spot reserves, a time-weighted pool average, and one off-chain
 *   reference. Report all four at the same block and the spread between them. State which you
 *   would use and for what — the answer differs by use, and giving one answer is wrong. THE
 *   DRAIN. Build a contract that reads a pool's spot price and lends against it. Take a flash
 *   loan, move the pool, borrow against the moved price, and repay. Report the profit. Then fix
 *   it and show the same attack failing — and state what your fix costs in responsiveness,
 *   because every fix here trades freshness for robustness. THE ACCIDENTAL ORACLE. Find a
 *   protocol function that is not called an oracle and is one: an LP token valuation or an
 *   exchange-rate getter that another contract reads as truth. Show that manipulating it moves a
 *   number a third party depends on. Name what makes a function an oracle regardless of its
 *   name. THE BLOCK AFTER. Then the value nobody budgeted for: for one real price update,
 *   examine the block immediately after and identify what was extracted from knowing the new
 *   price before the protocols reacted. State who captured it and who could have.
 */
contract OraclesTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Four prices for one asset are obtained at the same block with the spread reported
    function test_criterion01_fourPricesForOneAssetAreObtainedAtThe() public {
        fail("Four prices for one asset are obtained at the same block with the spread reported");
    }

    /// A recommendation per use case is given rather than a single answer
    function test_criterion02_aRecommendationPerUseCaseIsGivenRatherThan() public {
        fail("A recommendation per use case is given rather than a single answer");
    }

    /// A spot-price-reading contract is drained via a flash loan with the profit reported
    function test_criterion03_aSpotPriceReadingContractIsDrainedViaA() public {
        fail("A spot-price-reading contract is drained via a flash loan with the profit reported");
    }

    /// The fix defeats the same attack, with its cost in responsiveness stated
    function test_criterion04_theFixDefeatsTheSameAttackWithItsCost() public {
        fail("The fix defeats the same attack, with its cost in responsiveness stated");
    }

    /// A protocol function that is an oracle without being called one is identified and shown
    /// manipulable, affecting a third party
    function test_criterion05_aProtocolFunctionThatIsAnOracleWithoutBeing() public {
        fail("A protocol function that is an oracle without being called one is identified and shown manipulable, affecting a third party");
    }

    /// What makes a function an oracle regardless of its name is stated
    function test_criterion06_whatMakesAFunctionAnOracleRegardlessOfIts() public {
        fail("What makes a function an oracle regardless of its name is stated");
    }

    /// The block after a real price update is examined with the extracted value identified and the
    /// capturing and potential parties named
    function test_criterion07_theBlockAfterARealPriceUpdateIsExamined() public {
        fail("The block after a real price update is examined with the extracted value identified and the capturing and potential parties named");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
