//! Audit the seeds an IDL publishes against the ones the program enforces
//!
//! The program is declared and does nothing. Every constraint this exercise is about is one you
//! add — and the point of most of them is what happens when the constraint is *missing*, so read
//! the tests before you start adding `#[account(...)]` attributes.

use anchor_lang::prelude::*;

declare_id!("AL2usjzgqeKTrPok7pf7Lt8Zmqt1UntU4VQZuZ2BU3oG");

#[program]
pub mod anchor_idl_audit {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        // TODO: unimplemented. The tests describe what this has to end up doing.
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
