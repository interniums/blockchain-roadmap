// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-foundry-basics-config-waterfall  (measure, difficulty 3)
 * Exercised by: test/ConfigLayers.t.sol
 * Run:      forge test --junit --match-path test/ConfigLayers.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Config precedence — Built-in defaults, then foundry.toml, then FOUNDRY_/DAPP_
 *     environment variables — environment wins.
 *   - Profiles and inheritance — Every setting lives under a profile; non-default profiles
 *     inherit `[profile.default]` and are selected with FOUNDRY_PROFILE.
 *   - What profiles are actually for — Cheap and fast locally, thorough and slow in CI — the
 *     same repository, two effort levels.
 *   - Inline config comments are profile-scoped — `/// forge-config: default.fuzz.runs =
 *     10000` above a function applies to the default profile only — and does nothing under
 *     FOUNDRY_PROFILE=ci.
 */
contract ConfigLayers {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
