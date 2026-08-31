// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-monitoring-invariant-to-production  (implement, difficulty 4)
 * Exercised by: test/VaultInvariant.t.sol
 * Run:      forge test --junit --match-path test/VaultInvariant.t.sol && pnpm vitest run tests/invariant-monitor --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a simple vault and write a Foundry invariant test asserting that total assets are never
 *   less than the sum of user shares valued at the current rate. Then write a TypeScript monitor
 *   that evaluates the identical predicate against a forked chain every block, batching its
 *   reads through multicall so one block costs one round trip. The predicate must exist in
 *   exactly one place - export it from a shared module or generate both from one definition - so
 *   the two cannot drift. Corrupt the vault's accounting on the fork with a storage write, and
 *   show the monitor reporting failure within one block. Make the failure output enriched: which
 *   term of the predicate broke, by how much, and the balance deltas that produced it.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The highest-signal alert is a broken invariant — A protocol-specific predicate evaluated
 *     against live state every block fires only when something is wrong by construction, not
 *     by heuristic.
 *   - One predicate, two deployment targets — The invariants asserted in a Foundry invariant
 *     test are the same predicates that should be evaluated against mainnet state, so
 *     production monitoring should deploy test artifacts rather than reimplement them.
 *   - Transaction, state, economic — Monitoring has three layers - a specific call pattern, an
 *     invariant over contract storage, and an economic anomaly - with different latency,
 *     different precision and different tooling.
 *   - An alert worth waking up for — An alert arriving with the decoded trace, per-address
 *     balance deltas, the funding path and the exposed value turns a twenty-minute triage into
 *     a two-minute decision.
 */
contract VaultInvariant {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
