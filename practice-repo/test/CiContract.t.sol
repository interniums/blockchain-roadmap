// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {CiContract} from "../src/toolchain-ci/CiContract.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-ci-four-job-pipeline  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/CiContract.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a `.github/workflows/ci.yml` with four jobs: format and lint, build and test, gas
 *   snapshot, and coverage. Make the cheap jobs gate the expensive ones so a pull request with a
 *   formatting error fails in under a minute without compiling the test suite. Check out with
 *   submodules, install an exact pinned Foundry version rather than a channel, and pin every
 *   third-party action to a full commit SHA. Then encode those properties as assertions: write a
 *   Solidity test that reads the workflow file and foundry.toml with `vm.readFile` and asserts
 *   them, so the pipeline's own invariants are covered by the same harness as everything else.
 *   You will need `fs_permissions` entries for both files.
 */
contract CiContractTest is Test {
    /// The subject, from src/toolchain-ci/CiContract.sol. Add functions there and call them here.
    CiContract internal subject;

    function setUp() public {
        subject = new CiContract();
    }

    /// A test asserts the workflow contains no action reference pinned by a moving tag, only
    /// forty-character commit SHAs
    function test_criterion01_aTestAssertsTheWorkflowContainsNoActionReference() public {
        fail(
            "A test asserts the workflow contains no action reference pinned by a moving tag, only forty-character commit SHAs"
        );
    }

    /// A test asserts the Foundry install step names an exact version string rather than a channel
    /// name
    function test_criterion02_aTestAssertsTheFoundryInstallStepNamesAn() public {
        fail("A test asserts the Foundry install step names an exact version string rather than a channel name");
    }

    /// A test asserts the checkout step requests submodules and that foundry.toml defines a ci
    /// profile
    function test_criterion03_aTestAssertsTheCheckoutStepRequestsSubmodulesAnd() public {
        fail("A test asserts the checkout step requests submodules and that foundry.toml defines a ci profile");
    }

    /// The workflow is demonstrated failing in under sixty seconds on a formatting-only error,
    /// without the test job having run
    function test_criterion04_theWorkflowIsDemonstratedFailingInUnderSixtySeconds() public {
        fail(
            "The workflow is demonstrated failing in under sixty seconds on a formatting-only error, without the test job having run"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
