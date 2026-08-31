//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: scaling-stylus-compute-versus-storage  (measure, grain module, difficulty 4)
//! Run:      cargo stylus check && forge test --match-path test/StylusGas.t.sol --fork-url $ARB_SEPOLIA_RPC_URL -vvv
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Write the same two contracts twice, once in Solidity and once in Rust with the Stylus SDK.
//!   The first is compute-bound: a loop of hash or fixed-point curve evaluations with a single
//!   storage write at the end. The second is storage-bound: a loop writing to a mapping. Deploy
//!   all four to Arbitrum Sepolia, activate the Stylus contracts, and measure gas for each.
//!   Record the activation cost separately as a real number from your own deployment, since it is
//!   not documented. Then add a third pair that allocates a large memory buffer and grows it, to
//!   see the page-based pricing against the EVM's quadratic expansion. Report a table of ratios
//!   and state, in one sentence per row, which cost component explains it.

/// Gas measured for compute-bound, storage-bound and memory-heavy workloads in both Solidity
/// and Stylus, reported as a table of ratios
#[test]
fn criterion_01_gas_measured_for_compute_bound_storage_bound() {
    panic!("Gas measured for compute-bound, storage-bound and memory-heavy workloads in both Solidity and Stylus, reported as a table of ratios");
}

/// The storage-bound row shows little or no saving, with the reason stated in one sentence
#[test]
fn criterion_02_the_storage_bound_row_shows_little_or() {
    panic!("The storage-bound row shows little or no saving, with the reason stated in one sentence");
}

/// Activation cost is recorded as a measured number from an actual deployment, with the
/// transaction hash
#[test]
fn criterion_03_activation_cost_is_recorded_as_a_measured() {
    panic!("Activation cost is recorded as a measured number from an actual deployment, with the transaction hash");
}

/// A Foundry test on the fork has a Solidity contract call the Rust contract through the
/// interface produced by `cargo stylus export-abi`, and read a return value
#[test]
fn criterion_04_a_foundry_test_on_the_fork_has() {
    panic!("A Foundry test on the fork has a Solidity contract call the Rust contract through the interface produced by `cargo stylus export-abi`, and read a return value");
}
