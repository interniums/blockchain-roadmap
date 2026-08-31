// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-yul-assembly-false-memory-safe  (break, difficulty 5)
 * Exercised by: test/FalseMemorySafe.t.sol
 * Run:      FOUNDRY_PROFILE=viair forge test --junit --match-path test/FalseMemorySafe.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write an assembly block that writes past the free-memory pointer without updating it,
 *   annotate it `("memory-safe")`, and place a Solidity memory allocation after it. Compile and
 *   run the same test under several configurations: legacy codegen, `--via-ir`, and `--via-ir`
 *   at different optimizer `runs` settings. Find at least one configuration where the output is
 *   wrong and at least one where it is accidentally correct. Then remove the annotation and
 *   record what happens to the gas of unrelated functions in the same file, to see the cost of
 *   the conservative choice.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - A false annotation is undefined behaviour — If you annotate memory-safe and the claim is
 *     untrue, the result is undefined behaviour that typically does not show up in tests.
 *   - The memory-safe annotation — `assembly ("memory-safe")` is a promise to the optimizer
 *     about which memory the block touches — not a check the compiler performs.
 *   - An unannotated block taxes the whole compilation unit — Any assembly block that touches
 *     memory, without the annotation, globally disables stack-to-memory movement and memory
 *     optimisations.
 */
contract FalseMemorySafe {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
