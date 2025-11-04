import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { Transaction } from "@solana/web3.js";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { queryKeys } from "@/api/query-keys";
import { useCreateUser, useGetUsers } from "./useAdminApi";

export const useSolanaWallet = () => {
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { disconnect } = useWallet();
  const { data: users } = useGetUsers();
  const { mutate: createUser } = useCreateUser();
  const queryClient = useQueryClient();

  const handleSignIn = useCallback(async () => {
    if (!users?.data?.find((user) => user.wallet === wallet.publicKey?.toBase58())) {
      setVisible(true);
    }
  }, [setVisible, users, wallet]);

  const handleSignOut = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  const handleSendTransaction = useCallback(
    async (tx: Transaction) => {
      return await wallet.sendTransaction(tx, connection);
    },
    [wallet, connection]
  );

  useEffect(() => {
    if (!users) return;
    const address = users?.data?.find((user) => user.wallet === wallet.publicKey?.toBase58());
    if (wallet.connected && wallet.publicKey && !address) {
      createUser({
        name: wallet.publicKey.toBase58(),
        walletAddress: wallet.publicKey.toBase58(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    } else {
      localStorage.setItem("userId", address?.userId ?? "");
    }
  }, [wallet.connected, users, wallet.publicKey, createUser]);

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
