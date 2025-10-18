import { useMemo, useState } from "react";
import { getTokenImage } from "@/assets/tokens";
import { SettingsIcon } from "@/components/icons/settings";
import { VaultCard } from "@/components/vault/VaultCard";
import { cn } from "@/utils";
import type { Asset, Vault } from "@/utils/types";
import { ChevronIcon } from "../icons/chevron";
import { ReloadIcon } from "../icons/reload";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export interface StrategySetupProps {
  allocations?: number[];
  depositAmount: bigint;
  setAllocation: (index: number, allocation: number) => void;
  vaults: Vault[];
  slippage: number;
  setSlippage: (slippage: number) => void;
  isAllocationShown?: boolean;
  setDepositAmount: (amount: bigint) => void;
  headerTextShown?: boolean;
}

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

const InputComponent = ({
  title,
  balance,
  assets,
  currentValue,
  setCurrentValue,
  selectedAsset,
  setSelectedAsset,
  prices,
}: {
  title: string;
  balance?: string;
  assets: Asset[];
  currentValue: bigint;
  setCurrentValue: (value: bigint) => void;
  selectedAsset: Asset;
  setSelectedAsset: (value: Asset) => void;
  prices: Record<string, number>;
}) => {
  const assetValue = useMemo(() => {
    if (!selectedAsset) return 0;
    return Number(currentValue) * prices?.[selectedAsset?.id || ""] || 0;
  }, [currentValue, prices, selectedAsset]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[14px] rounded-3xl bg-white p-[14px]">
      <div className={cn("flex w-full flex-row items-center justify-start", balance && "justify-between")}>
        <span className="font-bold text-neutral-400 text-xs">{title}</span>
        {balance && (
          <div className="flex flex-row font-normal text-neutral-400 text-xs">
            <span className="font-bold text-neutral-800 text-xs">Balance</span>
            {balance}
          </div>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between rounded-xl border-1 border-zinc-100 bg-neutral-50 px-2 py-1.5">
        <div className="flex flex-col">
          <input
            className="w-full font-bold text-sm text-zinc-800 outline-none"
            onChange={(e) => setCurrentValue(BigInt(e.target.value))}
            value={currentValue.toString()}
          />
          <span className="font-normal text-[9px] text-stone-300">{assetValue}</span>
        </div>
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={(value) => setSelectedAsset(assets.find((asset) => asset.id === value) as Asset)}
          value={selectedAsset?.id}
        >
          <SelectTrigger
            className={cn(
              "rounded-3xl border-none bg-white shadow-none outline-none ring-none",
              isSelectOpen && "rounded-b-none"
            )}
          >
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "max-w-full rounded-t-none rounded-b-3xl border-none bg-white shadow-none outline-none ring-none"
            )}
            sideOffset={-4}
          >
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export const StrategySetup = ({
  allocations,
  depositAmount,
  setAllocation,
  vaults,
  slippage,
  setSlippage,
  isAllocationShown = true,
  setDepositAmount,
  headerTextShown = false,
}: StrategySetupProps) => {
  const [currentAction, setCurrentAction] = useState<Action>("Withdraw");

  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const totalAllocation = allocations?.reduce((acc, curr) => acc + curr, 0);
  const fees = getFees(0.01, 0.05);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [prices] = useState<Record<string, number>>({
    USDC: 1,
    USDS: 1,
  });

  const userAssets: Asset[] = [
    { id: "USDC", symbol: "USDC", price: 1, balance: 10, icon: "" },
    { id: "USDS", symbol: "USDS", price: 1, balance: 11, icon: "" },
  ];
  const withdrawTokens = [
    { tokenId: "USDC", amount: 10 },
    { tokenId: "USDS", amount: 11 },
  ];

  const userAssetsMap = userAssets.reduce(
    (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    },
    {} as Record<string, Asset>
  );

  const averageApy = useMemo(() => {
    return (allocations?.reduce((acc, curr) => acc + curr, 0) || vaults[0].apy) / (allocations?.length || 1);
  }, [allocations, vaults]);

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border-1 border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        {headerTextShown ? (
          " Strategy setup"
        ) : (
          <Tabs onValueChange={(val) => setCurrentAction(val as Action)} value={currentAction} variant="gray">
            <TabsList>
              <TabsTrigger value="Deposit">Deposit</TabsTrigger>
              <TabsTrigger value="Withdraw">Withdraw</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
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
      <InputComponent
        assets={userAssets}
        currentValue={depositAmount}
        prices={prices}
        selectedAsset={selectedAsset as Asset}
        setCurrentValue={setDepositAmount}
        setSelectedAsset={setSelectedAsset}
        title="Total deposit amount"
      />

      {isAllocationShown && allocations?.length && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="justify-start font-bold text-neutral-800 text-sm">Allocation</span>
            <div className="flex flex-row items-center font-bold text-neutral-800 text-sm">
              <span className="font-bold text-sm text-zinc-400">{totalAllocation}</span>
              /100%
            </div>
          </div>
          {vaults.map((vault, index) => (
            <VaultCard
              allocation={allocations?.[index]}
              depositAmount={5000}
              key={vault.id}
              setAllocation={(amount) => setAllocation(index, amount)}
              vault={vault}
            />
          ))}
        </>
      )}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <span className="font-bold text-neutral-700 text-xs">Route</span>
          <span className="font-normal text-xs text-zinc-400">12:12</span>
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
      {isRouteOpen && (
        <div className="mx-[20px] flex flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[13px]">
          <ol className="flex list-inside list-decimal flex-col gap-[7px] font-normal text-xs text-zinc-400">
            {mockRouteSteps.map((step) => (
              <li key={step.toString()}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {currentAction === "Withdraw" && <>Withdraw by strategy</>}

      <div className="h-px w-80 rounded-2xl bg-zinc-100" />
      <StrategyFooter
        assets={userAssetsMap}
        averageApy={averageApy}
        currentAction={currentAction}
        depositAmount={depositAmount}
        fees={fees}
        prices={prices}
        withdrawTokens={withdrawTokens}
      />
    </div>
  );
};

export const StrategyFooter = ({
  currentAction,
  fees,
  averageApy,
  depositAmount,
  withdrawTokens,
  assets,
  prices,
}: {
  currentAction: Action;
  fees: { name: string; value: string }[];
  averageApy: number;
  depositAmount: bigint;
  withdrawTokens: { tokenId: string; amount: number }[];
  assets: Record<string, Asset>;
  prices: Record<string, number>;
}) => {
  const isMultipleTokens = withdrawTokens.length > 1;

  return (
    <>
      {currentAction === "Deposit" ? (
        <div className="flex w-full flex-col justify-start gap-[3px]">
          <div className="flex flex-row items-start justify-between">
            <span className="font-bold text-neutral-700 text-xs">Total deposited</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-neutral-700 text-xs">1000.12 USDC</span>
              <span className="font-normal text-[9px] text-stone-300">$1000</span>
            </div>
          </div>
          <div className="flex flex-row items-start justify-between">
            <span className="font-bold text-neutral-700 text-xs">Est. Annual return</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-emerald-500 text-xs">1000.12 USDC</span>
              <span className="font-normal text-[9px] text-stone-300">$1000</span>
            </div>
          </div>
          <div className="flex flex-row items-start justify-between">
            <span className="font-bold text-neutral-700 text-xs">Avg APY</span>
            <span className="font-bold text-neutral-700 text-xs">{averageApy}%</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col justify-start gap-[3px]">
          {!isMultipleTokens ? (
            <div className="flex flex-row items-start justify-between">
              <span className="font-bold text-neutral-700 text-xs">Total to withdraw</span>
              <div className="flex flex-col items-end">
                <span className="font-bold text-neutral-700 text-xs">1000.12 USDC</span>
                <span className="font-normal text-[9px] text-stone-300">$1000</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between gap-2">
              <span className="font-bold text-neutral-700 text-xs">Tokens to withdraw</span>
              <div className="flex w-full flex-col items-start justify-between">
                {withdrawTokens.map((token) => {
                  const asset = assets[token.tokenId];
                  return (
                    <div className="flex w-full flex-row items-start justify-between" key={token.tokenId}>
                      <div className="flex flex-row items-center gap-1">
                        <div className="size-[10px]">{getTokenImage(asset.symbol)}</div>
                        <div className="font-normal text-xs text-zinc-500">{asset.symbol}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-neutral-700 text-xs">
                          {token.amount} {asset.symbol}
                        </span>
                        <span className="font-normal text-[9px] text-stone-300">
                          ${token.amount * prices[token.tokenId]}
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
        <Button size="xl" variant="tertiary">
          Deposit {depositAmount} USDC
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
    </>
  );
};
