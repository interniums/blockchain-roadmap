// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-exit-a-repo-someone-can-clone  (implement, difficulty 5)
 * Exercised by: test/exit/Repo.t.sol
 * Run:      forge test --match-path test/exit/Repo.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   The deliverable of this track is the repository itself. Take the practice repo you have been
 *   working in and make it something a stranger can clone and get identical results from — then
 *   prove that claim rather than making it. EIGHT properties, each with the evidence for it in
 *   the repo. REPRODUCIBLE. Pinned compiler version, pinned dependencies, committed lockfile. A
 *   documented command produces byte-identical bytecode, and you show the hash from two runs.
 *   TESTS THAT FAIL RIGHT. For three tests, demonstrate that each fails for the reason it
 *   claims: break the thing it tests, show the failure message names that thing, restore it. A
 *   test that passes when its subject is broken is worse than no test and you find at least one.
 *   FUZZ TO INVARIANT. Take one suspicion, write it as a fuzz property, then promote it to a
 *   stateful invariant campaign with handlers. Report the handler revert rate and get it under
 *   15% — a campaign that mostly reverts is a campaign that mostly tested nothing. FORK, PINNED.
 *   One suite runs against real mainnet state at a pinned block, offline after the first run,
 *   and produces the same numbers on a machine with no network. HONEST GAS. A gas report, plus a
 *   written statement of which numbers mainnet will not reproduce and why. Name at least two.
 *   MULTICHAIN DEPLOY. Deploy one contract to three chains at the same address, verify on each,
 *   and then deliberately interrupt a deploy and recover it. The recovery is the deliverable,
 *   not the deploy. CI THAT IS NOT FLAKY. A pipeline that catches gas regressions, format drift
 *   and broken invariants. Run it ten times on unchanged code with zero failures, and show the
 *   runs. HARDHAT JUDGEMENT. Read a Hardhat 3 repository and write one page on whether this
 *   project needs it. "No" is the expected answer and it still has to be argued.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Foundry is the default absent that coupling — Without a TypeScript coupling reason,
 *     Solidity-native tests, fuzzing and invariants are the faster loop and the smaller
 *     surface.
 *   - Running both, on purpose — Foundry for unit, fuzz and invariant testing; Hardhat for
 *     TypeScript integration tests, deployment plugins and ecosystem tooling.
 *   - Two toolchains, one Solidity — Foundry is Solidity-native and CLI-first; Hardhat is a
 *     TypeScript program that orchestrates compilation, testing and deployment.
 *   - When Hardhat earns its place — When the contract system is inseparable from TypeScript —
 *     shared types with an app, tests that drive both, an existing TS monorepo, or a plugin
 *     that only exists for Hardhat.
 */
contract Repo {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
