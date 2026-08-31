//! Stylus: what compute costs versus what storage costs.
//!
//! Practice: scaling-stylus-compute-versus-storage
//! Run:      cargo stylus check && forge test --match-path test/StylusGas.t.sol …
//!
//! THIS IS A SHAPE, NOT A SOLUTION. The three methods below are the three workloads the practice
//! asks you to measure, with the signatures its fourth criterion needs — a Solidity test calls this
//! contract through the interface `cargo stylus export-abi` prints, so the ABI has to exist before
//! anything else can. The bodies are yours.
//!
//! The measurement is the point, and the interesting row is the storage one. Stylus charges for
//! compute in its own units and for storage at EVM prices, so the compute-bound workload is where
//! the saving lives and the storage-bound one is where you should expect almost none. Write down
//! what you predict before you deploy, then see which prediction survives.
//!
//! The Solidity half of the pair lives in `test/StylusGas.t.sol`.

// `cargo stylus export-abi` generates a main function; this lets it.
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use stylus_sdk::{alloy_primitives::U256, prelude::*};

sol_storage! {
    #[entrypoint]
    pub struct GasLab {
        /// Written once at the end of the compute-bound run, so the loop cannot be optimised away
        /// and the storage cost of the compute row is exactly one SSTORE.
        uint256 checksum;
        /// The storage-bound workload writes here, one slot per iteration.
        mapping(uint256 => uint256) slots;
    }
}

#[public]
impl GasLab {
    /// Compute-bound: `rounds` iterations of hashing or curve arithmetic, then a single store.
    /// Returns the checksum so the caller can prove the work happened.
    pub fn compute_bound(&mut self, rounds: U256) -> U256 {
        let _ = rounds;
        panic!("TODO: compute_bound is unimplemented");
    }

    /// Storage-bound: `rounds` iterations, each writing one slot of `slots`.
    /// This is the row where Stylus is expected to save you little or nothing. Find out why.
    pub fn storage_bound(&mut self, rounds: U256) {
        let _ = rounds;
        panic!("TODO: storage_bound is unimplemented");
    }

    /// Memory-heavy: allocate a buffer of `bytes` and grow it, to put Stylus's page-based pricing
    /// against the EVM's quadratic memory expansion. Returns something derived from the buffer so
    /// the allocation cannot be elided.
    pub fn memory_bound(&mut self, bytes: U256) -> U256 {
        let _ = bytes;
        panic!("TODO: memory_bound is unimplemented");
    }

    /// The checksum the compute-bound run left behind.
    pub fn checksum(&self) -> U256 {
        self.checksum.get()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use stylus_sdk::testing::*;

    /// The host-side VM the SDK ships, so the contract can be exercised without a chain. Once the
    /// three workloads are written, assert their results here before spending gas on Sepolia.
    #[test]
    fn checksum_starts_at_zero() {
        let vm = TestVM::default();
        let contract = GasLab::from(&vm);
        assert_eq!(U256::ZERO, contract.checksum());
    }
}
