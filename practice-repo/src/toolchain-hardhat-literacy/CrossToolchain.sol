// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-hardhat-literacy-same-test-twice  (implement, difficulty 4)
 * Exercised by: test/CrossToolchain.t.sol
 * Run:      forge test --junit --match-path test/CrossToolchain.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Two toolchains, one Solidity — Foundry is Solidity-native and CLI-first; Hardhat is a
 *     TypeScript program that orchestrates compilation, testing and deployment.
 *   - Translating the layout — contracts/ is src/, artifacts/ plus cache/ are out/, test/*.ts
 *     is test/*.t.sol, ignition/modules/ is script/, node_modules is lib/.
 *   - Two resolvers, one import string — Foundry resolves imports through remappings; Hardhat
 *     resolves them through Node module resolution — the same string can mean different files.
 *   - Running both, on purpose — Foundry for unit, fuzz and invariant testing; Hardhat for
 *     TypeScript integration tests, deployment plugins and ecosystem tooling.
 *   - Solidity tests are first-class in Hardhat 3 — Hardhat 3 runs Solidity tests alongside
 *     TypeScript tests in one project and one command.
 */
contract CrossToolchain {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
