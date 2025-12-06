import { SendTransactionError, VersionedTransaction } from "@solana/web3.js";
import Big from "big.js";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { CreateDepositTransactionsDtoTypeEnum, type UserTokenView, type VaultInfoResponse } from "@/api";
import { toast } from "@/common/components/ui/sonner";
import { parseUnits } from "@/common/utils/format";
import type { JupiterSwap } from "@/jupiter/api";
import { useJupiterSwapExecute } from "@/jupiter/queries/useJupiterSwap";
import { toStrategyRoute } from "@/routes";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useCreateDepositTransactions, useStrategyConfirm } from "@/strategy/queries";

interface SwapTransaction {
  requestId: string;
  transaction: VersionedTransaction;
}

interface UseStrategyTransactionOptions {
  quotes: { data?: JupiterSwap.OrderGet200Response; error?: unknown }[];
  totalAllocationEntries: [string, number][];
  vaults: VaultInfoResponse[];
  selectedAsset: UserTokenView | null;
  depositAmount: number;
  onConfirm?: () => void;
}

const deserializeTransaction = (base64: string): VersionedTransaction => {
  return VersionedTransaction.deserialize(Buffer.from(base64, "base64"));
};

const serializeTransaction = (transaction: VersionedTransaction): string => {
  return Buffer.from(transaction.serialize()).toString("base64");
};

const buildSwapTransactions = (
  quotes: { data?: JupiterSwap.OrderGet200Response; error?: unknown }[]
): SwapTransaction[] => {
  return quotes
    .filter((quote): quote is { data: JupiterSwap.OrderGet200Response } =>
      Boolean(quote.data?.transaction && quote.data?.requestId)
    )
    .map((quote) => ({
      requestId: quote.data.requestId!,
      transaction: deserializeTransaction(quote.data.transaction!),
    }));
};

const buildVaultParams = (
  totalAllocationEntries: [string, number][],
  vaults: VaultInfoResponse[],
  selectedMint: string,
  depositAmount: number,
  actionType: CreateDepositTransactionsDtoTypeEnum,
  quotes: { data?: JupiterSwap.OrderGet200Response; error?: unknown }[]
) => {
  const isDeposit = actionType === CreateDepositTransactionsDtoTypeEnum.DEPOSIT;
  // TODO: add token decimals support
  const depositAmountInMint = parseUnits(depositAmount.toString(), 6);

  return totalAllocationEntries.map(([vaultId, allocation], index) => {
    const vault = vaults[index];
    const vaultInputMint = vault.inputTokenMint;
    const vaultAmount = Big(depositAmountInMint).mul(Big(allocation).div(100)).toFixed();

    const swapAmount =
      quotes?.find((quote) => quote.data?.outputMint === vaultInputMint)?.data?.outAmount ?? vaultAmount;
    console.log("vaultAmount", vaultAmount);
    console.log("swapAmount", swapAmount);
    console.log("quotes", quotes?.find((quote) => quote.data?.inputMint === vaultInputMint)?.data);

    return {
      vaultId,
      inputMint: isDeposit ? selectedMint : vaultInputMint,
      outputMint: isDeposit ? vaultInputMint : selectedMint,
      platform: "Jupiter", // TODO: change to the actual platform
      amount: isDeposit ? swapAmount : vaultAmount,
    };
  });
};

export const useStrategyTransaction = ({
  quotes,
  totalAllocationEntries,
  vaults,
  selectedAsset,
  depositAmount,
  onConfirm,
}: UseStrategyTransactionOptions) => {
  const navigate = useNavigate();

  const { address: walletAddress, signAllTransactions, connection } = useSolanaWallet();
  const { mutateAsync: createDepositTransactions } = useCreateDepositTransactions();
  const { mutateAsync: confirmStrategy } = useStrategyConfirm();
  const { mutateAsync: executeSwap } = useJupiterSwapExecute();

  const [isLoading, setIsLoading] = useState(false);

  const executeSwapTransactions = useCallback(
    async (swaps: SwapTransaction[], signedSwapTxs: VersionedTransaction[]) => {
      if (signedSwapTxs.length === 0) {
        return [];
      }

      const results = await Promise.all(
        signedSwapTxs.map((tx, index) =>
          executeSwap({
            signedTransaction: serializeTransaction(tx),
            requestId: swaps[index].requestId,
          })
        )
      );
      console.log("Swap transactions executed:", results);
      return results;
    },
    [executeSwap]
  );

  const executeVaultTransactions = useCallback(
    async (vaultTxs: VersionedTransaction[], actionType: CreateDepositTransactionsDtoTypeEnum) => {
      if (vaultTxs.length === 0) {
        return [];
      }

      console.log(`Executing ${actionType} transactions...`);
      const results = await Promise.all(vaultTxs.map((tx) => connection.sendTransaction(tx)));
      console.log(`${actionType} transactions executed:`, results);
      return results;
    },
    [connection]
  );

  const handleTransaction = useCallback(
    async (actionType: CreateDepositTransactionsDtoTypeEnum) => {
      if (!walletAddress || !signAllTransactions) return;

      setIsLoading(true);

      try {
        const selectedMint = selectedAsset?.mint ?? "";
        const isDeposit = actionType === CreateDepositTransactionsDtoTypeEnum.DEPOSIT;

        // 1. Build swap transactions from quotes (may be empty if no swaps needed)
        const swapTransactions = buildSwapTransactions(quotes);
        const hasSwaps = swapTransactions.length > 0;

        // 2. Build vault params and create vault transactions
        const vaultParams = buildVaultParams(
          totalAllocationEntries,
          vaults,
          selectedMint,
          depositAmount,
          actionType,
          isDeposit ? quotes : []
        );

        const vaultTxsRaw = await createDepositTransactions({
          signer: walletAddress,
          type: actionType,
          vaults: vaultParams,
        });

        const { blockhash } = await connection.getLatestBlockhash("confirmed");
        const vaultTxs = vaultTxsRaw.transactions.map((tx) => {
          const versionedTx = deserializeTransaction(tx.serializedTransaction ?? "");
          versionedTx.message.recentBlockhash = blockhash;
          return versionedTx;
        });

        // 3. Prepare transactions for signing in correct order
        const swapTxsUnsigned = swapTransactions.map((s) => s.transaction);
        const transactionsToSign = isDeposit ? [...swapTxsUnsigned, ...vaultTxs] : [...vaultTxs, ...swapTxsUnsigned];

        // 4. Sign all transactions at once
        const signedTransactions = await signAllTransactions(transactionsToSign);
        if (!signedTransactions) {
          throw new Error("Failed to sign transactions");
        }

        console.log(`Executing ${signedTransactions.length} transactions for ${actionType}...`);

        // 5. Split signed transactions and execute in correct order
        let vaultSignatures: string[] = [];
        if (isDeposit) {
          const signedSwapTxs = signedTransactions.slice(0, swapTransactions.length);
          const signedVaultTxs = signedTransactions.slice(swapTransactions.length);

          if (hasSwaps) {
            await executeSwapTransactions(swapTransactions, signedSwapTxs);
          }
          vaultSignatures = await executeVaultTransactions(
            signedVaultTxs,
            CreateDepositTransactionsDtoTypeEnum.DEPOSIT
          );
          await new Promise((resolve) => setTimeout(resolve, 10000));

          await confirmStrategy({
            strategyId: vaultTxsRaw.strategyId,
            vaults: vaultSignatures.map((tx, index) => ({
              vaultId: vaultParams[index].vaultId,
              signature: tx,
            })),
          });
        } else {
          const signedVaultTxs = signedTransactions.slice(0, vaultTxs.length);
          const signedSwapTxs = signedTransactions.slice(vaultTxs.length);

          vaultSignatures = await executeVaultTransactions(
            signedVaultTxs,
            CreateDepositTransactionsDtoTypeEnum.WITHDRAW
          );
          if (hasSwaps) {
            await executeSwapTransactions(swapTransactions, signedSwapTxs);
          }
          await confirmStrategy({
            strategyId: vaultTxsRaw.strategyId,
            vaults: vaultSignatures.map((tx, index) => ({
              vaultId: vaultParams[index].vaultId,
              signature: tx,
            })),
          });
        }

        onConfirm?.();
        toast.success(actionType === CreateDepositTransactionsDtoTypeEnum.DEPOSIT ? "Deposited" : "Withdrawn", {
          description: (
            <div className="flex flex-row items-center gap-1">
              <span>{depositAmount}</span>
              <img alt={selectedAsset?.name} className="size-2.5" src={selectedAsset?.icon} />
            </div>
          ),
          actions: [
            {
              label: "View on Solscan",
              onClick: () => {
                window.open(`https://solscan.io/account/${walletAddress}`, "_blank");
              },
              variant: "secondary",
            },
            {
              label: "Go to my positions",
              onClick: () => {
                navigate(toStrategyRoute(vaultTxsRaw.strategyId));
              },
              variant: "secondary",
            },
          ],
        });
        console.log(`${actionType} completed successfully`, { vaultSignatures });
      } catch (error) {
        if (error instanceof SendTransactionError) {
          const logs = await error.getLogs(connection);
          console.error("Simulation logs:", logs, "\n\n", error);
        }
        console.error(`${actionType} error:`, error);
        toast.error(`${actionType} failed`);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      walletAddress,
      signAllTransactions,
      selectedAsset?.mint,
      quotes,
      totalAllocationEntries,
      vaults,
      depositAmount,
      createDepositTransactions,
      executeSwapTransactions,
      executeVaultTransactions,
      connection,
      confirmStrategy,
      onConfirm,
      selectedAsset?.icon,
      selectedAsset?.name,
    ]
  );

  return { handleTransaction, isLoading, walletAddress };
};
