// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-fuzzing-differential-math  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/DifferentialMath.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write your own fixed-point helpers - a full-precision mulDiv, a square root, and one of exp
 *   or log - then build an assertion-mode differential harness comparing each against an
 *   established library implementation over the same symbolic inputs. Where the two disagree,
 *   decide which is right and write down why; where you believe they cannot disagree, write the
 *   argument. Add round-trip properties on the pairs that have inverses. The deliverable is
 *   either at least one genuine disagreement, or a written argument for equivalence precise
 *   enough that someone could attack it.
 */
contract DifferentialMathTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Each of your implementations is compared against a named reference over the same fuzzed
    /// inputs
    function test_criterion01_eachOfYourImplementationsIsComparedAgainstANamed() public {
        fail("Each of your implementations is compared against a named reference over the same fuzzed inputs");
    }

    /// At least one disagreement is found and adjudicated, or an explicit equivalence argument is
    /// written for each pair
    function test_criterion02_atLeastOneDisagreementIsFoundAndAdjudicatedOr() public {
        fail("At least one disagreement is found and adjudicated, or an explicit equivalence argument is written for each pair");
    }

    /// Round-trip properties are present for every operation that has an inverse
    function test_criterion03_roundTripPropertiesArePresentForEveryOperationThat() public {
        fail("Round-trip properties are present for every operation that has an inverse");
    }

    /// Edge inputs - zero, one, the maximum value, and the value just below an overflow - are
    /// exercised rather than left to chance
    function test_criterion04_edgeInputsZeroOneTheMaximumValueAndThe() public {
        fail("Edge inputs - zero, one, the maximum value, and the value just below an overflow - are exercised rather than left to chance");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
