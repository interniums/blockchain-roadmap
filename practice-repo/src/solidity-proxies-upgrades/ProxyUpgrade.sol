// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-proxies-upgrades-upgrade-both-patterns  (implement, difficulty 4)
 * Exercised by: test/ProxyUpgrade.t.sol
 * Run:      forge test --junit --match-path test/ProxyUpgrade.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a minimal transparent proxy and a minimal UUPS proxy over the same logic contract.
 *   Upgrade each once to a V2 that adds a state variable, and prove that state written before
 *   the upgrade survives it. Then, on the UUPS one, deliberately upgrade to a V3 that omits the
 *   upgrade function and prove that no further upgrade is possible from any caller. Finally, add
 *   a variant where V2 moves its state into an ERC-7201 namespace while V1 used sequential
 *   slots, and show what the old bytes look like when read under the new layout.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Transparent proxy — Admin calls go to the proxy and everything else to the
 *     implementation, so selectors cannot clash.
 *   - UUPS proxy — The upgrade function lives in the implementation, making the proxy cheaper
 *     and the future riskier.
 *   - UUPS bricking — Ship one implementation without a working upgrade function and the
 *     contract is permanently locked.
 *   - ERC-7201 namespaced storage — Each component's state lives in a struct at a derived root
 *     slot instead of the sequential range.
 *   - Migrating between layout schemes can brick a live contract — A v4-to-v5 layout migration
 *     deadlocked a live BNB Chain proxy: it can no longer be initialized, upgraded or
 *     administered.
 */
contract ProxyUpgrade {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
