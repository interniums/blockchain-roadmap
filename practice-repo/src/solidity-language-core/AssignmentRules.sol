// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-language-core-assignment-rules-gas  (measure, difficulty 2)
 * Exercised by: test/AssignmentRules.t.sol
 * Run:      forge test --junit --match-path test/AssignmentRules.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a contract with a storage array uint[] x and three external functions that each take
 *   the same input a different way: (uint[] memory a), (uint[] calldata a), and (uint[] calldata
 *   a) that reads only a[0]. Each of the first two assigns into x so the deep copy actually
 *   happens. Add a fourth function that takes a local uint[] storage pointer into x, reassigns
 *   the pointer, and writes through it, with assertions proving which of the two operations
 *   touched state. Drive all four from a Foundry test at input lengths 1, 10 and 100, capturing
 *   gas with vm.startSnapshotGas or gasleft() deltas, and assert the expected shape of each
 *   curve rather than a fixed number.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Assignment copies or aliases — storage<->memory and calldata->anything deep-copy;
 *     memory->memory and storage->local-storage alias.
 *   - Data location — Every reference-type variable is storage, memory or calldata, and there
 *     is no default.
 *   - Calldata parameters — calldata is the non-modifiable, non-persistent region holding this
 *     external call's raw arguments.
 *   - Local storage pointer — A local T storage p is a slot pointer: reassigning p retargets
 *     it, p.field = x writes state.
 */
contract AssignmentRules {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
