// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-gas-profiling-guard-swap  (measure, difficulty 4)
 * Exercised by: test/GuardGas.t.sol
 * Run:      forge test --junit --match-path test/GuardGas.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement the same function twice, once behind a storage-slot reentrancy guard and once
 *   behind a transient-storage guard, plus an unguarded control. Measure the overhead of each
 *   guard as the difference against the control, and measure the storage guard twice — once
 *   where the lock slot is cold on the first guarded call in the transaction, and once where it
 *   is already warm. Report a range for the storage guard rather than a single number, and
 *   explain the range. Then prove both guards still work by writing an attacker contract that
 *   attempts reentry and asserting it is blocked in both cases.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Storage dominates everything — How many distinct slots you touch dwarfs every
 *     opcode-level trick — measured cold SLOAD 2100 versus warm 100, SSTORE 20000 versus 2900.
 *   - Named snapshots inside a test — vm.startSnapshotGas("name") and vm.stopSnapshotGas()
 *     measure a region of one test, excluding the harness around it.
 *   - Pausing the meter — vm.pauseGasMetering, vm.resumeGasMetering and vm.resetGasMetering
 *     exclude setup from a measurement; gasleft() deltas do it by hand.
 *   - Gas folklore, measured — Most repeated tips are worth single-digit gas, already done by
 *     the optimizer, or net-negative.
 */
contract GuardGas {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
