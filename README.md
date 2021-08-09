# SolanaAnchorDemo1

## To Install and Run

Install Node

Install Rust

https://www.rust-lang.org/tools/install

Install Solana Tool Suite

https://docs.solana.com/cli/install-solana-cli-tools

Install Mocha

https://github.com/mochajs/mocha
$ yarn global add mocha

Install Anchor

$ cargo install --git https://github.com/project-serum/anchor --tag v0.12.0 anchor-cli --locked

On Linux systems you may need to install additional dependencies if cargo install fails. On Ubuntu,
$ sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev

$ yarn install

$ yarn run p3 ... for staking USDC to mint Dragon-Coin


## modification from the Anchor tutorial:

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
