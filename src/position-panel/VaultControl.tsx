import Big from "big.js";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import type { UserTokenView, VaultInfoResponse } from "@/api";
import { getTokenImage } from "@/common/assets/tokens";
import { TokenInputComponent } from "@/common/components/token-input";
import { Button } from "@/common/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { Switch } from "@/common/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { cn } from "@/common/utils";
import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { RouteDisplay } from "@/position-panel/components/RouteDisplay";
import { SlippageSettings } from "@/position-panel/components/SlippageSettings";
import { SummaryRow } from "@/position-panel/components/SummaryRow";
import {
  getSelectedTokensForWithdrawal,
  initializeWithdrawalStrategies,
  updateStrategyActiveState,
  updateStrategyAmount,
  updateStrategyAsset,
  type WithdrawalStrategy,
} from "@/position-panel/utils/withdrawal-helpers";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import { useUserStrategies } from "@/strategy/queries";

//TODO: remove mock
const mockRouteSteps: ReactNode[] = [
  "Swap 1000.00 USDC for 1000.12 USDS via Uniswap",
  <>
    You will get ~<span className="font-bold text-neutral-700 text-xs">1000.12 USDS</span>
  </>,
];

enum Action {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export const VaultControl = ({ vault }: { vault: VaultInfoResponse }) => {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<Action>(Action.Deposit);
  const [isWithdrawByStrategy, setIsWithdrawByStrategy] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<UserTokenView | null>(null);

  const { data: userStrategies } = useUserStrategies();
  const { userTokens } = useUserTokens();

  const [strategies, setStrategies] = useState<WithdrawalStrategy[]>(() =>
    initializeWithdrawalStrategies(userStrategies, vault.token)
  );

  useEffect(() => {
    if (userStrategies) {
      setStrategies(initializeWithdrawalStrategies(userStrategies, vault.token));
    }
  }, [userStrategies, vault.token]);

  const estAnnualReturn = useMemo(() => {
    if (!vault) return 0;
    return depositAmount * (vault.apy / 100);
  }, [depositAmount, vault.apy, vault]);

  const selectedTokens = useMemo(
    () => getSelectedTokensForWithdrawal(strategies, userTokens.map),
    [strategies, userTokens.map]
  );

  const handleToggleStrategy = useCallback((strategyId: string, isActive: boolean) => {
    setStrategies((prev) => updateStrategyActiveState(prev, strategyId, isActive));
  }, []);

  const handleUpdateAmount = useCallback((strategyId: string, amount: number) => {
    setStrategies((prev) => updateStrategyAmount(prev, strategyId, amount));
  }, []);

  const handleUpdateAsset = useCallback((strategyId: string, assetAddress: string) => {
    setStrategies((prev) => updateStrategyAsset(prev, strategyId, assetAddress));
  }, []);

  const sufficientBalance = Big(selectedAsset?.uiAmount.toString() || "0").gte(depositAmount);

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        <Tabs onValueChange={(val) => setCurrentAction(val as Action)} value={currentAction} variant="gray">
          <TabsList>
            <TabsTrigger value={Action.Deposit}>Deposit</TabsTrigger>
            <TabsTrigger value={Action.Withdraw}>Withdraw</TabsTrigger>
          </TabsList>
        </Tabs>
        <SlippageSettings onSlippageChange={setSlippage} slippage={slippage} />
      </div>
      {currentAction === Action.Withdraw && (
        <div className="ml-[19px] flex flex-row items-center justify-between font-bold text-neutral-700 text-sm">
          Withdraw by strategy
          <Switch checked={isWithdrawByStrategy} onCheckedChange={setIsWithdrawByStrategy} />
        </div>
      )}
      {(currentAction === Action.Deposit || !isWithdrawByStrategy) && (
        <TokenInputComponent
          assets={userTokens.arr}
          currentValue={depositAmount}
          selectedAsset={selectedAsset}
          setCurrentValue={setDepositAmount}
          setSelectedAsset={setSelectedAsset}
          sufficientBalance={sufficientBalance}
          title={currentAction === Action.Deposit ? "Total deposit amount" : "Total withdraw amount"}
        />
      )}
      {currentAction === Action.Withdraw && isWithdrawByStrategy && (
        <div className="flex flex-col gap-2">
          {strategies?.map((strategy) => (
            <StrategyWithdrawComponent
              assets={userTokens}
              key={strategy.strategyId}
              onToggleActive={handleToggleStrategy}
              onUpdateAmount={handleUpdateAmount}
              onUpdateAsset={handleUpdateAsset}
              strategy={strategy}
            />
          ))}
        </div>
      )}

      {depositAmount > 0 && selectedAsset && <RouteDisplay routeSteps={mockRouteSteps} />}

      <div className="h-px w-80 rounded-2xl bg-zinc-100" />

      {currentAction === Action.Deposit ? (
        <div className="flex w-full flex-col justify-start gap-[3px]">
          <SummaryRow
            amount={depositAmount}
            label="Total deposited"
            symbol={selectedAsset?.symbol}
            usdPrice={selectedAsset?.usdPrice}
          />
          <SummaryRow
            amount={estAnnualReturn > 0 ? Number(Big(estAnnualReturn).toFixed(2)) : 0}
            label="Est. Annual return"
            symbol={selectedAsset?.symbol}
            usdPrice={selectedAsset?.usdPrice}
            valueColor="text-emerald-500"
          />
        </div>
      ) : (
        <div className="flex w-full flex-col justify-start gap-[3px]">
          {selectedTokens.length === 1 && !isWithdrawByStrategy ? (
            <div className="flex flex-row items-start justify-between">
              <span className="font-bold text-neutral-700 text-xs">Total to withdraw</span>
              <div className="flex flex-col items-end">
                <span className="font-bold text-neutral-700 text-xs">
                  {depositAmount > 0 ? depositAmount : ""} {selectedAsset?.symbol ?? ""}
                </span>
                <span className="font-normal text-[9px] text-stone-300">
                  $
                  {Big(depositAmount?.toString() ?? "0")
                    .mul(selectedAsset?.usdPrice ?? 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between gap-2">
              <span className="font-bold text-neutral-700 text-xs">Tokens to withdraw</span>
              <div className="flex w-full flex-col items-start justify-between">
                {selectedTokens.map(({ token, amount, tokenId }) => {
                  if (!token) return null;
                  return (
                    <div className="flex w-full flex-row items-start justify-between" key={tokenId}>
                      <div className="flex flex-row items-center gap-1">
                        <div className="size-[10px]">
                          {token.icon ? (
                            <img alt={token.symbol} className="size-full" src={token.icon} />
                          ) : (
                            getTokenImage(token.mint)
                          )}
                        </div>
                        <div className="font-normal text-xs text-zinc-500">{token.symbol}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-neutral-700 text-xs">
                          {amount} {token.symbol}
                        </span>
                        <span className="font-normal text-[9px] text-stone-300">
                          ${Big(amount.toString()).mul(token.usdPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex flex-row items-start justify-between">
            <span className="font-bold text-neutral-700 text-xs">Cooldown period</span>
            <div className="flex flex-col items-end font-bold text-neutral-700 text-xs">7D</div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-[9px] rounded-2xl border border-zinc-100 bg-white">
        <Button disabled={depositAmount === 0 || !selectedAsset} size="xl" variant="tertiary">
          {currentAction === Action.Deposit
            ? `Deposit ${depositAmount > 0 ? depositAmount : ""} ${selectedAsset?.symbol ?? ""}`
            : `Withdraw ${depositAmount > 0 ? depositAmount : ""} ${selectedAsset?.symbol ?? ""}`}
        </Button>
        <FeesDisplay depositFee={0} routeFee={0.05} />
      </div>
    </div>
  );
};

const StrategyWithdrawComponent = ({
  assets,
  strategy,
  onToggleActive,
  onUpdateAmount,
  onUpdateAsset,
}: {
  assets: {
    arr: UserTokenView[];
    map: Map<string, UserTokenView>;
  };
  strategy: WithdrawalStrategy;
  onToggleActive: (strategyId: string, isActive: boolean) => void;
  onUpdateAmount: (strategyId: string, amount: number) => void;
  onUpdateAsset: (strategyId: string, assetAddress: string) => void;
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const vault = strategy.vaults.find((v) => v.name === strategy.selectedAsset);

  const selectedAsset = assets.map.get(strategy.selectedAsset);

  const tokenUsdValue = useMemo(() => {
    if (!selectedAsset?.usdPrice || !vault?.depositedAmount) return 0;
    return selectedAsset?.usdPrice * vault?.depositedAmount;
  }, [selectedAsset?.usdPrice, vault?.depositedAmount]);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[14px] rounded-3xl bg-white p-[14px]">
      <div
        className={cn("flex w-full flex-row items-center justify-start", selectedAsset?.uiAmount && "justify-between")}
      >
        <div className="flex flex-row items-center gap-2 font-bold text-neutral-400 text-xs">
          {strategy.strategyName}
          <Switch
            checked={strategy.isActive}
            onCheckedChange={(isActive) => onToggleActive(strategy.strategyId, isActive)}
          />
        </div>
        {selectedAsset?.uiAmount && (
          <div className="flex flex-row gap-1 font-normal text-neutral-400 text-xs">
            <span className="font-bold text-neutral-800 text-xs">Available: </span>
            {Big(selectedAsset?.uiAmount.toString() || "0").toFixed(2)} {selectedAsset?.symbol || ""}
          </div>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between rounded-xl border border-zinc-100 bg-neutral-50 px-2 py-1.5">
        <div className="flex flex-col">
          <input
            className={cn(
              "w-full font-bold text-sm text-zinc-800 outline-none",
              !strategy.isActive && "text-zinc-400 opacity-50"
            )}
            disabled={!strategy.isActive}
            onChange={(e) => {
              onUpdateAmount(strategy.strategyId, Number(e.target.value));
            }}
            type="number"
            value={strategy.amountWithdraw}
          />
          <span className="font-normal text-[9px] text-stone-300">
            ${strategy.isActive ? tokenUsdValue.toFixed(2) : 0}
          </span>
        </div>
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={(value) => onUpdateAsset(strategy.strategyId, value)}
          value={strategy.selectedAsset}
        >
          <SelectTrigger
            className={cn(
              "rounded-[8px] border-none bg-white shadow-none outline-none ring-none",
              isSelectOpen && "rounded-b-none",
              !strategy.isActive && "text-zinc-400 opacity-50"
            )}
          >
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "max-w-full rounded-t-none rounded-b-2xl border-none bg-white shadow-none outline-none ring-none"
            )}
            sideOffset={-4}
          >
            {assets.arr.map((asset) => (
              <SelectItem key={asset.mint} value={asset.mint}>
                <div className="flex flex-row items-center gap-2">
                  <div className="size-3.5 rounded-full">
                    {asset.icon ? (
                      <img alt={asset.symbol} className="size-full" src={asset.icon} />
                    ) : (
                      getTokenImage(asset.mint)
                    )}
                  </div>
                  {asset.symbol}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
