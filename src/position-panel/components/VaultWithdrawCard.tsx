import Big from "big.js";
import { useState } from "react";
import type { UserTokenView } from "@/api";
import { getPlatformImage } from "@/common/assets/platforms";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { Switch } from "@/common/components/ui/switch";
import { useDebounce } from "@/common/hooks/useDebounce";
import { cn } from "@/common/utils";
import { inputEnforcer } from "@/common/utils/input";
import { StarsIcon } from "@/icons/stars";
import type { WithdrawVault } from "@/strategy/context/StrategyContext";

export interface VaultWithdrawCardProps {
  assets: UserTokenView[];
  vault: WithdrawVault;
  onWithdrawAmountChange: (vaultId: string, amount: number) => void;
  onToggleActiveVault: (vaultId: string, isActive: boolean) => void;
  onWithdrawAssetChange: (vaultId: string, asset: UserTokenView) => void;
}

export const VaultWithdrawCard = ({
  assets,
  vault,
  onWithdrawAmountChange,
  onToggleActiveVault,
  onWithdrawAssetChange,
}: VaultWithdrawCardProps) => {
  const [value, setValue] = useState<string>(vault.withdrawAmount.toFixed());
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useDebounce(
    () => {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return;
      }
      onWithdrawAmountChange(vault.id, num);
    },
    1000,
    [value]
  );

  const sufficientBalance = Big(vault.withdrawAmount).gte(vault.withdrawAmount.toFixed());

  return (
    <div className="group relative flex w-full flex-col gap-2 rounded-2xl bg-white p-[14px]">
      <div className="flex grow flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="size-[17px]">{getVaultTokenImage(vault.publicKey ?? "")}</div>
            <span className="justify-center font-bold text-base text-neutral-700">{vault.name}</span>
          </div>
          <Switch checked={vault.isActive} onCheckedChange={() => onToggleActiveVault(vault.id, !vault.isActive)} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between gap-1 rounded-2xl bg-[#FBFBFB] p-[4px]">
              <div className="size-[16px]">{getPlatformImage(vault.platform)}</div>
              <span className="justify-start font-normal text-neutral-800 text-xs">{vault.platform}</span>
            </div>
            <div className="flex items-center justify-between gap-[2px] rounded-2xl bg-[#FBFBFB] p-[4px] font-bold text-neutral-500 text-xs">
              {vault.apy.toFixed(2)}%<span className="font-bold text-stone-300 text-xs">APY</span>
              <StarsIcon className="ml-1 h-3 w-3" />
            </div>
          </div>
          <div className="flex flex-row gap-1 font-normal text-neutral-400 text-xs">
            <span className="font-bold text-neutral-800 text-xs">Available: </span>
            {vault.withdrawAmount.toFixed(2)} {vault.token.symbol}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex w-full flex-row items-center justify-between rounded-xl border border-zinc-100 bg-neutral-50 px-2 py-1.5",
          !sufficientBalance && "bg-[#F4EFF1] font-bold text-[#A03152]"
        )}
      >
        <div className="flex flex-col">
          <input
            className="w-full font-bold text-sm text-zinc-800 outline-none"
            inputMode="decimal"
            onChange={(e) => {
              const value = inputEnforcer(e.target.value);
              if (value === null) {
                return;
              }
              setValue(value);
            }}
            placeholder="0"
            type="text"
            value={value}
          />
          <span className="font-normal text-[9px] text-stone-400">
            $
            {Big(value)
              .mul(vault.selectedAsset.usdPrice || 0)
              .toFixed(2) || 0}
          </span>
        </div>
        <Select
          onOpenChange={setIsSelectOpen}
          onValueChange={(value) =>
            onWithdrawAssetChange(
              vault.id,
              assets.find((asset) => `${asset.mint}-${asset.isNative}` === value) as UserTokenView
            )
          }
          value={`${vault.selectedAsset.mint}-${vault.selectedAsset.isNative}`}
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
              <SelectItem key={`${asset.mint}-${asset.isNative}`} value={`${asset.mint}-${asset.isNative}`}>
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
