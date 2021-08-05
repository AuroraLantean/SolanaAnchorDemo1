# dog-money

modification from the tutorial:

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

----------== update JS code
const provider = anchor.Provider.local();
anchor.setProvider(provider);

program.provider -> provider

const usdcMint = await createMint(provider);//deleted: ,provider.wallet.publicKey

const dataAccount = anchor.web3.Keypair.generate();
await program.rpc.initializeUser(.. {},
      signers: [dataAccount],
      //instructions: [await program.account.dataAccount.//createInstruction(dataAccount)],
)

