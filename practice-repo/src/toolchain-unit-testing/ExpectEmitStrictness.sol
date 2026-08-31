// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-unit-testing-decoy-emitter  (implement, difficulty 3)
 * Exercised by: test/ExpectEmitStrictness.t.sol
 * Run:      forge test --junit --match-path test/ExpectEmitStrictness.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write two tests of the same ERC-20 transfer. The first uses `vm.expectEmit(true, true, true,
 *   true)` without pinning the emitter. The second uses the overload that takes the emitting
 *   address. Then deploy a decoy contract that emits a byte-identical `Transfer` event with the
 *   same indexed values, arrange for the decoy to emit during the call under test, and show that
 *   the first assertion is satisfied by the decoy while the second is not. Add a third test that
 *   registers two expectations in the wrong relative order and observe the failure, so you have
 *   seen ordering enforced as well as emitter blindness.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - expectEmit is order-sensitive — Register the expectation, emit the expected event, then
 *     make the call — and expected events must appear in the actual order.
 *   - What the four booleans actually check — The booleans are topics 1-3 and the data body;
 *     topic0 is always checked and the emitter is only checked by the address overload.
 */
contract ExpectEmitStrictness {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
