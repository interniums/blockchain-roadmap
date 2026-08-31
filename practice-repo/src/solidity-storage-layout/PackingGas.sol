// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-storage-layout-packing-gas-measurement  (measure, difficulty 2)
 * Exercised by: test/PackingGas.t.sol
 * Run:      forge test --junit --match-path test/PackingGas.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Deploy two contracts holding identical fields — a uint128, a uint128 and a uint256 —
 *   declared in two different orders, plus a third variant that inserts a struct between two
 *   small fields. For each, produce a slot map from forge inspect storage-layout and measure
 *   deployment gas and the gas of writing all three fields in one transaction and of writing
 *   only one field. Then find and document an access pattern under which the packed layout is
 *   more expensive than the unpacked one.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Slot packing — Contiguous variables smaller than 32 bytes share one slot when they fit,
 *     lower-order first.
 *   - Declaration order determines slot count — uint128, uint128, uint256 takes two slots;
 *     uint128, uint256, uint128 takes three.
 *   - Structs and arrays start a new slot — Struct and array data always begins a new slot and
 *     packs tightly only within itself.
 */
contract PackingGas {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
