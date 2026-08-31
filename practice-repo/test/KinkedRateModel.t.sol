// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-lending-kinked-rate-model  (implement, grain block, difficulty 3)
 * Run:      forge test --match-path test/KinkedRateModel.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement a KinkedRateModel contract with configurable base rate, slope1, slope2, optimal
 *   utilisation and reserve factor, exposing borrowRate(U) and supplyRate(U). Use ray or wad
 *   fixed point throughout and document your unit convention at the top of the file. Then write
 *   a Foundry fuzz suite that establishes the model's properties rather than spot-checking
 *   values: monotonicity of the borrow rate in utilisation, continuity at the kink, and the
 *   relationship between supply and borrow rates. Finally add a test that instantiates the
 *   parameters of a real Aave v3 reserve and reproduces its published borrow and supply rates at
 *   that reserve's current utilisation.
 */
contract KinkedRateModelTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A fuzz test over U in [0, 1e18] and reserveFactor in [0, 1e4] proves supplyRate is always
    /// less than or equal to borrowRate
    function test_criterion01_aFuzzTestOverUIn01e18And() public {
        fail("A fuzz test over U in [0, 1e18] and reserveFactor in [0, 1e4] proves supplyRate is always less than or equal to borrowRate");
    }

    /// A fuzz test proves borrowRate is monotonically non-decreasing in U
    function test_criterion02_aFuzzTestProvesBorrowrateIsMonotonicallyNonDecreasing() public {
        fail("A fuzz test proves borrowRate is monotonically non-decreasing in U");
    }

    /// A test proves the function is continuous at the kink, with the left and right limits
    /// differing by at most one unit of last place
    function test_criterion03_aTestProvesTheFunctionIsContinuousAtThe() public {
        fail("A test proves the function is continuous at the kink, with the left and right limits differing by at most one unit of last place");
    }

    /// A test using a real reserve's parameters reproduces its published borrow and supply APY to
    /// within one basis point
    function test_criterion04_aTestUsingARealReserveSParametersReproduces() public {
        fail("A test using a real reserve's parameters reproduces its published borrow and supply APY to within one basis point");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
