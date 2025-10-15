import { AnchorProvider, Program, type Wallet, type web3 } from "@coral-xyz/anchor";
import type NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import type { Connection } from "@solana/web3.js";

import { BackyardPrograms, type BackyardProgramsType } from "./idl";

export class ContractBase {
  protected program: Program<BackyardProgramsType>;
  protected connection: Connection;
  protected wallet: NodeWallet;

  constructor(connection: web3.Connection, wallet: Wallet) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(BackyardPrograms, provider);
    this.wallet = wallet;
    this.connection = connection;
  }
}
