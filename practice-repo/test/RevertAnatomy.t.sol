// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-errors-events-revert-data-anatomy  (measure, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/RevertAnatomy.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build four contracts identical except for the failure path: require(cond) with no message,
 *   require(cond, "Insufficient balance for this transfer"), revert InsufficientBalance(a, b),
 *   and require(cond, InsufficientBalance(a, b)). For each, capture the exact revert data
 *   returned by a low-level call and record its byte length, plus deployed bytecode size from
 *   forge build --sizes and happy-path and revert-path gas, with and without --via-ir. Assert
 *   the selector of your custom error by hand and confirm it equals the first four bytes of the
 *   captured data.
 */
contract RevertAnatomyTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the bare require returns exactly zero bytes of revert data
    function test_criterion01_aTestAssertsTheBareRequireReturnsExactlyZero() public {
        fail("A test asserts the bare require returns exactly zero bytes of revert data");
    }

    /// A test asserts the first four bytes of the custom-error revert data equal the hand-computed
    /// keccak256 of the canonical signature
    function test_criterion02_aTestAssertsTheFirstFourBytesOfThe() public {
        fail("A test asserts the first four bytes of the custom-error revert data equal the hand-computed keccak256 of the canonical signature");
    }

    /// Recorded deploy size and gas numbers state the solc version, optimizer setting and whether
    /// via-IR was used
    function test_criterion03_recordedDeploySizeAndGasNumbersStateTheSolc() public {
        fail("Recorded deploy size and gas numbers state the solc version, optimizer setting and whether via-IR was used");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
