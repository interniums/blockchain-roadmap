// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-formal-verification-halmos-on-existing-tests  (implement, grain block, difficulty 3)
 * Run:      bash -c 'set -e; halmos --match-contract MathSpec --loop 4 | tee halmos.log; forge test --junit --match-path test/Counterexamples.t.sol'
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take an existing Foundry test suite for a fixed-point maths library. Convert its tests into
 *   symbolic checks - rename them to the tool's check prefix, replace every concrete literal
 *   with a symbolic parameter, and add the preconditions that make the original scenario a
 *   special case rather than the whole claim. Run the checker with an explicit loop bound. Find
 *   at least one input class the concrete tests never covered, reproduce the counterexample as
 *   an ordinary Foundry test so it is readable by someone who does not use the tool, and record
 *   the bound you ran under next to each result.
 */
contract CounterexamplesTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Every converted check has symbolic inputs and explicit preconditions rather than literals
    function test_criterion01_everyConvertedCheckHasSymbolicInputsAndExplicitPreconditions() public {
        fail("Every converted check has symbolic inputs and explicit preconditions rather than literals");
    }

    /// At least one counterexample is found that the original concrete suite passes on
    function test_criterion02_atLeastOneCounterexampleIsFoundThatTheOriginal() public {
        fail("At least one counterexample is found that the original concrete suite passes on");
    }

    /// Each counterexample is reproduced as a plain Foundry test that fails on the unfixed code
    function test_criterion03_eachCounterexampleIsReproducedAsAPlainFoundryTest() public {
        fail("Each counterexample is reproduced as a plain Foundry test that fails on the unfixed code");
    }

    /// Every result is recorded together with the loop bound it was obtained under
    function test_criterion04_everyResultIsRecordedTogetherWithTheLoopBound() public {
        fail("Every result is recorded together with the loop bound it was obtained under");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
