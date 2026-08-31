// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-amm-math-capstone-derive-the-curve  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/AmmMath.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement a constant-product pool from the invariant up, then use it to produce every figure
 *   a trader and a liquidity provider experience — each derived rather than looked up. THE
 *   CURVE. Implement swap, add and remove against the invariant. A test asserts the invariant
 *   holds or grows across every operation, never shrinks, including with fees. PRICE IMPACT.
 *   Quote the same trade at four sizes spanning three orders of magnitude, and plot execution
 *   price against size. Derive the closed form for price impact from the invariant and assert
 *   your implementation matches it to a stated tolerance. Then answer, with a number: at what
 *   fraction of the reserves does a trade lose more to impact than to fees? SLIPPAGE IS A
 *   BUDGET. Set a slippage tolerance and show a trade filling at a worse price than quoted but
 *   inside tolerance. Then show what a 50% tolerance permits, and state in one sentence what a
 *   slippage parameter actually is from an attacker's point of view. WHAT AN LP LOSES. Compute
 *   impermanent loss for a price move you choose, and separate it into the two components:
 *   divergence from holding, and fees earned. Show the break-even price move at which the fees
 *   cover the divergence. Then say in one sentence why "impermanent" is the wrong word. A
 *   FLATTER CURVE. Implement the stableswap invariant and compare it against constant product on
 *   the same trade near parity and far from it. Show the amplification parameter moving where
 *   the curve stops behaving like a stablecoin curve, with the number at which it flips. THE
 *   UNCOLLATERALISED LOAN. Take a flash loan, use it to move your own pool's price, and show the
 *   quote another contract reads mid-transaction. Then state what that means for anyone treating
 *   a pool reserve as a price.
 */
contract AmmMathTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The invariant is asserted never to shrink across swaps, adds and removes, including with
    /// fees
    function test_criterion01_theInvariantIsAssertedNeverToShrinkAcrossSwaps() public {
        fail("The invariant is asserted never to shrink across swaps, adds and removes, including with fees");
    }

    /// Execution price is plotted against trade size over three orders of magnitude
    function test_criterion02_executionPriceIsPlottedAgainstTradeSizeOverThree() public {
        fail("Execution price is plotted against trade size over three orders of magnitude");
    }

    /// A closed-form price-impact derivation is stated and matched by the implementation to a
    /// stated tolerance
    function test_criterion03_aClosedFormPriceImpactDerivationIsStatedAnd() public {
        fail("A closed-form price-impact derivation is stated and matched by the implementation to a stated tolerance");
    }

    /// The reserve fraction at which impact exceeds fees is given as a number
    function test_criterion04_theReserveFractionAtWhichImpactExceedsFeesIs() public {
        fail("The reserve fraction at which impact exceeds fees is given as a number");
    }

    /// A trade fills worse than quoted but within tolerance, and what a 50% tolerance permits is
    /// shown
    function test_criterion05_aTradeFillsWorseThanQuotedButWithinTolerance() public {
        fail("A trade fills worse than quoted but within tolerance, and what a 50% tolerance permits is shown");
    }

    /// Impermanent loss is split into divergence and fees, with the break-even price move computed
    function test_criterion06_impermanentLossIsSplitIntoDivergenceAndFeesWith() public {
        fail("Impermanent loss is split into divergence and fees, with the break-even price move computed");
    }

    /// One sentence explains why "impermanent" is the wrong word
    function test_criterion07_oneSentenceExplainsWhyImpermanentIsTheWrongWord() public {
        fail("One sentence explains why \"impermanent\" is the wrong word");
    }

    /// Stableswap and constant product are compared near and far from parity, with the
    /// amplification value where behaviour flips
    function test_criterion08_stableswapAndConstantProductAreComparedNearAndFar() public {
        fail("Stableswap and constant product are compared near and far from parity, with the amplification value where behaviour flips");
    }

    /// A flash loan moves the pool price and another contract's mid-transaction quote is shown
    function test_criterion09_aFlashLoanMovesThePoolPriceAndAnother() public {
        fail("A flash loan moves the pool price and another contract's mid-transaction quote is shown");
    }

    /// The consequence for treating a reserve as a price is stated
    function test_criterion10_theConsequenceForTreatingAReserveAsAPrice() public {
        fail("The consequence for treating a reserve as a price is stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
