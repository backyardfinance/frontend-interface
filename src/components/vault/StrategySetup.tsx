import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Big } from "big.js";
import { useMemo, useState } from "react";
import { getTokenImage } from "@/assets/tokens";
import { SettingsIcon } from "@/components/icons/settings";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VaultCard } from "@/components/vault/VaultCard";

import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useTimer } from "@/hooks/useTimer";
import { cn, displayAmount } from "@/utils";
import type { Asset, Strategy } from "@/utils/types";
import { ChevronIcon } from "../icons/chevron";
import { InfoCircleIcon } from "../icons/info-circle";
import { ReloadIcon } from "../icons/reload";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface StrategySetupProps {
  currentStrategy: Strategy;
  setCurrentStrategy: (strategy: Strategy) => void;
  slippage: number;
  setSlippage: (slippage: number) => void;
}

const mockRouteSteps = [
  "Swap 800.00 USDC for 800.32 USDS",
  <>
    You will get ~<span className="font-bold text-neutral-700 text-xs">800.32 USDS</span>
  </>,
];

export type Action = "Deposit" | "Withdraw";

const slippageOptions = [0.1, 0.5, 1, 3];

const getFees = (depositFee: number, routeFee: number) => [
  { name: "Deposit fee", value: `${depositFee}%` },
  { name: "Route fee", value: `${routeFee}%` },
];

export const InputComponent = ({
  title,
  assets,
  currentValue,
  setCurrentValue,
  selectedAsset,
  setSelectedAsset,
  prices,
}: {
  title: string;
  assets: Asset[];
  currentValue: bigint;
  setCurrentValue: (value: bigint) => void;
  selectedAsset: Asset;
  setSelectedAsset: (value: Asset) => void;
  prices: Record<string, number>;
}) => {
  const assetValue = useMemo(() => {
    if (!selectedAsset) return 0;
    const price = prices?.[selectedAsset?.id || ""];
    return Number(currentValue) * price || 0;
  }, [currentValue, prices, selectedAsset]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const balance = useMemo(() => {
    return assets.find((asset) => asset.id === selectedAsset?.id)?.balance;
  }, [assets, selectedAsset]);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[14px] rounded-3xl bg-white p-[14px]">
      <div className={cn("flex w-full flex-row items-center justify-start", balance && "justify-between")}>
        <span className="font-bold text-neutral-400 text-xs">{title}</span>
        {balance && (
          <div className="flex flex-row gap-1 font-normal text-neutral-400 text-xs">
            <span className="font-bold text-neutral-800 text-xs">Balance: </span>
            {balance} {selectedAsset?.symbol}
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
          <span className="font-normal text-[9px] text-stone-300">${assetValue}</span>
        </div>
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={(value) => setSelectedAsset(assets.find((asset) => asset.id === value) as Asset)}
          value={selectedAsset?.id}
        >
          <SelectTrigger
            className={cn(
              "rounded-[8px] border-none bg-white shadow-none outline-none ring-none",
              isSelectOpen && "rounded-b-none"
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
              <SelectItem key={asset.id} value={asset.id}>
                <div className="flex flex-row items-center gap-2">
                  <div className="size-[14px]">{getTokenImage(asset.id)}</div>
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

export const StrategySetup = ({ currentStrategy, slippage, setSlippage, setCurrentStrategy }: StrategySetupProps) => {
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const { allocation, depositAmount, vaults } = currentStrategy;
  const totalAllocation = allocation?.reduce((acc, curr) => acc + curr, 0);
  const fees = getFees(0.0, 0.0);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [prices] = useState<Record<string, number>>({
    USDC: 1,
    USDS: 1,
  });

  const { address: walletAddress } = useSolanaWallet();
  const userAssets: Asset[] = [
    { id: "USDC", symbol: "USDC", price: 1, balance: 100, icon: "" },
    { id: "USDS", symbol: "USDS", price: 1, balance: 112, icon: "" },
  ];

  const averageApy = useMemo(() => {
    if (!vaults || !allocation || !vaults.length) return 0;
    return vaults.reduce((acc, curr) => acc + curr.apy, 0) / vaults.length;
  }, [allocation, vaults]);

  const estAnnualReturn = useMemo(() => {
    if (!vaults || !averageApy) return 0;
    return Number(depositAmount) * (averageApy / 100);
  }, [depositAmount, averageApy]);

  const setDepositAmount = (amount: bigint) => {
    setCurrentStrategy({
      ...currentStrategy,
      depositAmount: amount,
    });
  };

  const { sendTransaction } = useSolanaWallet();

  const setAllocation = (index: number, amount: number) => {
    const newAllocation = [...(currentStrategy.allocation || [])];
    newAllocation[index] = amount;
    setCurrentStrategy({
      ...currentStrategy,
      allocation: newAllocation,
    });
  };

  const handleRemoveVault = (id: string) => {
    if (!currentStrategy) return;

    const updatedVaults = currentStrategy.vaults?.filter((v) => v.id !== id) || [];
    const newLength = updatedVaults.length;

    const newAllocation = newLength ? Array(newLength).fill(100 / newLength) : [];

    setCurrentStrategy({
      ...currentStrategy,
      vaults: updatedVaults,
      allocation: newAllocation,
    });
  };

  const { seconds, minutes } = useTimer(10);

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border-1 border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-bold text-neutral-800 text-sm">
        Strategy setup
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

      {allocation && allocation.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="justify-start font-bold text-neutral-800 text-sm">Allocation</span>
            <div className="flex flex-row items-center font-bold text-neutral-800 text-sm">
              <span className={cn("font-bold text-sm text-zinc-400", totalAllocation > 100 && "text-pink-800")}>
                {totalAllocation}
              </span>
              /100%
            </div>
          </div>
          {vaults.map((vault, index) => (
            <VaultCard
              allocation={allocation?.[index]}
              depositAmount={(Number(depositAmount) / 100) * allocation?.[index]}
              isAllocationError={totalAllocation > 100}
              key={vault.id}
              removeVaultFromStrategy={handleRemoveVault}
              setAllocation={(amount) => setAllocation(index, amount)}
              vault={vault}
            />
          ))}
          {totalAllocation > 100 && (
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

      <div className="flex w-full flex-col justify-start gap-[3px]">
        <div className="flex flex-row items-start justify-between">
          <span className="font-bold text-neutral-700 text-xs">Total deposited</span>
          <div className="flex flex-col items-end">
            <span className="font-bold text-neutral-700 text-xs">{depositAmount} USDC</span>
            <span className="font-normal text-[9px] text-stone-300">
              ${Big(depositAmount.toString()).mul(prices.USDC).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-start justify-between">
          <span className="font-bold text-neutral-700 text-xs">Est. Annual return</span>
          <div className="flex flex-col items-end">
            <span className="font-bold text-emerald-500 text-xs">{Big(estAnnualReturn).toFixed(2)} USDC</span>
            <span className="font-normal text-[9px] text-stone-300">
              ${Big(estAnnualReturn).mul(prices.USDC).toFixed(2)}
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
          disabled={!depositAmount || allocation?.length === 0 || !vaults?.length || !selectedAsset || !walletAddress}
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
              Deposit {depositAmount} {selectedAsset?.symbol} {getTokenImage(selectedAsset?.id || "")}
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
