import { VersionedTransaction } from "@solana/web3.js";
import { useCallback, useState } from "react";
import { CreateDepositTransactionsDtoTypeEnum, type UserTokenView, type VaultInfoResponse } from "@/api";
import type { JupiterSwap } from "@/jupiter/api";
import { useJupiterSwapExecute } from "@/jupiter/queries/useJupiterSwap";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useCreateDepositTransactions } from "@/strategy/queries";

interface SwapTransactionMap {
  [requestId: string]: VersionedTransaction;
}

const deserializeTransaction = (base64Transaction: string): VersionedTransaction => {
  return VersionedTransaction.deserialize(Buffer.from(base64Transaction, "base64"));
};

const serializeTransaction = (transaction: VersionedTransaction): string => {
  return Buffer.from(transaction.serialize()).toString("base64");
};

const buildSwapTransactionMap = (
  quotes: { data?: JupiterSwap.OrderGet200Response; error?: unknown }[]
): SwapTransactionMap => {
  return quotes
    .filter((quote) => quote.data?.transaction)
    .reduce<SwapTransactionMap>((acc, quote) => {
      const requestId = quote.data?.requestId ?? "";
      acc[requestId] = deserializeTransaction(quote.data?.transaction ?? "");
      return acc;
    }, {});
};

const buildVaultParams = (
  totalAllocationEntries: [string, number][],
  vaults: VaultInfoResponse[],
  selectedMint: string,
  depositAmount: number,
  currentAction: CreateDepositTransactionsDtoTypeEnum
) => {
  const isDeposit = currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT;

  return totalAllocationEntries.map(([vaultId, allocation], index) => {
    const vault = vaults[index];
    const vaultInputMint = vault.inputTokenMint;
    const vaultAmount = (depositAmount * allocation) / 100;

    return {
      vaultId,
      inputMint: isDeposit ? selectedMint : vaultInputMint,
      outputMint: isDeposit ? vaultInputMint : selectedMint,
      platform: "Jupiter", // TODO: change to the actual platform
      amount: vaultAmount.toFixed(),
    };
  });
};

interface UseStrategyTransactionOptions {
  quotes: { data?: JupiterSwap.OrderGet200Response; error?: unknown }[];
  totalAllocationEntries: [string, number][];
  vaults: VaultInfoResponse[];
  selectedAsset: UserTokenView | null;
  depositAmount: number;
}

export const useStrategyTransaction = ({
  quotes,
  totalAllocationEntries,
  vaults,
  selectedAsset,
  depositAmount,
}: UseStrategyTransactionOptions) => {
  const { address: walletAddress, signAllTransactions, connection } = useSolanaWallet();

  const { mutateAsync: createDepositTransactions } = useCreateDepositTransactions();
  const { mutateAsync: executeSwap } = useJupiterSwapExecute();

  const [isLoading, setIsLoading] = useState(false);

  const executeDeposit = useCallback(
    async (
      signedSwapTxs: VersionedTransaction[],
      swapTransactions: SwapTransactionMap,
      depositTxs: VersionedTransaction[]
    ) => {
      // First execute swaps
      const swapResults = await Promise.all(
        signedSwapTxs.map((tx, index) =>
          executeSwap({
            signedTransaction: serializeTransaction(tx),
            requestId: Object.keys(swapTransactions)[index],
          })
        )
      );
      console.log("Swap transactions sent:", swapResults);

      // Then execute deposits
      console.log("Sending deposit transactions...");
      const depositResults = await Promise.all(depositTxs.map((tx) => connection.sendTransaction(tx)));
      console.log("Deposit transactions sent:", depositResults);

      return { swapResults, depositResults };
    },
    [executeSwap, connection]
  );

  const executeWithdraw = useCallback(
    async (
      signedSwapTxs: VersionedTransaction[],
      swapTransactions: SwapTransactionMap,
      withdrawTxs: VersionedTransaction[]
    ) => {
      // First execute withdrawals
      console.log("Sending withdraw transactions...");
      const withdrawResults = await Promise.all(withdrawTxs.map((tx) => connection.sendTransaction(tx)));
      console.log("Withdraw transactions sent:", withdrawResults);

      // Then execute swaps
      const swapResults = await Promise.all(
        signedSwapTxs.map((tx, index) =>
          executeSwap({
            signedTransaction: serializeTransaction(tx),
            requestId: Object.keys(swapTransactions)[index],
          })
        )
      );
      console.log("Swap transactions sent:", swapResults);

      return { swapResults, withdrawResults };
    },
    [executeSwap, connection]
  );

  const handleTransaction = useCallback(
    async (currentAction: CreateDepositTransactionsDtoTypeEnum) => {
      if (!walletAddress || !signAllTransactions) return;

      setIsLoading(true);

      try {
        const swapTransactions = buildSwapTransactionMap(quotes);
        const selectedMint = selectedAsset?.mint ?? "";

        const vaultParams = buildVaultParams(
          totalAllocationEntries,
          vaults,
          selectedMint,
          depositAmount,
          currentAction
        );

        const depositWithdrawTxsRaw = await createDepositTransactions({
          signer: walletAddress,
          type: currentAction,
          vaults: vaultParams,
        });

        const depositWithdrawTxs = depositWithdrawTxsRaw.map((tx) =>
          deserializeTransaction(tx.serializedTransaction ?? "")
        );

        const signedSwapTxs = await signAllTransactions(Object.values(swapTransactions));
        if (!signedSwapTxs) throw new Error("Failed to sign transactions");

        console.log(`Sending ${signedSwapTxs.length} transactions for ${currentAction}...`);

        if (currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT) {
          await executeDeposit(signedSwapTxs, swapTransactions, depositWithdrawTxs);
        } else {
          await executeWithdraw(signedSwapTxs, swapTransactions, depositWithdrawTxs);
        }

        console.log(`${currentAction} completed successfully`);
      } catch (error) {
        console.error(`${currentAction} error:`, error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      walletAddress,
      signAllTransactions,
      quotes,
      selectedAsset?.mint,
      totalAllocationEntries,
      vaults,
      depositAmount,
      createDepositTransactions,
      executeDeposit,
      executeWithdraw,
    ]
  );

  return { handleTransaction, isLoading, walletAddress };
};
