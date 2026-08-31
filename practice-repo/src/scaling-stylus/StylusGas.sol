// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-stylus-compute-versus-storage  (measure, difficulty 4)
 * Exercised by: test/StylusGas.t.sol
 * Run:      cd rust/stylus-gas && cargo stylus check -e $ARB_SEPOLIA_RPC_URL && cd ../.. && forge test --match-path test/StylusGas.t.sol --fork-url $ARB_SEPOLIA_RPC_URL -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write the same two contracts twice, once in Solidity and once in Rust with the Stylus SDK.
 *   The first is compute-bound: a loop of hash or fixed-point curve evaluations with a single
 *   storage write at the end. The second is storage-bound: a loop writing to a mapping. Deploy
 *   all four to Arbitrum Sepolia, activate the Stylus contracts, and measure gas for each.
 *   Record the activation cost separately as a real number from your own deployment, since it is
 *   not documented. Then add a third pair that allocates a large memory buffer and grows it, to
 *   see the page-based pricing against the EVM's quadratic expansion. Report a table of ratios
 *   and state, in one sentence per row, which cost component explains it.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Compute is cheap, storage is not — Stylus makes compute dramatically cheaper, but
 *     storage reads and writes cost the same gas as the EVM.
 *   - Ink — Stylus's fine-grained metering unit for WASM instructions, far smaller than gas,
 *     converted to gas at execution time.
 *   - Activation — Stylus code must be activated once on-chain — the WASM is compiled to
 *     native code and cached — which is why execution is fast and deployment has an extra
 *     step.
 *   - The shape of a good Stylus use case — Stylus wins where the workload is compute- or
 *     memory-bound and wins nothing where it is storage-bound.
 *   - Page-based memory — Stylus memory grows in 64 KB pages at near-linear cost, versus the
 *     EVM's 32-byte words with quadratic expansion.
 */
contract StylusGas {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
