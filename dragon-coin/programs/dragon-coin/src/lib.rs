use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Transfer, MintTo};
use anchor_lang::solana_program::program_option::COption;

//0:33:27

#[program]
pub mod dragon_coin {//mod name <- Cargo.toml
    use super::*;
    pub fn initialize_user(ctx: Context<InitializeUser>, amount: u64, nonce: u8) -> ProgramResult {
        let user_data = &mut ctx.accounts.user_data;
        user_data.deposit_last = ctx.accounts.clock.unix_timestamp;

        // Transfer USDC from user to vault, check arg
        let cpi_accounts = Transfer {
            from: ctx.accounts.usdc_user.to_account_info(),
            to: ctx.accounts.usdc_program.to_account_info(),
            authority: ctx.accounts.authority.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Mint 1,0000x dragon_coin to user account
        let dragon_coin_amount = amount.checked_mul(1000).unwrap();
        let seeds = &[ctx.accounts.usdc_mint.to_account_info().key.as_ref(), &[nonce], ];
        let signer = &[&seeds[..]];
        let cpi_accounts = MintTo {
            mint: ctx.accounts.dragon_coin_mint.to_account_info(),
            to: ctx.accounts.dragon_coin_user.to_account_info(),
            authority: ctx.accounts.program_signer.clone()
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, dragon_coin_amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    program_signer: AccountInfo<'info>,

    #[account(associated = authority, with = usdc_mint, init)]
    user_data: ProgramAccount<'info, UserData>,

    #[account(signer)]
    authority: AccountInfo<'info>,

    usdc_mint: CpiAccount<'info, Mint>,

    #[account(mut, "usdc_user.owner == *authority.key")]
    usdc_user: CpiAccount<'info, TokenAccount>,

    #[account(mut)]
    usdc_program: CpiAccount<'info, TokenAccount>,

    #[account(mut,
    "dragon_coin_mint.mint_authority == COption::Some(*program_signer.key)")]
    dragon_coin_mint: CpiAccount<'info, Mint>,

    #[account(mut, "dragon_coin_user.owner == *authority.key")]
    dragon_coin_user: CpiAccount<'info, TokenAccount>,
    // We already know its address and that it's executable

    #[account(executable, "token_program.key == &token::ID")]

    token_program: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
}


//#[account(seeds = [authority])]
//#[account(seeds)]
//#[account(seeds = [authority, usdc_mint])]
#[associated]
pub struct UserData {
    pub deposit_last: i64,
}
impl Default for UserData {
  fn default() -> UserData { 
    UserData{
      __nonce: 0,
      deposit_last: 0,
    }
  }
}