import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import Big from "big.js";
import { useMemo, useState } from "react";
import type { TokenInfoResponse, VaultInfoResponse } from "@/api";
import { getTokenImage } from "@/assets/tokens";
import { SettingsIcon } from "@/components/icons/settings";
import { VaultCard } from "@/components/vault/VaultCard";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useUserTokens } from "@/hooks/useUserTokens";
import { cn, displayAmount } from "@/utils";
import type { Strategy } from "@/utils/types";
import { ChevronIcon } from "../icons/chevron";
import { ReloadIcon } from "../icons/reload";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { InputComponent } from "./StrategySetup";

export interface StrategySetupProps {
  allocations?: number[];
  depositAmount: number;
  setAllocation: (index: number, allocation: number) => void;
  vaults: VaultInfoResponse[];
  slippage: number;
  setSlippage: (slippage: number) => void;
  isAllocationShown?: boolean;
  setDepositAmount: (amount: number) => void;
  headerTextShown?: boolean;
  currentStrategy: Strategy;
  setCurrentStrategy: (strategy: Strategy) => void;
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

export const StrategyControl = ({
  allocations,
  depositAmount,
  setAllocation,
  vaults,
  slippage,
  setSlippage,
  setCurrentStrategy,
  isAllocationShown = true,
  setDepositAmount,
  currentStrategy,
}: StrategySetupProps) => {
  const [currentAction, setCurrentAction] = useState<Action>("Deposit");

  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const totalAllocation = allocations?.reduce((acc, curr) => acc + curr, 0);
  const fees = getFees(0.0, 0.05);
  const { address: walletAddress, sendTransaction } = useSolanaWallet();
  const [selectedAsset, setSelectedAsset] = useState<TokenInfoResponse | null>(null);
  const { data: userAssets } = useUserTokens();

  const averageApy = useMemo(() => {
    return (allocations?.reduce((acc, curr) => acc + curr, 0) || vaults[0].apy) / (allocations?.length || 1);
  }, [allocations, vaults]);

  const estAnnualReturn = useMemo(() => {
    if (!vaults || !averageApy) return 0;
    return Number(depositAmount) * (averageApy / 100);
  }, [depositAmount, averageApy]);

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
      <InputComponent
        assets={userAssets?.tokens || []}
        currentValue={depositAmount}
        selectedAsset={selectedAsset as TokenInfoResponse}
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
              removeVaultFromStrategy={(id) =>
                setCurrentStrategy({
                  ...currentStrategy,
                  vaults: currentStrategy.vaults?.filter((v) => v.id !== id) || [],
                })
              }
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
      <div className="flex w-full flex-col justify-start gap-[3px]">
        <div className="flex flex-row items-start justify-between">
          <span className="font-bold text-neutral-700 text-xs">Total deposited</span>
          <div className="flex flex-col items-end">
            <span className="font-bold text-neutral-700 text-xs">{depositAmount} USDC</span>
            <span className="font-normal text-[9px] text-stone-300">
              $
              {Big(depositAmount.toString())
                .mul(selectedAsset?.priceUsd || 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between">
          <span className="font-bold text-neutral-700 text-xs">Est. Annual return</span>
          <div className="flex flex-col items-end">
            <span className="font-bold text-emerald-500 text-xs">{Big(estAnnualReturn).toFixed(2)} USDC</span>
            <span className="font-normal text-[9px] text-stone-300">
              $
              {Big(estAnnualReturn)
                .mul(selectedAsset?.priceUsd || 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between">
          <span className="font-bold text-neutral-700 text-xs">Avg APY</span>
          <span className="font-bold text-neutral-700 text-xs">
            {displayAmount(averageApy?.toString() || "0", 0, 3)}%
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[9px] rounded-2xl border-1 border-zinc-100 bg-white">
        <Button
          disabled={!depositAmount || allocations?.length === 0 || !vaults?.length || !selectedAsset || !walletAddress}
          onClick={async () => {
            if (!walletAddress) return;
            // const data = await getQuote({
            //   walletAddress: walletAddress,
            //   deposits: [selectedAsset?.id || ""],
            // });
            const tx = new Transaction();
            tx.add(
              new TransactionInstruction({
                keys: [],
                programId: new PublicKey("9J4gV4TL8EifN1PJGtysh1wp4wgzYoprZ4mYo8kS2PSv"),
                data: Buffer.from([]),
              })
            );
            sendTransaction(tx);
            // console.log(data);
          }}
          size="xl"
          variant="tertiary"
        >
          {walletAddress ? (
            <>
              {" "}
              Deposit {depositAmount} {selectedAsset?.symbol}{" "}
              {selectedAsset?.logoURI ? (
                <img alt={selectedAsset?.symbol} className="size-full" src={selectedAsset?.logoURI} />
              ) : (
                getTokenImage(selectedAsset?.address || "")
              )}
            </>
          ) : (
            "Connect wallet"
          )}
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
