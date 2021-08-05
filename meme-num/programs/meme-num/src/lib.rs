use anchor_lang::prelude::*;

#[program]
pub mod meme_num {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let meme_num_account = &mut ctx.accounts.meme_num_account;
        meme_num_account.meme_num = 420;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init)]
    //check if account is empty, and enough lamports on the account for 2 years
    meme_num_account: ProgramAccount<'info, MemeNumAccount>,
    rent: Sysvar<'info, Rent>,
}//MemeNumAccount has to match meme_num_account with snake case

#[account]
pub struct MemeNumAccount {
    pub meme_num: u64,
}