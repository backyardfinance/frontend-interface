import { getPlatformImage } from "@/assets/platforms";
import { getTokenImage } from "@/assets/tokens";
import { formatNumber } from "@/utils";
import type { Vault } from "@/utils/types";
import { PlusIcon } from "../icons/plus";
import { StarsIcon } from "../icons/stars";

type Props = {
  vault: Vault;
};

export const TopVault: React.FC<Props> = ({ vault }) => {
  return (
    <div className="flex grow-1 flex-col gap-4 rounded-3xl bg-[url('/src/components/icons/card-background.png')] bg-cover bg-stone-50 bg-no-repeat p-4 outline outline-zinc-100 outline-offset-[-1px]">
      <div className="flex flex-row items-center justify-center gap-[7px] rounded-2xl bg-white p-[8px] outline outline-zinc-100 outline-offset-[-1px]">
        <div className="h-[30px] w-[30px]">
          {vault.vaultImage ? (
            <img alt={vault.title} className="h-full w-full rounded-[31px]" src={vault.vaultImage} />
          ) : (
            getTokenImage(vault.title)
          )}
          <div className="absolute right-0 bottom-0">
            {vault.platformImage ? (
              <img alt={vault.platform} className="h-4 w-4 rounded-3xl" src={vault.platformImage} />
            ) : (
              getPlatformImage(vault.platform)
            )}
          </div>
        </div>
        <div className="flex flex-1 shrink-0 grow-1 flex-col items-start justify-between">
          <div className="justify-start font-['Product_Sans'] font-bold text-base text-neutral-800 leading-none">
            {vault.title}
          </div>
          <div className="justify-start self-stretch font-['Product_Sans'] font-normal text-xs text-zinc-500 leading-none">
            {vault.platform}
          </div>
        </div>
        <div className="flex h-8 w-7 rotate-90 items-center justify-center rounded-lg bg-stone-50 p-2 outline outline-zinc-100 outline-offset-[-1px]">
          <PlusIcon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-1 flex-col items-start justify-between">
          <div className="justify-start font-['Product_Sans'] font-bold text-base text-neutral-800">
            {formatNumber(vault.tvl)}
          </div>
          <div className="w-14 justify-start font-['Product_Sans'] font-normal text-xs text-zinc-500 uppercase">
            TVL
          </div>
        </div>
        <div className="h-6 w-[2px] bg-zinc-200" />
        <div className="flex flex-1 flex-row items-center justify-center">
          <div className="flex flex-col items-start justify-between">
            <div className="flex flex-row items-center justify-start font-['Product_Sans'] font-bold text-base text-neutral-800">
              {vault.apy}%
              <StarsIcon className="ml-2 h-3.5 w-3.5" />
            </div>
            <div className="w-14 justify-start font-['Product_Sans'] font-normal text-xs text-zinc-500 uppercase">
              APY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
