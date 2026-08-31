// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-gas-fee-market-cold-warm-probe  (measure, difficulty 3)
 * Exercised by: test/ColdWarm.t.sol
 * Run:      forge test -vv --junit --match-path test/ColdWarm.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a gas probe that measures, from your own machine, the cost of a cold SLOAD, a warm
 *   SLOAD, a cold BALANCE, a warm BALANCE, a cold EXTCODESIZE and a warm EXTCODESIZE. Wrap each
 *   operation in `gasleft()` deltas inside inline assembly, and first calibrate the harness
 *   overhead with an empty measurement so you can subtract it. Record your solc version, forge
 *   version and optimizer setting alongside the numbers, because the numbers are meaningless
 *   without them. Your first attempt will probably report every read as costing single-digit
 *   gas; work out why before reading the hint.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Cold and warm access — The first touch of an address or a storage slot in a transaction
 *     is priced far above every later touch, so identical code costs different gas depending
 *     on what ran before it.
 *   - SSTORE is priced on the transition — What a storage write costs depends on the value
 *     already there and the value being written, not on the fact that a write happened.
 *   - Gas — The unit that meters computation so execution is guaranteed to halt and every
 *     resource used is paid for.
 */
contract ColdWarm {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
