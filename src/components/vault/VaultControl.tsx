import Big from "big.js";
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import type { StrategyInfoResponse, TokenInfoResponse, VaultInfoResponse } from "@/api";
import { getTokenImage } from "@/assets/tokens";
import { SettingsIcon } from "@/components/icons/settings";
import { useUserStrategies } from "@/hooks/useStrategy";
import { useTimer } from "@/hooks/useTimer";
import { useUserTokens } from "@/hooks/useUserTokens";
import { cn, formatWithPrecision } from "@/utils";
import { ChevronIcon } from "../icons/chevron";
import { ReloadIcon } from "../icons/reload";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { InputComponent } from "./StrategySetup";

const mockRouteSteps = [
  "Swap 1000.00 USDC for 1000.12 USDS via Uniswap",
  <>
    You will get ~<span className="font-bold text-neutral-700 text-xs">1000.12 USDS</span>
  </>,
];

export type Action = "Deposit" | "Withdraw";

const slippageOptions = [0.1, 0.5, 1, 3];

const getFees = (depositFee: number, routeFee: number) => [
  { name: "Deposit fee", value: `${depositFee}%` },
  { name: "Route fee", value: `${routeFee}%` },
];

export type Strategy = StrategyInfoResponse & {
  isActive: boolean;
  selectedAsset: string;
  amountWithdraw: number;
};

export const VaultControl = ({ vault }: { vault: VaultInfoResponse }) => {
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<Action>("Deposit");
  const [isWithdrawByStrategy, setIsWithdrawByStrategy] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const fees = getFees(0.0, 0.05);

  const [selectedAsset, setSelectedAsset] = useState<TokenInfoResponse | null>(null);
  const { data: userStrategies } = useUserStrategies();

  const [strategies, setStrategies] = useState<Strategy[]>(
    userStrategies?.map((strategy) => {
      return {
        ...strategy,
        isActive: true,
        selectedAsset: vault.token,
        amountWithdraw: 0,
      };
    }) || []
  );
  useEffect(() => {
    if (userStrategies) {
      setStrategies(
        userStrategies.map((strategy) => {
          return {
            ...strategy,
            isActive: true,
            selectedAsset: vault.token,
            amountWithdraw: 0,
          };
        })
      );
    }
  }, [userStrategies]);

  const { data: userAssets } = useUserTokens();

  const { seconds, minutes } = useTimer(10);

  const estAnnualReturn = useMemo(() => {
    if (!vault) return 0;
    return Number(depositAmount) * (vault.apy / 100);
  }, [depositAmount, vault.apy]);

  const selectedTokens = useMemo(() => {
    return strategies
      .filter((strategy) => strategy.isActive)
      .map((strategy) => {
        const token = userAssets?.tokens?.find((token) => token.address === strategy.selectedAsset);
        return {
          tokenId: strategy.selectedAsset,
          amount: strategy.amountWithdraw,
          token,
        };
      });
  }, [strategies]);

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border-1 border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        <Tabs onValueChange={(val) => setCurrentAction(val as Action)} value={currentAction} variant="gray">
          <TabsList>
            <TabsTrigger value="Deposit">Deposit</TabsTrigger>
            <TabsTrigger value="Withdraw">Withdraw</TabsTrigger>
          </TabsList>
        </Tabs>

        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer rounded-xl border-1 border-zinc-100 bg-white p-1.5">
              <SettingsIcon />
            </div>
          </PopoverTrigger>
          <PopoverContent align="end" asChild>
            <div className="flex min-w-[332px] flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[14px]">
              <div className="flex flex-row items-center justify-between font-bold text-base text-neutral-800">
                Slippage
                <span className="font-bold text-sm text-zinc-400">{slippage}%</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                {slippageOptions.map((option) => (
                  <button
                    className={cn(
                      "min-w-[50px] cursor-pointer rounded-xl bg-neutral-50 p-[9px] font-bold text-sm text-zinc-400",
                      option === slippage &&
                        "rounded-xl border-1 border-zinc-100 bg-neutral-50 font-bold text-sm text-zinc-800"
                    )}
                    key={option}
                    onClick={() => setSlippage(option)}
                    type="button"
                  >
                    {option}%
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {currentAction === "Withdraw" && (
        <div className="ml-[19px] flex flex-row items-center justify-between font-bold text-neutral-700 text-sm">
          Withdraw by strategy
          <Switch checked={isWithdrawByStrategy} onCheckedChange={setIsWithdrawByStrategy} />
        </div>
      )}
      {(currentAction === "Deposit" || !isWithdrawByStrategy) && (
        <InputComponent
          assets={userAssets?.tokens || []}
          currentValue={depositAmount}
          selectedAsset={selectedAsset as TokenInfoResponse}
          setCurrentValue={setDepositAmount}
          setSelectedAsset={setSelectedAsset}
          title={currentAction === "Deposit" ? "Total deposit amount" : "Total withdraw amount"}
        />
      )}
      {currentAction === "Withdraw" && isWithdrawByStrategy && (
        <div className="flex flex-col gap-2">
          {strategies?.map((strategy) => (
            <StrategyWithdrawComponent
              assets={userAssets?.tokens || []}
              key={strategy.strategyId}
              setStrategy={setStrategies}
              strategy={strategy}
            />
          ))}
        </div>
      )}

      {depositAmount > 0 && selectedAsset && (
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold text-neutral-700 text-xs">Route</span>
            <span className="font-normal text-xs text-zinc-400">{`${minutes}:${seconds}`}</span>
            <button className="cursor-pointer rounded border-1 border-zinc-100 bg-white" type="button">
              <ReloadIcon />
            </button>
          </div>
          <button
            className="cursor-pointer rounded-full border-1 border-zinc-100 bg-white p-2"
            onClick={() => setIsRouteOpen(!isRouteOpen)}
            type="button"
          >
            <ChevronIcon />
          </button>
        </div>
      )}
      {isRouteOpen && (
        <div className="mx-[20px] flex flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[13px]">
          <ol className="flex list-inside list-decimal flex-col gap-[7px] font-normal text-xs text-zinc-400">
            {mockRouteSteps.map((step) => (
              <li key={step.toString()}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="h-px w-80 rounded-2xl bg-zinc-100" />
      {currentAction === "Deposit" ? (
        <div className="flex w-full flex-col justify-start gap-[3px]">
          <div className="flex flex-row items-start justify-between">
            <span className="font-bold text-neutral-700 text-xs">Total deposited</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-neutral-700 text-xs">
                {depositAmount > 0 ? depositAmount : ""} {selectedAsset?.symbol ?? ""}
              </span>
              <span className="font-normal text-[9px] text-stone-300">
                $
                {Big(depositAmount.toString())
                  .mul(selectedAsset?.priceUsd ?? 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-start justify-between">
            <span className="font-bold text-neutral-700 text-xs">Est. Annual return</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-emerald-500 text-xs">
                {estAnnualReturn > 0 ? Big(estAnnualReturn).toFixed(2) : ""} {selectedAsset?.symbol ?? ""}
              </span>
              <span className="font-normal text-[9px] text-stone-300">
                $
                {Big(estAnnualReturn.toString())
                  .mul(selectedAsset?.priceUsd ?? 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
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
                    .mul(selectedAsset?.priceUsd ?? 0)
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
                          {token.logoURI ? (
                            <img alt={token.symbol} className="size-full" src={token.logoURI} />
                          ) : (
                            getTokenImage(token.address)
                          )}
                        </div>
                        <div className="font-normal text-xs text-zinc-500">{token.symbol}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-neutral-700 text-xs">
                          {amount} {token.symbol}
                        </span>
                        <span className="font-normal text-[9px] text-stone-300">
                          ${Big(amount.toString()).mul(token.priceUsd).toFixed(2)}
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
      <div className="flex flex-col gap-[9px] rounded-2xl border-1 border-zinc-100 bg-white">
        <Button disabled={Number(depositAmount) === 0 || !selectedAsset} size="xl" variant="tertiary">
          {currentAction === "Deposit"
            ? `Deposit ${depositAmount > 0 ? depositAmount : ""} ${selectedAsset?.symbol ?? ""}`
            : `Withdraw ${depositAmount > 0 ? depositAmount : ""} ${selectedAsset?.symbol ?? ""}`}
        </Button>
        <div className="flex flex-col gap-[7px] px-[14px] pb-[14px] font-normal text-xs text-zinc-400">
          {fees.map((fee) => (
            <div className="flex flex-row justify-between" key={fee.name}>
              <div>{fee.name}:</div>
              <div>{fee.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StrategyWithdrawComponent = ({
  assets,
  strategy,
  setStrategy,
}: {
  assets: TokenInfoResponse[];
  strategy: Strategy;
  setStrategy: Dispatch<SetStateAction<Strategy[]>>;
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const vault = strategy.vaults.find((v) => v.name === strategy.selectedAsset);

  const selectedAsset = assets.find((asset) => asset.address === strategy.selectedAsset);

  const tokenUsdValue = useMemo(() => {
    if (!selectedAsset?.priceUsd || !vault?.depositedAmount) return 0;
    return formatWithPrecision(selectedAsset?.priceUsd * vault?.depositedAmount);
  }, [selectedAsset?.priceUsd, vault?.depositedAmount]);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[14px] rounded-3xl bg-white p-[14px]">
      <div
        className={cn(
          "flex w-full flex-row items-center justify-start",
          selectedAsset?.tokenAmount.uiAmount && "justify-between"
        )}
      >
        <div className="flex flex-row items-center gap-2 font-bold text-neutral-400 text-xs">
          {strategy.strategyName}
          <Switch
            checked={strategy.isActive}
            onCheckedChange={(isActive) =>
              setStrategy((prev) => prev.map((s) => (s.strategyId === strategy.strategyId ? { ...s, isActive } : s)))
            }
          />
        </div>
        {selectedAsset?.tokenAmount.uiAmount && (
          <div className="flex flex-row gap-1 font-normal text-neutral-400 text-xs">
            <span className="font-bold text-neutral-800 text-xs">Available: </span>
            {Big(vault?.depositedAmount?.toString() || "0").toFixed(2)} {vault?.name?.toString() || ""}
          </div>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between rounded-xl border-1 border-zinc-100 bg-neutral-50 px-2 py-1.5">
        <div className="flex flex-col">
          <input
            className={cn(
              "w-full font-bold text-sm text-zinc-800 outline-none",
              !strategy.isActive && "text-zinc-400 opacity-50"
            )}
            disabled={!strategy.isActive}
            onChange={(e) =>
              setStrategy((prev) =>
                prev.map((s) =>
                  s.strategyId === strategy.strategyId ? { ...s, amountWithdraw: Number(e.target.value) } : s
                )
              )
            }
            value={strategy.amountWithdraw.toString()}
          />
          <span className="font-normal text-[9px] text-stone-300">${strategy.isActive ? tokenUsdValue : 0}</span>
        </div>
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={(value) =>
            setStrategy((prev) =>
              prev.map((s) => (s.strategyId === strategy.strategyId ? { ...s, selectedAsset: value } : s))
            )
          }
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
            {assets.map((asset) => (
              <SelectItem key={asset.address} value={asset.address}>
                <div className="flex flex-row items-center gap-2">
                  <div className="size-[14px]">
                    {asset.logoURI ? (
                      <img alt={asset.symbol} className="size-full" src={asset.logoURI} />
                    ) : (
                      getTokenImage(asset.address)
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
