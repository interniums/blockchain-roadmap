// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-hardhat-literacy-same-test-twice  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/CrossToolchain.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a small Foundry project and add a Hardhat 3 setup alongside it that compiles the same
 *   contracts, without duplicating the sources. Configure Hardhat to read from the existing
 *   directory and make its dependency resolution find the same OpenZeppelin version that the
 *   Foundry remappings resolve to. Then write the same test twice: once as a Foundry `.t.sol`
 *   test and once as a Hardhat TypeScript test. Finally, deliberately create the divergence:
 *   install a second OpenZeppelin version under node_modules while leaving the submodule in lib/
 *   untouched, and demonstrate that the same import string now resolves to different files in
 *   the two toolchains. Produce a translation table mapping every top-level directory and config
 *   key to its counterpart.
 */
contract CrossToolchainTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The Foundry test passes against src/ with the project's existing remappings
    function test_criterion01_theFoundryTestPassesAgainstSrcWithTheProject() public {
        fail("The Foundry test passes against src/ with the project's existing remappings");
    }

    /// The Hardhat test command passes against the same sources, and the command used is recorded
    /// in the repository README
    function test_criterion02_theHardhatTestCommandPassesAgainstTheSameSources() public {
        fail("The Hardhat test command passes against the same sources, and the command used is recorded in the repository README");
    }

    /// A test asserts on a version- or behaviour-distinguishing constant from the dependency, and
    /// the learner shows the two toolchains disagreeing once the versions diverge
    function test_criterion03_aTestAssertsOnAVersionOrBehaviourDistinguishing() public {
        fail("A test asserts on a version- or behaviour-distinguishing constant from the dependency, and the learner shows the two toolchains disagreeing once the versions diverge");
    }

    /// A translation table covers sources, artifacts, tests, deployments, dependencies and import
    /// resolution
    function test_criterion04_aTranslationTableCoversSourcesArtifactsTestsDeploymentsDependencies() public {
        fail("A translation table covers sources, artifacts, tests, deployments, dependencies and import resolution");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
