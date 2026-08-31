// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-foundry-basics-config-waterfall  (measure, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ConfigLayers.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   In a fresh `forge init` project, make the number of fuzz runs observable from inside a test:
 *   add `test/ConfigLayers.t.sol` with a storage counter that a fuzzed function increments, plus
 *   a plain test that reads the counter and asserts it equals `vm.envOr("EXPECTED_RUNS",
 *   uint256(256))`. Because forge runs test functions in declaration order within a contract,
 *   the fuzzed function must be declared before the asserting one. Then add a `[profile.ci]` to
 *   foundry.toml setting a different `fuzz.runs`, and run the suite three ways: bare, with
 *   FOUNDRY_PROFILE=ci, and with FOUNDRY_FUZZ_RUNS set in the shell on top of the ci profile.
 *   Record which layer supplied the value each time, and confirm against `forge config`. Finally
 *   add a `/// forge-config: default.fuzz.runs = N` comment above the fuzzed function and show
 *   it has no effect under the ci profile.
 */
contract ConfigLayersTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The counter test passes with EXPECTED_RUNS unset, confirming the built-in default of 256
    function test_criterion01_theCounterTestPassesWithExpectedRunsUnsetConfirming() public {
        fail("The counter test passes with EXPECTED_RUNS unset, confirming the built-in default of 256");
    }

    /// The same test passes with FOUNDRY_PROFILE=ci and EXPECTED_RUNS set to the ci profile's value
    function test_criterion02_theSameTestPassesWithFoundryProfileCiAnd() public {
        fail("The same test passes with FOUNDRY_PROFILE=ci and EXPECTED_RUNS set to the ci profile's value");
    }

    /// The same test passes with FOUNDRY_PROFILE=ci, FOUNDRY_FUZZ_RUNS and EXPECTED_RUNS both set
    /// to a third value, proving the environment variable beat the file
    function test_criterion03_theSameTestPassesWithFoundryProfileCiFoundry() public {
        fail("The same test passes with FOUNDRY_PROFILE=ci, FOUNDRY_FUZZ_RUNS and EXPECTED_RUNS both set to a third value, proving the environment variable beat the file");
    }

    /// An inline forge-config comment naming the default profile is shown to change nothing under
    /// FOUNDRY_PROFILE=ci
    function test_criterion04_anInlineForgeConfigCommentNamingTheDefaultProfile() public {
        fail("An inline forge-config comment naming the default profile is shown to change nothing under FOUNDRY_PROFILE=ci");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
