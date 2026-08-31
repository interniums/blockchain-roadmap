//! A PDA config account, its seeds, and who is allowed to change it
//!
//! The program is declared and does nothing. Every constraint this exercise is about is one you
//! add — and the point of most of them is what happens when the constraint is *missing*, so read
//! the tests before you start adding `#[account(...)]` attributes.

use anchor_lang::prelude::*;

declare_id!("6gH8deuKefXYbzfFtzKBr5gLHbnsnnC8C9nqh8puPJuN");

#[program]
pub mod anchor_pda_config {
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
