// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-concentrated-liquidity-v3-is-v2-piecewise  (measure, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/V3Piecewise.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Concentrated liquidity is not a new market maker. Demonstrate that by rebuilding one out of
 *   the old one. Take a real concentrated-liquidity pool and read its current liquidity and its
 *   active range. Then implement a plain constant-product pool parameterised so that, within
 *   that range, it quotes the same prices. Compare quotes across ten trade sizes inside the
 *   range and report the difference — it should be at rounding level, and if it is not, find out
 *   why. Then cross a boundary. Take a trade large enough to exhaust the active range and show
 *   your single-curve model diverging from the real pool. Report where the divergence begins,
 *   and then extend your model to a piecewise one: two curves with a switch at the boundary.
 *   Show the divergence disappear. Finally state the claim precisely, in one paragraph: what is
 *   identical between the two designs and what is genuinely new. The new part is not the
 *   pricing.
 */
contract V3PiecewiseTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A real pool's current liquidity and active range are read
    function test_criterion01_aRealPoolSCurrentLiquidityAndActiveRange() public {
        fail("A real pool's current liquidity and active range are read");
    }

    /// A single constant-product curve is parameterised to match it within that range
    function test_criterion02_aSingleConstantProductCurveIsParameterisedToMatch() public {
        fail("A single constant-product curve is parameterised to match it within that range");
    }

    /// Quotes are compared across ten trade sizes inside the range with the difference reported at
    /// rounding level
    function test_criterion03_quotesAreComparedAcrossTenTradeSizesInsideThe() public {
        fail("Quotes are compared across ten trade sizes inside the range with the difference reported at rounding level");
    }

    /// A trade exhausting the active range shows the single-curve model diverging, with the
    /// divergence point reported
    function test_criterion04_aTradeExhaustingTheActiveRangeShowsTheSingle() public {
        fail("A trade exhausting the active range shows the single-curve model diverging, with the divergence point reported");
    }

    /// A piecewise model with a boundary switch removes the divergence
    function test_criterion05_aPiecewiseModelWithABoundarySwitchRemovesThe() public {
        fail("A piecewise model with a boundary switch removes the divergence");
    }

    /// One paragraph states what is identical between the designs and what is genuinely new
    function test_criterion06_oneParagraphStatesWhatIsIdenticalBetweenTheDesigns() public {
        fail("One paragraph states what is identical between the designs and what is genuinely new");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
