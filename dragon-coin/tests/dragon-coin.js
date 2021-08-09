const anchor = require('@project-serum/anchor');
const assert = require('assert');
const { TOKEN_PROGRAM_ID, getTokenAccount, createMint, createTokenAccount, mintToAccount } = require("./utils/index.js");
const log1 = console.log;

describe('dragon-coin', () => {
  const provider = anchor.Provider.local();

  anchor.setProvider(provider);
  log1("anchor.workspace:", anchor.workspace)
  const program = anchor.workspace.DragonCoin;//CAP

  let programSigner = null; 
  let usdcMint = null;
  let dragonCoinMint = null;
  let usdcUser0 = null;
  let usdcProgram = null;
  let dragonCoinUser0 = null;
  let usdcUser0Acct = null;
  let dragonCoinUser0Acct = null;
  const amountZero = new anchor.BN(0);
  let amount = new anchor.BN(0);


  it('Is initialized!', async () => {
    usdcMint = await createMint(provider);
    console.log("usdcMint:", usdcMint);

        // program signer PDA - to sign transactions for the program
        const [_programSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
          [usdcMint.toBuffer()],
          program.programId
        )
        programSigner = _programSigner;
        //-----------==
    
    dragonCoinMint = await createMint(provider, programSigner);

    //token accounts
    usdcUser0 = await createTokenAccount(provider, usdcMint, provider.wallet.publicKey);
    
    usdcProgram = await createTokenAccount(provider, usdcMint, program.programId);

    dragonCoinUser0 = await createTokenAccount(provider, dragonCoinMint, provider.wallet.publicKey);

    amount = new anchor.BN(5 * 10 ** 6);

    usdcUser0Acct = await getTokenAccount(provider, usdcUser0);
    log1("User USDC balance before minting:", usdcUser0Acct.amount.toString());
    assert.ok(usdcUser0Acct.amount.eq(amountZero));

    // mint USDC tokens to usdcUser0
    await mintToAccount(provider, usdcMint, usdcUser0, amount, provider.wallet.publicKey);

    usdcUser0Acct = await getTokenAccount(provider, usdcUser0);
    log1("User USDC balance after minting:", usdcUser0Acct.amount.toString());
    assert.ok(usdcUser0Acct.amount.eq(amount));

    dragonCoinUser0Acct = await getTokenAccount(provider, dragonCoinUser0);
    log1("User dragonCoin balance before initializeUser:", dragonCoinUser0Acct.amount.toString());
    assert.ok(dragonCoinUser0Acct.amount.eq(amount.mul(amountZero)));

    //--------------==
    log1("--------------==");
    const dataAccount = anchor.web3.Keypair.generate();
    //console.log("dataAccount:", dataAccount);

    // Associated account PDA - store user data
    const userData = await program.account.userData.associatedAddress(
      provider.wallet.publicKey,
      usdcMint);
    log1("check 1");
    log1(programSigner, usdcMint, dragonCoinMint, usdcUser0, usdcProgram, dragonCoinUser0, "amount:", amount.toString(), ", nonce:", nonce);

    await program.rpc.initializeUser(amount, nonce, {
      accounts: {
        programSigner,
        userData,
        authority: provider.wallet.publicKey,
        usdcMint,
        usdcUser: usdcUser0,
        usdcProgram,
        dragonCoinMint,
        dragonCoinUser: dragonCoinUser0,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
      // signers: [dataAccount],
      // instructions: [await program.account.userData.createInstruction(dataAccount)],
    });
    log1("check 2");

    usdcUser0Acct = await getTokenAccount(provider, usdcUser0);
    log1("User USDC balance after initializeUser:", usdcUser0Acct.amount.toString());
    assert.ok(usdcUser0Acct.amount.eq(amountZero));

    log1("check 3");
    dragonCoinUser0Acct = await getTokenAccount(provider, dragonCoinUser0);
    log1("User dragonCoin balance after initializeUser:", dragonCoinUser0Acct.amount.toString());
    assert.ok(dragonCoinUser0Acct.amount.eq(amount.mul(new anchor.BN(1000))));
    
  });

  /*it('Is able to mint USDC!', async () => {

    usdcMint = await createMint(provider);
    // console.log(usdcMint);
    dragonCoinMint = await createMint(provider, programSigner);

    usdcUser0 = await createTokenAccount(provider, usdcMint, provider.wallet.publicKey);
    
    usdcProgram = await createTokenAccount(provider, usdcMint, program.programId);

    dragonCoinUser0 = await createTokenAccount(provider, dragonCoinMint, provider.wallet.publicKey);

    amount = new anchor.BN(5 * 10 ** 6);

    usdcUser0Acct = await getTokenAccount(provider, usdcUser0);
    log1("User USDC balance before minting:", usdcUser0Acct.amount.toString());
    assert.ok(usdcUser0Acct.amount.eq(amountZero));

    // mint USDC tokens to usdcUser0
    await mintToAccount(provider, usdcMint, usdcUser0, amount, provider.wallet.publicKey);

    usdcUser0Acct = await getTokenAccount(provider, usdcUser0);
    log1("User USDC balance before minting:", usdcUser0Acct.amount.toString());
    assert.ok(usdcUser0Acct.amount.eq(amount));

    dragonCoinUser0Acct = await getTokenAccount(provider, dragonCoinUser0);
    log1("User dragonCoin balance before minting:", dragonCoinUser0Acct.amount.toString());
    assert.ok(dragonCoinUser0Acct.amount.eq(amount.mul(amountZero)));
  });*/
});
