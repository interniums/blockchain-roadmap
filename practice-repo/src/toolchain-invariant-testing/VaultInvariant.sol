// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-invariant-testing-vault-solvency  (implement, difficulty 4)
 * Exercised by: test/VaultInvariant.t.sol
 * Run:      forge test --junit --match-path test/VaultInvariant.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a small deposit-and-withdraw vault, a handler that bounds amounts and picks among
 *   three actors, and ghost variables tracking total ever deposited and total ever withdrawn.
 *   State the solvency invariant against the ghosts rather than against the vault's own
 *   accounting. Then seed a bug that only manifests after a specific three-call sequence — for
 *   example a rounding error in share conversion that only bites when a withdrawal follows a
 *   deposit that followed another actor's withdrawal. Write unit tests covering each function
 *   individually and show them all passing, then show the invariant campaign finding the
 *   sequence and reporting it.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - An invariant — A property that must hold after any sequence of valid operations,
 *     re-checked after every call in the campaign.
 *   - The solvency invariant — Assets held are at least liabilities owed — the first invariant
 *     to write for any pool, vault or lending market.
 *   - The handler — A thin wrapper that bounds inputs and only makes calls that can plausibly
 *     succeed, so the campaign explores reachable states.
 *   - Ghost variables — A tally kept by the handler of what the contract should hold, so the
 *     invariant compares against an independent model.
 *   - Stateful fuzzing — State persists across calls within a run, so the fuzzer builds
 *     interaction sequences instead of testing one call in isolation.
 */
contract VaultInvariant {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
