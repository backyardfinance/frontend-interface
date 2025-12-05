import { useCallback, useState } from "react";
import { CreateDepositTransactionsDtoTypeEnum, type UserTokenView } from "@/api";
import { Button } from "@/common/components/ui/button";

import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { SummaryRow } from "@/position-panel/components/SummaryRow";
import { useStrategyTransaction } from "@/position-panel/hooks/useStrategyTransaction";

import type { WithdrawStrategy } from "@/strategy/context/StrategyContext";

interface StrategyWithdrawProps {
  currentStrategy: WithdrawStrategy;
  onDepositAmountChange: (amount: number) => void;
  onToggleActiveVault: (vaultId: string, isActive: boolean) => void;
}

export const StrategyWithdraw = ({
  currentStrategy,
  // onDepositAmountChange,
  // onToggleActiveVault,
}: StrategyWithdrawProps) => {
  const { withdrawAmount, vaults } = currentStrategy;
  const [selectedAsset] = useState<UserTokenView | null>(null);
  // const [selectedAsset, setSelectedAsset] = useState<UserTokenView | null>(null);

  const currentAction = CreateDepositTransactionsDtoTypeEnum.WITHDRAW;
  // const { userTokens } = useUserTokens();

  const { handleTransaction, isLoading, walletAddress } = useStrategyTransaction({
    quotes: [],
    totalAllocationEntries: [], //TODO: optional
    vaults,
    selectedAsset: null,
    depositAmount: withdrawAmount,
  });

  const handleDepositWithdraw = useCallback(() => {
    handleTransaction(currentAction);
  }, [handleTransaction, currentAction]);

  const isDepositDisabled = !withdrawAmount || vaults?.length === 0 || !selectedAsset || !walletAddress || isLoading;

  return (
    <>
      {/* <TokenInputComponent
        assets={userTokens.arr}
        currentValue={depositAmount}
        selectedAsset={selectedAsset}
        setCurrentValue={onDepositAmountChange}
        setSelectedAsset={setSelectedAsset}
        sufficientBalance={sufficientBalance}
        title="Total deposit amount"
      /> */}

      {/* {vaults.map((vault) => (
        <VaultAllocationCard
          allocation={totalAllocation[vault.id]}
          depositAmount={(depositAmount / 100) * (totalAllocation[vault.id] || 0)}
          isAllocationError={isAllocationError}
          key={vault.id}
          removeVaultFromStrategy={onRemoveVault}
          setAllocation={(amount) => onAllocationChange(vault.id, amount)}
          vault={vault}
        />
      ))} */}

      {/* {depositAmount > 0 && selectedAsset && quotes.length > 0 && (
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
      )} */}

      <div className="h-px w-80 rounded-2xl bg-zinc-100" />

      <div className="flex w-full flex-col justify-start gap-[3px]">
        <SummaryRow
          amount={withdrawAmount}
          label="Total withdraw"
          symbol={selectedAsset?.symbol}
          usdPrice={selectedAsset?.usdPrice}
        />
      </div>

      <div className="flex flex-col gap-[9px] rounded-2xl border border-zinc-100 bg-white">
        <Button disabled={isDepositDisabled} onClick={handleDepositWithdraw} size="xl" variant="tertiary">
          {walletAddress ? (
            <>
              Withdraw {withdrawAmount} {selectedAsset?.symbol}{" "}
              {selectedAsset?.icon && (
                <img alt={selectedAsset?.symbol} className="size-[14px]" src={selectedAsset?.icon} />
              )}
            </>
          ) : (
            "Connect wallet"
          )}
        </Button>
        <FeesDisplay depositFee={0} routeFee={0} />
      </div>
    </>
  );
};
