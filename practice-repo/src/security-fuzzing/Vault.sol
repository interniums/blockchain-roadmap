// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-fuzzing-vault-invariant-suite  (implement, difficulty 4)
 * Exercised by: test/invariant/Vault.invariant.t.sol
 * Run:      forge test --junit --match-path test/invariant/Vault.invariant.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take an ERC-4626 vault implementation and build a handler-based Foundry invariant suite for
 *   it. The handler exposes deposit, mint, withdraw, redeem and a donation of assets straight to
 *   the vault, selects the acting address from a fixed actor set, clamps every amount to what
 *   that actor can actually supply, and maintains ghost accumulators for total deposited and
 *   total withdrawn. Write three invariants - a solvency invariant that total assets always
 *   cover total claimable, a conservation invariant over the ghost accumulators, and a
 *   path-independence property asserting that n small deposits never yield more shares than one
 *   deposit of the same total. Then invert one rounding direction in the share calculation and
 *   confirm that the path-independence property, and only that property, fails.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Invariant testing — Stateful fuzzing where the oracle is a system-level invariant
 *     checked after every call in the sequence.
 *   - Handler contract — A wrapper that restricts the fuzzer to realistic actions by realistic
 *     actors instead of raw external functions.
 *   - Input clamping — Bound fuzzed inputs to plausible ranges so the campaign spends its
 *     budget in reachable state rather than on reverts.
 *   - Economic property — An invariant about value rather than about data — solvency, no free
 *     money, fee monotonicity, path independence.
 *   - Path independence — Splitting an operation into steps must never beat doing it in one,
 *     or the protocol has a free-money path.
 */
contract Vault {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
