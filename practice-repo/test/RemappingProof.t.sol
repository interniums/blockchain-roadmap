// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-foundry-basics-break-remappings  (break, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/RemappingProof.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Start from a project that imports OpenZeppelin through the usual
 *   `@openzeppelin/contracts/...` path and compiles. Record the output of `forge remappings`.
 *   Now set `auto_detect_remappings = false` in foundry.toml and remove any `remappings` key and
 *   remappings.txt, then rebuild and read the failure carefully — it names the Solidity import,
 *   not the configuration that stopped resolving it. Repair it by writing the single minimal
 *   explicit remapping in foundry.toml, not by re-enabling auto-detection. Keep a test that
 *   imports and uses the dependency, so a green suite proves resolution actually works rather
 *   than that nothing referenced it.
 */
contract RemappingProofTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The suite fails to compile with auto-detection off and no explicit remapping, and the
    /// learner can point at the line of foundry.toml responsible
    function test_criterion01_theSuiteFailsToCompileWithAutoDetectionOff() public {
        fail("The suite fails to compile with auto-detection off and no explicit remapping, and the learner can point at the line of foundry.toml responsible");
    }

    /// The suite compiles and passes with exactly one explicit remapping added and auto-detection
    /// still off
    function test_criterion02_theSuiteCompilesAndPassesWithExactlyOneExplicit() public {
        fail("The suite compiles and passes with exactly one explicit remapping added and auto-detection still off");
    }

    /// `forge remappings` output before and after is captured, and the learner can explain which of
    /// the three sources supplied each entry
    function test_criterion03_outputBeforeAndAfterIsCapturedAndTheLearner() public {
        fail("`forge remappings` output before and after is captured, and the learner can explain which of the three sources supplied each entry");
    }

    /// The test does something with an imported OpenZeppelin symbol, so the import is load-bearing
    function test_criterion04_theTestDoesSomethingWithAnImportedOpenzeppelinSymbol() public {
        fail("The test does something with an imported OpenZeppelin symbol, so the import is load-bearing");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
