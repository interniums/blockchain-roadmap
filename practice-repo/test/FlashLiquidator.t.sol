// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {FlashLiquidator} from "../src/defi-liquidations/FlashLiquidator.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-flash-loan-liquidator  (implement, grain module, difficulty 5)
 * Run:      forge test --match-path test/FlashLiquidator.t.sol --fork-url $ETH_RPC_URL -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On a mainnet fork, write a liquidator contract that in a single transaction flash-borrows
 *   the debt asset, calls a lending protocol's liquidation function on an eligible position,
 *   receives the discounted collateral, swaps it back to the debt asset on a DEX, repays the
 *   flash loan with its fee, and keeps the remainder. Drive a real position under water by
 *   manipulating the fork's oracle answer rather than waiting for one. Then re-run the same
 *   liquidation with progressively worse exit execution and with progressively higher gas
 *   prices, and record the point at which the trade turns negative for a given position size.
 */
contract FlashLiquidatorTest is Test {
    /// The subject, from src/defi-liquidations/FlashLiquidator.sol. Add functions there and call them here.
    FlashLiquidator internal subject;

    function setUp() public {
        subject = new FlashLiquidator();
    }

    /// The successful test ends with a strictly positive balance of the debt asset at the
    /// liquidator and the borrower's health factor restored above one
    function test_criterion01_theSuccessfulTestEndsWithAStrictlyPositiveBalance() public {
        fail(
            "The successful test ends with a strictly positive balance of the debt asset at the liquidator and the borrower's health factor restored above one"
        );
    }

    /// Re-running with roughly three percent of injected exit slippage makes the same liquidation
    /// net-negative, and the test asserts the revert or the loss
    function test_criterion02_reRunningWithRoughlyThreePercentOfInjectedExit() public {
        fail(
            "Re-running with roughly three percent of injected exit slippage makes the same liquidation net-negative, and the test asserts the revert or the loss"
        );
    }

    /// A sweep over position size at fixed gas and incentive reports the minimum profitable
    /// position size
    function test_criterion03_aSweepOverPositionSizeAtFixedGasAnd() public {
        fail("A sweep over position size at fixed gas and incentive reports the minimum profitable position size");
    }

    /// The test suite reports the dust threshold below which no liquidation of that position is
    /// profitable
    function test_criterion04_theTestSuiteReportsTheDustThresholdBelowWhich() public {
        fail("The test suite reports the dust threshold below which no liquidation of that position is profitable");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
