//! What deleting a has_one constraint actually lets through
//!
//! The program is declared and does nothing. Every constraint this exercise is about is one you
//! add — and the point of most of them is what happens when the constraint is *missing*, so read
//! the tests before you start adding `#[account(...)]` attributes.

use anchor_lang::prelude::*;

declare_id!("9L4GDVqGo3DZb3iDSLLmjGYcZF6wciKHskhpJiuGUb4X");

#[program]
pub mod anchor_has_one {
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
