# SolanaAnchorDemo1

## dog-money

------------------== To Run

$ git clone https://github.com/AuroraLantean/SolanaAnchorDemo1

$ yarn install

$ yarn run t1

... this should give you a successful test result

$ yarn run t2

... this should give you a successful test result

------------------== Debug
Find the error code
0xa1 in hex is 161 in decimal

Search for the error code here:

https://www.notion.so/Debugging-Custom-Anchor-Errors-b8540dd418c44a4e939ab17c56a3fd3b

https://github.com/project-serum/anchor/blob/master/lang/src/error.rs


------------------== modification from the tutorial:

----------== setup environment

delete .anchor and target folders

yarn add @project-serum/anchor@0.12.0 @project-serum/common

----------== update Anchor.toml

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "mocha -t 1000000 tests/"

----------== update Rust program dependencies

update src/cargo.toml:

[dependencies]
anchor-lang = "0.12.0"

anchor-spl = "0.12.0"

OR copy the folders from Anchor repo:

anchor-lang = { path = "../../../../lang" }

anchor-spl = { path = "../../../../spl" }

----------== update Rust code
#[derive(Accounts)]
pub struct InitializeUser<'info> {
    program_signer: AccountInfo<'info>,
    #[account(associated = authority, with = usdc_mint, init)]
    ...
}

#[associated]
pub struct UserData {
    pub first_deposit: i64,
}
impl Default for UserData {
  fn default() -> UserData { 
    UserData{
      __nonce: 0,
      first_deposit: 0,
    }
  }
}

----------== update JS code

const provider = anchor.Provider.local();

anchor.setProvider(provider);

program.provider -> provider

const usdcMint = await createMint(provider);//deleted: ,provider.wallet.publicKey
