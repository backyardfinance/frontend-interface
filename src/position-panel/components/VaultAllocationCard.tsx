import { MinusIcon } from "lucide-react";
import type { VaultInfoResponse } from "@/api";
import { getPlatformImage } from "@/common/assets/platforms";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { cn } from "@/common/utils";
import { displayAmount } from "@/common/utils/format";
import { StarsIcon } from "@/icons/stars";

export interface VaultAllocationCardProps {
  vault: VaultInfoResponse;
  allocation?: number;
  depositAmount?: number;
  setAllocation?: (amount: number) => void;
  removeVaultFromStrategy: (vaultId: string) => void;
  isAllocationError?: boolean;
}

export const VaultAllocationCard = ({
  vault,
  allocation,
  depositAmount,
  setAllocation,
  removeVaultFromStrategy,
  isAllocationError,
}: VaultAllocationCardProps) => {
  return (
    <div className="group relative flex w-full flex-row gap-2 rounded-2xl bg-white p-[14px]">
      <div className="flex grow flex-col gap-2">
        <div className="flex flex-row items-center gap-1">
          <div className="size-[17px]">{getVaultTokenImage(vault.publicKey ?? "")}</div>
          <span className="justify-center font-bold text-base text-neutral-700">{vault.name}</span>
        </div>
        <div className="flex flex-row items-center gap-[7px]">
          <div className="flex flex-row items-center justify-between gap-1 rounded-2xl bg-[#FBFBFB] p-[4px]">
            <div className="size-[16px]">{getPlatformImage(vault.platform)}</div>
            <span className="justify-start font-normal text-neutral-800 text-xs">{vault.platform}</span>
          </div>
          <div className="flex flex-row items-center justify-between gap-[2px] rounded-2xl bg-[#FBFBFB] p-[4px] font-bold text-neutral-500 text-xs">
            {vault.apy.toFixed(2)}%<span className="font-bold text-stone-300 text-xs">APY</span>
            <StarsIcon className="ml-1 h-3 w-3" />
          </div>
        </div>
      </div>
      <div className="flex shrink flex-col items-end gap-2 transition-all duration-300 ease-in-out group-hover:translate-x-[-31px]">
        <div
          className={cn(
            "inline-flex h-[30px] items-center justify-start gap-1 rounded-xl border border-zinc-100 bg-neutral-50 px-3.5 py-1.5 transition-all duration-300 ease-in-out group-hover:opacity-80",
            isAllocationError && "bg-[#F0E8EB] text-[#A03152]"
          )}
        >
          <input
            className="max-w-[30px] font-bold text-sm outline-none"
            onChange={(e) => {
              setAllocation?.(Number(e.target.value));
            }}
            value={allocation}
          />
          <div
            className={cn(
              "justify-start font-bold text-base text-neutral-400 opacity-30",
              isAllocationError && "text-[#C7A6AE]"
            )}
          >
            %
          </div>
        </div>
        <div className="justify-start font-bold text-neutral-400 text-xs transition-all duration-300 ease-in-out group-hover:opacity-80">
          {displayAmount(depositAmount?.toString() || "0", 0, 3)} {vault.name}
        </div>
      </div>
      <button
        aria-label="Remove vault"
        className="-translate-y-1/2 absolute top-[26px] right-[14px] flex size-[23px] items-center justify-center rounded-full bg-stone-50 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100"
        onClick={() => removeVaultFromStrategy(vault.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            removeVaultFromStrategy(vault.id);
          }
        }}
        type="button"
      >
        <MinusIcon className="h-[9px] w-[9px]" />
      </button>
    </div>
  );
};
