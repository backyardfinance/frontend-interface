import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { Transaction } from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export const useSolanaWallet = () => {
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { disconnect } = useWallet();

  const handleSignIn = useCallback(async () => {
    setVisible(true);
  }, [setVisible]);

  const handleSignOut = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  const handleSendTransaction = useCallback(
    async (tx: Transaction) => {
      return await wallet.sendTransaction(tx, connection);
    },
    [wallet, connection]
  );

  return useMemo(
    () => ({
      signIn: handleSignIn,
      signOut: handleSignOut,
      sendTransaction: handleSendTransaction,
      wallet: wallet,
      address: wallet.publicKey?.toBase58(),
    }),
    [handleSignIn, handleSignOut, handleSendTransaction, wallet.publicKey]
  );
};
