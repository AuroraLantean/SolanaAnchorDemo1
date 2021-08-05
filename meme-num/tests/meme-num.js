const anchor = require('@project-serum/anchor');
const assert = require('assert');

describe('meme-num', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  it('Is initialized!', async () => {
    const program = anchor.workspace.MemeNum;
    console.log("program.account:", program.account);

    const memeNumAccount= anchor.web3.Keypair.generate();

    const tx = await program.rpc.initialize({
      accounts: {
        memeNumAccount: memeNumAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [memeNumAccount],
      instructions: [
        await program.account.memeNumAccount.createInstruction(memeNumAccount)],//anchor will give enough lamports and data for enough space in byte array
    });

    const account = await program.account.memeNumAccount.fetch(memeNumAccount.publicKey);

    assert(account.memeNum.eq(new anchor.BN(420)));
    // console.log("Your transaction signature", tx);
  });
});

//anchor test