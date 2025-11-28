import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SendTransactionError, type Transaction, VersionedTransaction } from "@solana/web3.js";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { localStorageService } from "@/services/localStorageService";

export const useSolanaWallet = () => {
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  const { disconnect, signTransaction, signMessage, sendTransaction } = wallet;

  const handleSignIn = useCallback(async () => {
    setVisible(true);
  }, [setVisible]);

  const handleSignOut = useCallback(async () => {
    await disconnect();
    localStorageService.clearTokens();

    queryClient.clear();
  }, [disconnect, queryClient]);

  const handleSendTransaction = useCallback(
    async (tx: Transaction) => {
      return sendTransaction?.(tx, connection);
    },
    [sendTransaction, connection]
  );
  const handleSignTransaction = useCallback(
    async (tx: Transaction | VersionedTransaction) => {
      return signTransaction?.(tx);
    },
    [signTransaction]
  );

  const handleSendV0Transaction = useCallback(
    async (txBase64: string) => {
      try {
        const rawTx = Buffer.from(txBase64, "base64");
        const tx = VersionedTransaction.deserialize(rawTx);
        const signedTx = await signTransaction?.(tx);
        if (!signedTx) throw new Error("Failed to sign transaction");

        const hash = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false });
        await connection.confirmTransaction(hash, "finalized");

        return hash;
      } catch (error) {
        if (error instanceof SendTransactionError) {
          const logs = await error.getLogs(connection);
          console.log("Simulation logs:", logs);
        }
        toast.error("Failed to send transaction");
        throw error;
      }
    },
    [connection]
  );

  const handleSignMessage = useCallback(
    async (message: string) => {
      return signMessage?.(new TextEncoder().encode(message));
    },
    [signMessage]
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
      signTransaction: handleSignTransaction,
    }),
    [
      handleSignIn,
      handleSignOut,
      handleSendTransaction,
      handleSignMessage,
      handleSendV0Transaction,
      handleSignTransaction,
      wallet,
    ]
  );
};
