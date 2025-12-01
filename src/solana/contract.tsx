import { AnchorProvider, type BN, Program, type Wallet, type web3 } from "@coral-xyz/anchor";
import type NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";

import idl from "./idl.json";
import type { BackyardPrograms } from "./idl-types";

export interface DepositContext {
  signer: PublicKey;
  depositorTokenAccount: PublicKey;
  recipientTokenAccount: PublicKey;
  lendingAdmin: PublicKey;
  lending: PublicKey;
  mint: PublicKey;
  fTokenMint: PublicKey;
  claimAccount: PublicKey;
  supplyTokenReservesLiquidity: PublicKey;
  borrowTokenReservesLiquidity: PublicKey;
  lendingSupplyPositionOnLiquidity: PublicKey;
  lendingBorrowPositionOnLiquidity: PublicKey;
  rateModel: PublicKey;
  vault: PublicKey;
  liquidity: PublicKey;
  liquidityProgram: PublicKey;
  rewardsRateModel: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
  sysvarInstruction: PublicKey;
}

export class LendingProgram {
  protected program: Program<BackyardPrograms>;
  protected connection: web3.Connection;
  protected wallet: NodeWallet;

  constructor(connection: web3.Connection, wallet: Wallet) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program<BackyardPrograms>(idl as unknown as BackyardPrograms, provider);
    this.wallet = wallet;
    this.connection = connection;
  }

  async makeDepositTx(
    jupiterVaultId: PublicKey,
    amount: BN,
    signer: PublicKey,
    inputToken: PublicKey,
    depositContext: DepositContext,
    lpToken: PublicKey
  ) {
    try {
      console.log(jupiterVaultId, amount, signer, inputToken, depositContext, lpToken);
      const depositTx = this.program.methods.deposit(jupiterVaultId, amount).accounts({
        signer: signer,
        inputToken: inputToken,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenProgram2022: TOKEN_2022_PROGRAM_ID,
        lpToken: lpToken,
        fTokenMint: depositContext.fTokenMint,
        jupiterVault: depositContext.vault,
        lending: depositContext.lending,
        lendingAdmin: depositContext.lendingAdmin,
        rewardsRateModel: depositContext.rewardsRateModel,
        lendingSupplyPositionOnLiquidity: depositContext.lendingSupplyPositionOnLiquidity,
        liquidity: depositContext.liquidity,
        liquidityProgram: depositContext.liquidityProgram,
        rateModel: depositContext.rateModel,
        supplyTokenReservesLiquidity: depositContext.supplyTokenReservesLiquidity,
      });
      if (!this.program.provider.publicKey) return;
      return depositTx.transaction();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
