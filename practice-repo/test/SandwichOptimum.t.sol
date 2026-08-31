// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {SandwichOptimum} from "../src/defi-mev/SandwichOptimum.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-mev-sandwich-optimum  (measure, grain block, difficulty 3)
 * Run:      forge test --match-path test/SandwichOptimum.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a sandwich simulator against a constant-product pool. Given reserves, fee, a victim
 *   swap size and the victim's minimum-output bound, compute the attacker's profit as a function
 *   of frontrun size, find the optimum, and identify the frontrun size at which the victim's
 *   transaction would revert. Then sweep the victim's slippage tolerance from tight to wide and
 *   plot attacker profit against it. Report the tolerance at which sandwiching stops being
 *   profitable for a given victim size, and separately report what happens as the victim's own
 *   price impact approaches the tolerance.
 */
contract SandwichOptimumTest is Test {
    /// The subject, from src/defi-mev/SandwichOptimum.sol. Add functions there and call them here.
    SandwichOptimum internal subject;

    function setUp() public {
        subject = new SandwichOptimum();
    }

    /// A test asserts the computed optimal frontrun size is a genuine maximum by checking profit is
    /// lower on both sides of it
    function test_criterion01_aTestAssertsTheComputedOptimalFrontrunSizeIs() public {
        fail(
            "A test asserts the computed optimal frontrun size is a genuine maximum by checking profit is lower on both sides of it"
        );
    }

    /// A test asserts attacker profit goes to zero as the victim's slippage tolerance approaches
    /// the victim's own price impact
    function test_criterion02_aTestAssertsAttackerProfitGoesToZeroAs() public {
        fail(
            "A test asserts attacker profit goes to zero as the victim's slippage tolerance approaches the victim's own price impact"
        );
    }

    /// A test asserts that at the optimum the victim's realised output is above their stated
    /// minimum, so the bundle does not revert
    function test_criterion03_aTestAssertsThatAtTheOptimumTheVictim() public {
        fail(
            "A test asserts that at the optimum the victim's realised output is above their stated minimum, so the bundle does not revert"
        );
    }

    /// A sweep reports the profit curve over at least ten tolerance values, and gas cost is
    /// included so the profitability threshold is a real number
    function test_criterion04_aSweepReportsTheProfitCurveOverAtLeast() public {
        fail(
            "A sweep reports the profit curve over at least ten tolerance values, and gas cost is included so the profitability threshold is a real number"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
