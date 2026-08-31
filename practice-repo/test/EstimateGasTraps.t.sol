// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {EstimateGasTraps} from "../src/app-error-surfaces/EstimateGasTraps.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-exact-estimate-fails  (break, grain module, difficulty 4)
 * Run:      forge test --match-path test/EstimateGasTraps.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a contract with several nested calls where an inner frame branches on `gasleft()`.
 *   Estimate its gas, send it with exactly the estimated limit, and show it failing. Explain the
 *   failure via the 63/64 rule, then find the headroom multiplier that makes it pass reliably.
 *   Separately, demonstrate the non-monotonicity: find a gas limit at which the call succeeds
 *   and a larger one at which it does not, and show what the estimator returns for it.
 */
contract EstimateGasTrapsTest is Test {
    /// The subject, from src/app-error-surfaces/EstimateGasTraps.sol. Add functions there and call them here.
    EstimateGasTraps internal subject;

    function setUp() public {
        subject = new EstimateGasTraps();
    }

    /// A test sends with exactly the estimated limit and asserts an out-of-gas failure inside a
    /// nested frame
    function test_criterion01_aTestSendsWithExactlyTheEstimatedLimitAnd() public {
        fail("A test sends with exactly the estimated limit and asserts an out-of-gas failure inside a nested frame");
    }

    /// A test finds and asserts a pair of limits where the smaller succeeds and the larger fails
    function test_criterion02_aTestFindsAndAssertsAPairOfLimits() public {
        fail("A test finds and asserts a pair of limits where the smaller succeeds and the larger fails");
    }

    /// The headroom multiplier that makes the first case pass is recorded, with a comment
    /// explaining why it is a compensation for a documented rule rather than superstition
    function test_criterion03_theHeadroomMultiplierThatMakesTheFirstCasePass() public {
        fail(
            "The headroom multiplier that makes the first case pass is recorded, with a comment explaining why it is a compensation for a documented rule rather than superstition"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
