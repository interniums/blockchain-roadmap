// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-ci-four-job-pipeline  (implement, difficulty 4)
 * Exercised by: test/CiContract.t.sol
 * Run:      forge test --junit --match-path test/CiContract.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The baseline Foundry job — Checkout with submodules, install a pinned toolchain, build,
 *     test — on pushes to the default branch and on pull requests.
 *   - Checkout must recurse submodules — Forge dependencies are git submodules, so a checkout
 *     without submodules fails at compile time with confusing missing-import errors.
 *   - Cheap deterministic gates go first — forge fmt --check and forge lint --deny warnings
 *     are seconds long and never flaky, so they belong before the expensive job.
 *   - Pin the toolchain in CI — The toolchain action defaults to a channel, not a build, so
 *     "latest" makes CI a pipeline that changes without a commit.
 *   - Actions are code with access to your secrets — A third-party action runs arbitrary code
 *     in the job that holds your secrets, and a version tag is mutable — only a commit SHA is
 *     a pin.
 */
contract CiContract {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
