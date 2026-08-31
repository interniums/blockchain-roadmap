#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

#[cfg(not(any(test, feature = "export-abi")))]
#[unsafe(no_mangle)]
pub extern "C" fn main() {}

/// `cargo stylus export-abi` prints the Solidity interface criterion 4 needs.
#[cfg(feature = "export-abi")]
fn main() {
    stylus_gas::print_from_args();
}
