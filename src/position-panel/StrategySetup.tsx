import type NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { getDepositContext } from "@jup-ag/lend/earn";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserTokenView } from "@/api";
import { TokenInputComponent } from "@/common/components/token-input";
import { Button } from "@/common/components/ui/button";
import { cn, displayAmount, parseTokenAmount } from "@/common/utils";
import type { Strategy } from "@/common/utils/types";
import { InfoCircleIcon } from "@/icons/info-circle";
import { jupiterSwapApi } from "@/jupiter/api";
import { useJupiterMultipleQuotes } from "@/jupiter/queries/useJupiterSwap";
import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { RouteDisplay } from "@/position-panel/components/RouteDisplay";
import { SlippageSettings } from "@/position-panel/components/SlippageSettings";
import { SummaryRow } from "@/position-panel/components/SummaryRow";
import { VaultAllocationCard } from "@/position-panel/components/VaultAllocationCard";
import { getTotalAllocation } from "@/position-panel/utils/strategy-helpers";
import { LendingProgram } from "@/solana/contract";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { vaultIdToLp } from "@/vaults/queries";

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
  const { address: walletAddress, signTransaction, signAllTransactions } = useSolanaWallet();
  const [selectedAsset, setSelectedAsset] = useState<UserTokenView | null>(null);
  const { userTokens, isLoading: isUserTokensLoading } = useUserTokens();
  const [isLoading, setIsLoading] = useState(false);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  useEffect(() => {
    if (!isUserTokensLoading && userTokens.arr.length > 0) {
      setSelectedAsset(userTokens.arr[0] ?? null);
    }
  }, [isUserTokensLoading, userTokens.arr]);

  const quotesParams = useMemo(() => {
    return totalAllocationEntries.reduce(
      (acc, [vaultId, amount], index) => {
        return Object.assign(acc, {
          [vaultId]: {
            vaultId: vaultId,
            inputMint: selectedAsset?.mint ?? "",
            outputMint: vaults[index].inputTokenMint,
            amount: ((depositAmount * amount) / 100 + (acc[vaultId]?.amount ?? 0)).toString(),
          },
        });
      },
      {} as Record<string, { vaultId: string; inputMint: string; outputMint: string; amount: string }>
    );
  }, [totalAllocation, depositAmount, selectedAsset]);

  const quotes = useJupiterMultipleQuotes(Object.values(quotesParams));
  console.log(quotes.map((quote) => quote.data));
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
    if (!walletAddress || !signTransaction) return;

    const lendingProgram = new LendingProgram(connection, wallet as NodeWallet);
    setIsLoading(true);
    try {
      const swapTransactions = quotes
        .filter((quote) => quote?.data?.transaction)
        .reduce(
          (acc, quote) => {
            return Object.assign(acc, {
              [quote.data?.requestId ?? ""]: VersionedTransaction.deserialize(
                Buffer.from(quote.data?.transaction ?? "", "base64")
              ),
            });
          },
          {} as Record<string, VersionedTransaction>
        );

      const depositContexts = await Promise.all(
        Object.values(quotesParams).map(async (vault) => {
          const context = await getDepositContext({
            asset: new PublicKey(vault.outputMint),
            signer: new PublicKey(walletAddress),
            connection,
          });
          return { ...vault, ...context };
        })
      );

      const depositTransactions = await Promise.all(
        depositContexts.map((context) => {
          console.log(Object.entries(context).map(([key, value]) => `${key}: ${value.toString()}`));
          return lendingProgram.makeDepositTx(
            context.vault,
            new BN(parseTokenAmount(quotesParams[context.vaultId].amount, 6).toString()),
            new PublicKey(walletAddress),
            new PublicKey(context.outputMint),
            context,
            new PublicKey(vaultIdToLp[context.vaultId as keyof typeof vaultIdToLp])
          );
        })
      );
      const blockhash = await connection.getLatestBlockhash("confirmed");
      const versionedTransactions = depositTransactions.map(
        (tx) =>
          new VersionedTransaction(
            new TransactionMessage({
              payerKey: new PublicKey(walletAddress),
              recentBlockhash: blockhash.blockhash,
              instructions: tx?.instructions ?? [],
            }).compileToV0Message()
          )
      );

      const signedTransactions = await signAllTransactions([
        ...Object.values(swapTransactions).map((transaction) => transaction),
        ...versionedTransactions,
      ]);

      const requestIds = Object.keys(swapTransactions);

      if (!signedTransactions) throw new Error("Failed to sign transactions");

      try {
        const bundle = await Promise.all(
          signedTransactions.slice(0, Object.values(swapTransactions).length).map((tx, index) =>
            jupiterSwapApi.executePost({
              executePostRequest: {
                signedTransaction: Buffer.from(tx.serialize()).toString("base64"),
                requestId: requestIds[index],
              },
            })
          )
        );
        console.log(bundle);
      } catch (error) {
        console.error("Execute error:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const txs = await Promise.all(
        signedTransactions.slice(Object.values(swapTransactions).length).map((tx) => connection.sendTransaction(tx))
      );

      console.log(txs);
      // if (!bundle) throw new Error("Failed to send transactions");

      console.log("Bundle sent:");
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, signTransaction, quotes, quotesParams, connection]);

  const isDepositDisabled =
    isLoading ||
    !depositAmount ||
    !totalAllocationArray?.length ||
    !vaults?.length ||
    !selectedAsset ||
    !walletAddress ||
    isAllocationError;

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

          {vaults.map((vault, index) => (
            <VaultAllocationCard
              allocation={totalAllocation[index]}
              depositAmount={(depositAmount / 100) * (totalAllocation[index] || 0)}
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
          {isLoading ? (
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
