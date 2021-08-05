# SolanaAnchorDemo1

## dog-money

------------------== To Run

$ git clone https://github.com/AuroraLantean/SolanaAnchorDemo1

$ yarn install

$ yarn run t1

... this should give you a successful test result

$ yarn run t2

... this will give you an error

  logs: [
    'Program CKnr221MdQiQbSi8ZCJWQty3dqyghprYDFLmBEXkexkD invoke [1]',
    'Program log: Custom program error: 0xa1',
    'Program CKnr221MdQiQbSi8ZCJWQty3dqyghprYDFLmBEXkexkD consumed 5320 of 200000 compute units',
    'Program CKnr221MdQiQbSi8ZCJWQty3dqyghprYDFLmBEXkexkD failed: custom program error: 0xa1'
  ]

0xa1 in hex is 161 in decimal

May I know how how to search for the error code here

https://www.notion.so/Debugging-Custom-Anchor-Errors-b8540dd418c44a4e939ab17c56a3fd3b

https://github.com/project-serum/anchor/blob/master/lang/src/error.rs

but I could not find the error code for 161...


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
