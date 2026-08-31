// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-gas-profiling-three-numbers  (measure, difficulty 4)
 * Exercised by: test/GasThreeWays.t.sol
 * Run:      forge test --junit --match-path test/GasThreeWays.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take one storage-writing function and measure it three ways: from the aggregate gas report,
 *   from the same run with isolation enabled, and from a named snapshot region bracketing only
 *   the call itself. Then measure it a fourth way with a hand-rolled `gasleft()` probe — and
 *   make the probe correct, which for any read means assigning the result into a storage sink so
 *   it cannot be eliminated. Deliberately write the naive version first, observe that every read
 *   costs the same implausibly small number, and record that as a finding. Subtract the harness
 *   overhead. Write down, for each of the four numbers, exactly what is included and what is
 *   excluded, and which one is closest to what a user pays.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The gas report — forge test --gas-report prints per contract a deployment cost and size
 *     row plus min / avg / median / max / call-count per function.
 *   - Named snapshots inside a test — vm.startSnapshotGas("name") and vm.stopSnapshotGas()
 *     measure a region of one test, excluding the harness around it.
 *   - Isolation mode — --isolate runs each top-level external call as its own transaction,
 *     restoring realistic cold/warm accounting at the cost of modelling one multi-call
 *     transaction.
 *   - Foundry gas numbers under-report — Setup warms accounts and slots and the report
 *     measures the call, not the transaction — so your numbers are systematically below
 *     mainnet.
 *   - A gas probe that measures nothing — A read whose result is unused is eliminated as dead
 *     code even with the optimizer off — so every read must be assigned into a sink.
 */
contract GasThreeWays {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
