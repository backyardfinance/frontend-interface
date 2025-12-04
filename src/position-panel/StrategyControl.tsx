import Big from "big.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateDepositTransactionsDtoTypeEnum, type UserTokenView } from "@/api";
import { TokenInputComponent } from "@/common/components/token-input";
import { Button } from "@/common/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { cn } from "@/common/utils";
import { displayAmount } from "@/common/utils/format";
import type { Strategy } from "@/common/utils/types";
import { InfoCircleIcon } from "@/icons/info-circle";
import { useJupiterMultipleQuotes } from "@/jupiter/queries/useJupiterSwap";
import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { RouteDisplay } from "@/position-panel/components/RouteDisplay";
import { SlippageSettings } from "@/position-panel/components/SlippageSettings";
import { SummaryRow } from "@/position-panel/components/SummaryRow";
import { VaultAllocationCard } from "@/position-panel/components/VaultAllocationCard";
import { useStrategyTransaction } from "@/position-panel/hooks/useStrategyTransaction";
import { getTotalAllocation } from "@/position-panel/utils/strategy-helpers";
import { useUserTokens } from "@/solana/hooks/useUserTokens";

interface StrategyControlProps {
  currentStrategy: Strategy;
  slippage: number;
  onDepositAmountChange: (amount: number) => void;
  onSlippageChange: (slippage: number) => void;
  onAllocationChange: (vaultId: string, amount: number) => void;
  onRemoveVault: (vaultId: string) => void;
}

export const StrategyControl = ({
  currentStrategy,
  slippage,
  onDepositAmountChange,
  onSlippageChange,
  onAllocationChange,
  onRemoveVault,
}: StrategyControlProps) => {
  const { totalAllocation, depositAmount, vaults } = currentStrategy;
  const totalAllocationArray = Object.values(totalAllocation);
  const totalAllocationEntries = Object.entries(totalAllocation);
  const totalAllocationSum = getTotalAllocation(totalAllocationArray);
  const isAllocationError = totalAllocationSum > 100;
  const [selectedAsset, setSelectedAsset] = useState<UserTokenView | null>(null);
  const [currentAction, setCurrentAction] = useState<CreateDepositTransactionsDtoTypeEnum>(
    CreateDepositTransactionsDtoTypeEnum.DEPOSIT
  );

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

        const swapAmount = (depositAmount * amount) / 100;
        const accAmount = Number(acc[vaultId]?.amount ?? 0);

        return Object.assign(acc, {
          [vaultId]: {
            vaultId: vaultId,
            inputMint: currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT ? selectedMint : vaultInputMint,
            outputMint: currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT ? vaultInputMint : selectedMint,
            amount: (swapAmount + accAmount).toFixed(),
          },
        });
      },
      {} as Record<string, { vaultId: string; inputMint: string; outputMint: string; amount: string }>
    );
  }, [depositAmount, selectedAsset?.mint, totalAllocationEntries, vaults, currentAction]);

  const sufficientBalance = Big(selectedAsset?.uiAmount.toString() || "0").gte(depositAmount);

  const quotes = useJupiterMultipleQuotes(Object.values(quotesParams), {
    enabled: sufficientBalance && Object.values(quotesParams).length > 0,
  });

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

  const { handleTransaction, isLoading, walletAddress } = useStrategyTransaction({
    quotes,
    totalAllocationEntries,
    vaults,
    selectedAsset,
    depositAmount,
  });

  const handleDepositWithdraw = useCallback(() => {
    handleTransaction(currentAction);
  }, [handleTransaction, currentAction]);

  const isDepositDisabled =
    !depositAmount ||
    totalAllocation?.length === 0 ||
    vaults?.length === 0 ||
    !selectedAsset ||
    !walletAddress ||
    isAllocationError ||
    isLoading;

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        <Tabs
          onValueChange={(val) => setCurrentAction(val as CreateDepositTransactionsDtoTypeEnum)}
          value={currentAction}
          variant="gray"
        >
          <TabsList>
            <TabsTrigger value={CreateDepositTransactionsDtoTypeEnum.DEPOSIT}>Deposit</TabsTrigger>
            <TabsTrigger value={CreateDepositTransactionsDtoTypeEnum.WITHDRAW}>Withdraw</TabsTrigger>
          </TabsList>
        </Tabs>
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

      {totalAllocation && totalAllocationArray.length > 0 && vaults?.length > 0 && (
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
          {quotes.map((quote) => {
            if (!quote.data || quote.error || !quotesParams) return null;
            return (
              <RouteDisplay
                key={quote.data.expireAt}
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
        <Button disabled={isDepositDisabled} onClick={handleDepositWithdraw} size="xl" variant="tertiary">
          {walletAddress ? (
            <>
              {currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT ? "Deposit" : "Withdraw"} {depositAmount}{" "}
              {selectedAsset?.symbol}{" "}
              {selectedAsset?.icon && (
                <img alt={selectedAsset?.symbol} className="size-[14px]" src={selectedAsset?.icon} />
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
