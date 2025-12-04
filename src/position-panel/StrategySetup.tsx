import Big from "big.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateDepositTransactionsDtoTypeEnum, type UserTokenView } from "@/api";
import { TokenInputComponent } from "@/common/components/token-input";
import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/utils";
import { displayAmount, parseUnits } from "@/common/utils/format";
import type { Strategy } from "@/common/utils/types";
import { InfoCircleIcon } from "@/icons/info-circle";
import { useJupiterMultipleQuotes } from "@/jupiter/queries/useJupiterSwap";
import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { RouteDisplay } from "@/position-panel/components/RouteDisplay";
import { SlippageSettings } from "@/position-panel/components/SlippageSettings";
import { SummaryRow } from "@/position-panel/components/SummaryRow";
import { VaultAllocationCard } from "@/position-panel/components/VaultAllocationCard";
import { getTotalAllocation } from "@/position-panel/utils/strategy-helpers";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { useStrategyTransaction } from "./hooks/useStrategyTransaction";

interface StrategySetupProps {
  currentStrategy: Strategy;
  onDepositAmountChange: (amount: number) => void;
  onAllocationChange: (vaultId: string, amount: number) => void;
  onRemoveVault: (vaultId: string) => void;
  slippage: number;
  onSlippageChange: (slippage: number) => void;
}

export const StrategySetup = ({
  currentStrategy,
  onDepositAmountChange,
  onAllocationChange,
  onRemoveVault,
  slippage,
  onSlippageChange,
}: StrategySetupProps) => {
  const { totalAllocation, depositAmount, vaults } = currentStrategy;
  const totalAllocationArray = Object.values(totalAllocation);
  const totalAllocationEntries = Object.entries(totalAllocation);
  const { address: walletAddress } = useSolanaWallet();
  const [selectedAsset, setSelectedAsset] = useState<UserTokenView | null>(null);
  const { userTokens, isLoading: isUserTokensLoading } = useUserTokens();

  useEffect(() => {
    if (!isUserTokensLoading && userTokens.arr.length > 0) {
      setSelectedAsset(userTokens.arr[0] ?? null);
    }
  }, [isUserTokensLoading, userTokens.arr]);

  const quotesParams = useMemo(() => {
    return totalAllocationEntries.reduce(
      (acc, [vaultId, amount], index) => {
        const vaultInputMint = vaults[index].inputTokenMint;
        const selectedMint = selectedAsset?.mint ?? "";

        const needsSwap = selectedMint !== vaultInputMint;

        if (!needsSwap) return acc;

        //TODO: we should use big for that
        const swapAmount = (depositAmount * amount) / 100;
        const swapDecimals = Number(parseUnits(swapAmount.toString(), selectedAsset?.decimals ?? 0));
        const accAmount = Number(acc[vaultId]?.amount ?? 0);

        return Object.assign(acc, {
          [vaultId]: {
            vaultId: vaultId,
            inputMint: selectedMint,
            outputMint: vaultInputMint,
            amount: (swapDecimals + accAmount).toFixed(),
          },
        });
      },
      {} as Record<string, { vaultId: string; inputMint: string; outputMint: string; amount: string }>
    );
  }, [depositAmount, selectedAsset?.mint, totalAllocationEntries, vaults]);

  const sufficientBalance = Big(selectedAsset?.uiAmount.toString() || "0").gte(depositAmount);

  const quotes = useJupiterMultipleQuotes(Object.values(quotesParams), {
    enabled: sufficientBalance && Object.values(quotesParams).length > 0,
  });

  const { handleTransaction, isLoading: isStrategyTransactionLoading } = useStrategyTransaction({
    quotes,
    totalAllocationEntries,
    vaults,
    selectedAsset,
    depositAmount,
    onConfirm: () => {
      onDepositAmountChange(0);
    },
  });

  console.log("Quotes:", { response: quotes.map((quote) => quote.data), request: quotesParams });
  const totalAllocationSum = getTotalAllocation(totalAllocationArray);
  const isAllocationError = totalAllocationSum > 100;

  // Calculate average APY based on allocation
  const averageApy = useMemo(() => {
    if (!vaults?.length) return 0;
    if (!totalAllocationArray?.length) {
      return vaults.reduce((acc, curr) => acc + curr.apy, 0) / vaults.length;
    }
    return totalAllocationArray.reduce((acc, curr, idx) => acc + (vaults[idx]?.apy || 0) * (curr / 100), 0);
  }, [totalAllocationArray, vaults]);

  const estAnnualReturn = useMemo(() => {
    if (!averageApy) return 0;
    return depositAmount * (averageApy / 100);
  }, [depositAmount, averageApy]);

  const handleDeposit = useCallback(async () => {
    handleTransaction(CreateDepositTransactionsDtoTypeEnum.DEPOSIT);
    // if (!walletAddress || !signTransaction) return;

    // setIsLoading(true);
    // try {
    //   const swapTransactions = quotes
    //     .filter((quote) => quote?.data?.transaction)
    //     .reduce(
    //       (acc, quote) => {
    //         return Object.assign(acc, {
    //           [quote.data?.requestId ?? ""]: VersionedTransaction.deserialize(
    //             Buffer.from(quote.data?.transaction ?? "", "base64")
    //           ),
    //         });
    //       },
    //       {} as Record<string, VersionedTransaction>
    //     );

    //   const depositTransaction = await createDepositTransactions({
    //     signer: walletAddress,
    //     type: CreateDepositTransactionsDtoTypeEnum.DEPOSIT,
    //     vaults: Object.values(quotesParams).map((context) => {
    //       const swapAmountOutput =
    //         quotes.find((quote) => quote.data?.inputMint === context.outputMint)?.data?.outAmount ?? context.amount;
    //       return {
    //         vaultId: context.vaultId,
    //         inputMint: context.inputMint,
    //         platform: "Jupiter",
    //         outputMint: context.outputMint,
    //         amount: swapAmountOutput,
    //       };
    //     }),
    //   });
    //   console.log(depositTransaction);

    //   const newBlockhash = await connection.getLatestBlockhash("confirmed");
    //   const depositTxs = depositTransaction.transactions.map((tx) => {
    //     const versionedTransaction = VersionedTransaction.deserialize(Buffer.from(tx ?? "", "base64"));
    //     versionedTransaction.message.recentBlockhash = newBlockhash.blockhash;
    //     return versionedTransaction;
    //   });

    //   const signedTransactions = await signAllTransactions([
    //     ...Object.values(swapTransactions).map((transaction) => transaction),
    //     ...depositTxs,
    //   ]);

    //   if (!signedTransactions) throw new Error("Failed to sign transactions");

    //   // try {
    //   //   const bundle = await Promise.all(
    //   //     signedTransactions.slice(0, Object.values(swapTransactions).length).map((tx, index) =>
    //   //       executeSwap({
    //   //         signedTransaction: Buffer.from(tx.serialize()).toString("base64"),
    //   //         requestId: requestIds[index],
    //   //       })
    //   //     )
    //   //   );
    //   //   console.log(bundle);
    //   // } catch (error) {
    //   //   console.error("Execute error:", error);
    //   // }

    //   await new Promise((resolve) => setTimeout(resolve, 2000));

    //   const txs = await Promise.all(
    //     signedTransactions.slice(Object.values(swapTransactions).length).map((tx) => connection.sendTransaction(tx))
    //   );

    //   await createStrategy({
    //     name: "Strategy " + Date.now(),
    //     walletAddress,
    //     vaultDeposits: Object.values(quotesParams).reduce(
    //       (acc, curr) => {
    //         return Object.assign(acc, {
    //           [curr.vaultId]: curr.amount,
    //         });
    //       },
    //       {} as Record<string, number>
    //     ),
    //   });

    //   console.log(txs);
    //   // if (!bundle) throw new Error("Failed to send transactions");

    //   console.log("Bundle sent:");
    // } catch (error) {
    //   if (error instanceof SendTransactionError) {
    //     const logs = await error.getLogs(connection);
    //     console.error("Simulation logs:", logs, "\n\n", error);
    //   } else {
    //     console.error("Deposit error:", error);
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  }, [handleTransaction]);

  const isDepositDisabled =
    !depositAmount ||
    !totalAllocationArray?.length ||
    !vaults?.length ||
    !selectedAsset ||
    !walletAddress ||
    isAllocationError ||
    isStrategyTransactionLoading;

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        <span>Strategy setup</span>
        <SlippageSettings onSlippageChange={onSlippageChange} slippage={slippage} />
      </div>

      <TokenInputComponent
        assets={userTokens.arr}
        currentValue={depositAmount}
        selectedAsset={selectedAsset}
        setCurrentValue={onDepositAmountChange}
        setSelectedAsset={setSelectedAsset}
        sufficientBalance={sufficientBalance}
        title="Total deposit amount"
      />

      {totalAllocationArray && totalAllocationArray.length > 0 && vaults?.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="justify-start font-bold text-neutral-800 text-sm">Allocation</span>
            <div className="flex flex-row items-center font-bold text-neutral-800 text-sm">
              <span className={cn("font-bold text-sm text-zinc-400", isAllocationError && "text-pink-800")}>
                {totalAllocationSum}
              </span>
              /100%
            </div>
          </div>

          {vaults.map((vault) => (
            <VaultAllocationCard
              allocation={totalAllocation[vault.id]}
              depositAmount={(depositAmount / 100) * (totalAllocation[vault.id] || 0)}
              isAllocationError={isAllocationError}
              key={vault.id}
              removeVaultFromStrategy={onRemoveVault}
              setAllocation={(amount) => onAllocationChange(vault.id, amount)}
              vault={vault}
            />
          ))}

          {isAllocationError && (
            <div className="inline-flex flex-col items-start justify-center gap-1.5 rounded-2xl bg-zinc-100 p-[2px] pl-[5px]">
              <div className="inline-flex items-center justify-start gap-1 pb-px">
                <InfoCircleIcon backgroundColor="#A03152" className="size-2.5" fillColor="#FFF" />
                <div className="justify-center font-['Product_Sans'] font-bold text-[10px] text-pink-800">
                  The total allocation amount must be 100%. Reduce allocation
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {depositAmount > 0 && selectedAsset && quotes.length > 0 && (
        <div className="flex flex-col gap-2">
          {quotes.map((quote, index) => {
            if (!quote.data || quote.error || !quotesParams) return null;
            console.log(quotesParams, quotesParams[index]);
            return (
              <RouteDisplay
                key={quote.data.expireAt?.toString() ?? ""}
                routeSteps={quote.data.routePlan.map((step) => (
                  <>
                    {step.swapInfo.label}
                    <span className="font-bold text-neutral-700 text-xs">
                      {step.swapInfo.inAmount} {step.swapInfo.inputMint}
                    </span>
                  </>
                ))}
              />
            );
          })}
        </div>
      )}

      <div className="h-px w-80 rounded-2xl bg-zinc-100" />

      <div className="flex w-full flex-col justify-start gap-[3px]">
        <SummaryRow
          amount={depositAmount}
          label="Total deposited"
          symbol={selectedAsset?.symbol}
          usdPrice={selectedAsset?.usdPrice}
        />
        <SummaryRow
          amount={estAnnualReturn}
          label="Est. Annual return"
          symbol={selectedAsset?.symbol}
          usdPrice={selectedAsset?.usdPrice}
          valueColor="text-emerald-500"
        />
        <div className="flex flex-row items-start justify-between">
          <span className="font-bold text-neutral-700 text-xs">Avg APY</span>
          <span className="font-bold text-neutral-700 text-xs">
            {displayAmount(averageApy?.toString() || "0", 0, 3)}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[9px] rounded-2xl border border-zinc-100 bg-white">
        <Button disabled={isDepositDisabled} onClick={handleDeposit} size="xl" variant="tertiary">
          {isStrategyTransactionLoading ? (
            "Processing..."
          ) : walletAddress ? (
            <>
              Deposit {depositAmount} {selectedAsset?.symbol}{" "}
              {selectedAsset?.icon && (
                <img alt={selectedAsset?.symbol} className="size-[14px] rounded-full" src={selectedAsset?.icon} />
              )}
            </>
          ) : (
            "Connect wallet"
          )}
        </Button>
        <FeesDisplay depositFee={0} routeFee={0.05} />
      </div>
    </div>
  );
};
