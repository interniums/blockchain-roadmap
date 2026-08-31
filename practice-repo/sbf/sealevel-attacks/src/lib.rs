//! Three exploits from the Sealevel-attacks catalogue, reproduced
//!
//! The program under test. It accepts everything and checks nothing, which is the starting
//! position for every exercise in this directory: the tests describe an attack, and the work is
//! making the program refuse it.

use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    // TODO: this program validates nothing yet. That is the bug the tests are about.
    Ok(())
}
