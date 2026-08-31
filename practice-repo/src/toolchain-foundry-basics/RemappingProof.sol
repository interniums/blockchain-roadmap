// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-foundry-basics-break-remappings  (break, difficulty 2)
 * Exercised by: test/RemappingProof.t.sol
 * Run:      forge test --junit --match-path test/RemappingProof.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Remappings — A remapping rewrites an import prefix to a filesystem path, so import
 *     strings don't encode where you vendored the dependency.
 *   - Where remappings come from — Three sources merge — auto-detected lib/ contents,
 *     remappings.txt, and foundry.toml — and `forge remappings` prints the winner.
 *   - Submodules or Soldeer — Dependencies are git submodules under lib/ by default; `forge
 *     soldeer` offers a registry alternative in the same binary.
 */
contract RemappingProof {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
