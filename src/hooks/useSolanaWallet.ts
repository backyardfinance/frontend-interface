import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SendTransactionError, type Transaction, VersionedTransaction } from "@solana/web3.js";
import { useCallback, useMemo } from "react";

export const useSolanaWallet = () => {
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { disconnect, signTransaction } = useWallet();

  const handleSignIn = useCallback(async () => {
    setVisible(true);
  }, [setVisible]);

  const handleSignOut = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  const handleSendTransaction = useCallback(
    async (tx: Transaction) => {
      return wallet.sendTransaction(tx, connection);
    },
    [wallet, connection]
  );

  const handleSignMessage = useCallback(
    async (message: string) => {
      return wallet.signMessage?.(new TextEncoder().encode(message));
    },
    [wallet.signMessage]
  );

  const handleSendV0Transaction = useCallback(
    async (txBase64: string) => {
      try {
        const rawTx = Buffer.from(txBase64, "base64");
        const tx = VersionedTransaction.deserialize(rawTx);
        const signedTx = await signTransaction?.(tx);
        if (!signedTx) throw new Error("Failed to sign transaction");

        return connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false });
      } catch (error) {
        if (error instanceof SendTransactionError) {
          const logs = await error.getLogs(connection);
          console.log("❗ SIMULATION LOGS:", logs);
        }
        throw error;
      }
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
      signMessage: handleSignMessage,
      sendV0Transaction: handleSendV0Transaction,
    }),
    [handleSignIn, handleSignOut, handleSendTransaction, wallet.publicKey]
  );
};
