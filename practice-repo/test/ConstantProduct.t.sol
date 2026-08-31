// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-amm-math-build-cpmm  (implement, grain block, difficulty 2)
 * Run:      forge test --match-path test/ConstantProduct.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a two-token constant-product pool in Solidity with addLiquidity, removeLiquidity and
 *   swapExactIn. Charge a 30 basis point fee on the input amount before the invariant check.
 *   Mint LP shares proportional to the contributed value on the first deposit and proportional
 *   to the existing supply thereafter. Do not use any external library for the swap maths;
 *   derive the output formula yourself. Then write a Foundry invariant test with a handler that
 *   performs random deposits, withdrawals and swaps of bounded size, and a ghost accumulator
 *   tracking every fee charged. The invariant to assert is that reserve0 times reserve1 never
 *   decreases across any operation that is not a liquidity removal, and that the LP share price
 *   is non-decreasing.
 */
contract ConstantProductTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// An invariant run of at least 256 runs with depth 50 shows k non-decreasing across every swap
    function test_criterion01_anInvariantRunOfAtLeast256RunsWith() public {
        fail("An invariant run of at least 256 runs with depth 50 shows k non-decreasing across every swap");
    }

    /// A unit test reproduces a hand-computed output for a known input, reserves and fee, to the
    /// wei
    function test_criterion02_aUnitTestReproducesAHandComputedOutputFor() public {
        fail("A unit test reproduces a hand-computed output for a known input, reserves and fee, to the wei");
    }

    /// A test demonstrates that a swap of 10 percent of reserves pays a materially worse average
    /// price than ten swaps of 1 percent
    function test_criterion03_aTestDemonstratesThatASwapOf10Percent() public {
        fail("A test demonstrates that a swap of 10 percent of reserves pays a materially worse average price than ten swaps of 1 percent");
    }

    /// A test opens an LP position, moves the price by a factor of four through swaps, closes it,
    /// and asserts the withdrawn value is less than simply having held the two original amounts
    function test_criterion04_aTestOpensAnLpPositionMovesThePrice() public {
        fail("A test opens an LP position, moves the price by a factor of four through swaps, closes it, and asserts the withdrawn value is less than simply having held the two original amounts");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
