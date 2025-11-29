import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import type { UserTokenView } from "@/api";
import { TokenInputComponent } from "@/common/components/token-input";
import { Button } from "@/common/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { cn, displayAmount } from "@/common/utils";
import type { Strategy } from "@/common/utils/types";
import { InfoCircleIcon } from "@/icons/info-circle";
import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { RouteDisplay } from "@/position-panel/components/RouteDisplay";
import { SlippageSettings } from "@/position-panel/components/SlippageSettings";
import { SummaryRow } from "@/position-panel/components/SummaryRow";
import { VaultAllocationCard } from "@/position-panel/components/VaultAllocationCard";
import { getTotalAllocation } from "@/position-panel/utils/strategy-helpers";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useUserTokens } from "@/solana/hooks/useUserTokens";

type Action = "Deposit" | "Withdraw";

interface StrategyControlProps {
  currentStrategy: Strategy;
  onDepositAmountChange: (amount: number) => void;
  onAllocationChange: (index: number, amount: number) => void;
  onRemoveVault: (vaultId: string) => void;
  slippage: number;
  onSlippageChange: (slippage: number) => void;
  routeSteps?: ReactNode[];
  showTabs?: boolean;
  title?: string;
}

export const StrategyControl = ({
  currentStrategy,
  onDepositAmountChange,
  onAllocationChange,
  onRemoveVault,
  slippage,
  onSlippageChange,
  routeSteps,
  showTabs = false,
  title = "Strategy setup",
}: StrategyControlProps) => {
  const { allocation, depositAmount, vaults } = currentStrategy;
  const [currentAction, setCurrentAction] = useState<Action>("Deposit");
  const [selectedAsset, setSelectedAsset] = useState<UserTokenView | null>(null);

  const { address: walletAddress, sendTransaction } = useSolanaWallet();
  const { userTokens } = useUserTokens();

  const totalAllocation = getTotalAllocation(allocation);
  const isAllocationError = totalAllocation > 100;

  // Calculate average APY based on allocation
  const averageApy = useMemo(() => {
    if (!vaults?.length) return 0;
    if (!allocation?.length) {
      return vaults.reduce((acc, curr) => acc + curr.apy, 0) / vaults.length;
    }
    return allocation.reduce((acc, curr, idx) => acc + (vaults[idx]?.apy || 0) * (curr / 100), 0);
  }, [allocation, vaults]);

  const estAnnualReturn = useMemo(() => {
    if (!averageApy) return 0;
    return depositAmount * (averageApy / 100);
  }, [depositAmount, averageApy]);

  const handleDeposit = useCallback(async () => {
    if (!walletAddress) return;

    const tx = new Transaction();
    tx.add(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey("9J4gV4TL8EifN1PJGtysh1wp4wgzYoprZ4mYo8kS2PSv"),
        data: Buffer.from([]),
      })
    );
    await sendTransaction(tx);
  }, [walletAddress, sendTransaction]);

  const isDepositDisabled =
    !depositAmount || !allocation?.length || !vaults?.length || !selectedAsset || !walletAddress || isAllocationError;

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      {/* Header */}
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        {showTabs ? (
          <Tabs onValueChange={(val) => setCurrentAction(val as Action)} value={currentAction} variant="gray">
            <TabsList>
              <TabsTrigger value="Deposit">Deposit</TabsTrigger>
              <TabsTrigger value="Withdraw">Withdraw</TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <span>{title}</span>
        )}
        <SlippageSettings onSlippageChange={onSlippageChange} slippage={slippage} />
      </div>

      {/* Token Input */}
      <TokenInputComponent
        assets={userTokens.arr}
        currentValue={depositAmount}
        selectedAsset={selectedAsset}
        setCurrentValue={onDepositAmountChange}
        setSelectedAsset={setSelectedAsset}
        title="Total deposit amount"
      />

      {/* Allocation Section */}
      {allocation && allocation.length > 0 && vaults?.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="justify-start font-bold text-neutral-800 text-sm">Allocation</span>
            <div className="flex flex-row items-center font-bold text-neutral-800 text-sm">
              <span className={cn("font-bold text-sm text-zinc-400", isAllocationError && "text-pink-800")}>
                {totalAllocation}
              </span>
              /100%
            </div>
          </div>

          {vaults.map((vault, index) => (
            <VaultAllocationCard
              allocation={allocation[index]}
              depositAmount={(depositAmount / 100) * (allocation[index] || 0)}
              isAllocationError={isAllocationError}
              key={vault.id}
              removeVaultFromStrategy={onRemoveVault}
              setAllocation={(amount) => onAllocationChange(index, amount)}
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

      {/* Route Display */}
      {depositAmount > 0 && selectedAsset && <RouteDisplay routeSteps={routeSteps} />}

      {/* Divider */}
      <div className="h-px w-80 rounded-2xl bg-zinc-100" />

      {/* Summary */}
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

      {/* Action Button */}
      <div className="flex flex-col gap-[9px] rounded-2xl border border-zinc-100 bg-white">
        <Button disabled={isDepositDisabled} onClick={handleDeposit} size="xl" variant="tertiary">
          {walletAddress ? (
            <>
              Deposit {depositAmount} {selectedAsset?.symbol}{" "}
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
