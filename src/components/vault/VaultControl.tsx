import { useState } from "react";
import { getTokenImage } from "@/assets/tokens";
import { SettingsIcon } from "@/components/icons/settings";
import { cn } from "@/utils";
import type { Asset } from "@/utils/types";
import { ChevronIcon } from "../icons/chevron";
import { ReloadIcon } from "../icons/reload";
import { Button } from "../ui/button";

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

export const VaultControl = () => {
  const [depositAmount, setDepositAmount] = useState<bigint>(BigInt(0));
  const [slippage, setSlippage] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<Action>("Deposit");
  const [isSlippageOpen, setIsSlippageOpen] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);

  const fees = getFees(0.0, 0.0);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [prices] = useState<Record<string, number>>({
    USDC: 1,
    USDS: 1,
  });

  const userAssets: Asset[] = [
    { id: "USDC", symbol: "USDC", price: 1, balance: 10, icon: "" },
    { id: "USDS", symbol: "USDS", price: 1, balance: 11, icon: "" },
  ]; // TODO: get user assets from backend

  const assets = [
    { id: "USDC", symbol: "USDC", price: 1, balance: 10, icon: "" },
    { id: "USDS", symbol: "USDS", price: 1, balance: 11, icon: "" },
  ].reduce(
    (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    },
    {} as Record<string, Asset>
  ); // TODO: get assets from backend

  const withdrawTokens = [
    { tokenId: "USDC", amount: 10 },
    { tokenId: "USDS", amount: 11 },
  ];

  const isMultipleTokens = withdrawTokens.length > 1;

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border-1 border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        <Tabs onValueChange={(val) => setCurrentAction(val as Action)} value={currentAction} variant="gray">
          <TabsList>
            <TabsTrigger value="Deposit">Deposit</TabsTrigger>
            <TabsTrigger value="Withdraw">Withdraw</TabsTrigger>
          </TabsList>
        </Tabs>

        <button
          className="cursor-pointer rounded-xl border-1 border-zinc-100 bg-white p-1.5"
          onClick={() => setIsSlippageOpen(!isSlippageOpen)}
          type="button"
        >
          <SettingsIcon />
        </button>
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
      {isSlippageOpen && (
        <div className="flex flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[14px]">
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
    </div>
  );
};
