import Big from "big.js";
import { useState } from "react";
import type { UserTokenView } from "@/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { cn } from "../utils";

export const TokenInputComponent = ({
  title,
  assets,
  currentValue,
  setCurrentValue,
  selectedAsset,
  setSelectedAsset,
}: {
  title: string;
  assets: UserTokenView[];
  currentValue: number;
  setCurrentValue: (value: number) => void;
  selectedAsset: UserTokenView | null;
  setSelectedAsset: (value: UserTokenView) => void;
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[14px] rounded-3xl bg-white p-[14px]">
      <div
        className={cn("flex w-full flex-row items-center justify-start", selectedAsset?.uiAmount && "justify-between")}
      >
        <span className="font-bold text-neutral-400 text-xs">{title}</span>
        {selectedAsset?.uiAmount && (
          <div className="flex flex-row gap-1 font-normal text-neutral-400 text-xs">
            <span className="font-bold text-neutral-800 text-xs">Balance: </span>
            {Big(selectedAsset?.uiAmount.toString() || "0").toFixed(2)} {selectedAsset?.symbol}
          </div>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-between rounded-xl border border-zinc-100 bg-neutral-50 px-2 py-1.5">
        <div className="flex flex-col">
          <input
            className="w-full font-bold text-sm text-zinc-800 outline-none"
            inputMode="decimal"
            onChange={(e) => setCurrentValue(Number(e.target.value))}
            onWheel={(e) => e.currentTarget.blur()}
            type="number"
            value={currentValue.toString()}
          />
          <span className="font-normal text-[9px] text-stone-300">${selectedAsset?.amountUsd || 0}</span>
        </div>
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={(value) => setSelectedAsset(assets.find((asset) => asset.mint === value) as UserTokenView)}
          value={selectedAsset?.mint}
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
              <SelectItem key={asset.mint} value={asset.mint}>
                <div className="flex flex-row items-center gap-2">
                  <img alt={asset.symbol} className="size-3.5 rounded-full" src={asset.icon} />
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
