import { getPlatformImage } from "@/assets/platforms";
import { getTokenImage } from "@/assets/tokens";
import { StarsIcon } from "@/components/icons/stars";
import type { Vault } from "@/utils/types";

export interface VaultCardProps {
  vault: Vault;
  allocation?: number;
  depositAmount?: number;
  setAllocation?: (amount: number) => void;
}

export const VaultCard = ({ vault, allocation, depositAmount, setAllocation }: VaultCardProps) => {
  return (
    <div className="flex w-full flex-row gap-2 rounded-2xl bg-white p-[14px]">
      <div className="flex grow flex-col gap-2">
        <div className="flex flex-row items-center gap-1">
          <div className="size-[17px]">{getTokenImage(vault.title)}</div>
          <span className="justify-center font-['Product_Sans'] font-bold text-base text-neutral-700">
            {vault.title}
          </span>
        </div>
        <div className="flex flex-row items-center gap-[7px]">
          <div className="flex flex-row items-center justify-between gap-1 rounded-2xl bg-[#FBFBFB] p-[4px]">
            <div className="size-[16px]">{getPlatformImage(vault.platform)}</div>
            <span className="justify-start font-['Product_Sans'] font-normal text-neutral-800 text-xs">
              {vault.platform}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between gap-[2px] rounded-2xl bg-[#FBFBFB] p-[4px] font-['Product_Sans'] font-bold text-neutral-500 text-xs">
            {vault.apy}%<span className="font-['Product_Sans'] font-bold text-stone-300 text-xs">APY</span>
            <StarsIcon className="ml-1 h-3 w-3" />
          </div>
        </div>
      </div>
      <div className="flex shrink flex-col items-end gap-2">
        <div className="inline-flex h-[30px] items-center justify-start gap-1 rounded-xl border-1 border-zinc-100 bg-neutral-50 px-3.5 py-1.5">
          <input
            className="max-w-[30px] font-bold text-sm outline-none"
            onChange={(e) => setAllocation?.(Number(e.target.value))}
            value={allocation}
          />
          <div className="justify-start font-['Product_Sans'] font-bold text-base text-neutral-400 opacity-30">%</div>
        </div>
        <div className="justify-start font-['Product_Sans'] font-bold text-neutral-400 text-xs">
          {depositAmount} {vault.title}
        </div>
      </div>
    </div>
  );
};
