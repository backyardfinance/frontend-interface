import { MinusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { getPlatformImage } from "@/assets/platforms";
import { getTokenImage } from "@/assets/tokens";
import { toVaultRoute } from "@/config/routes";
import { formatMonetaryAmount } from "@/utils";
import type { Strategy, Vault } from "@/utils/types";
import { PlusIcon } from "../icons/plus";
import { StarsIcon } from "../icons/stars";

type Props = {
  vaults: Vault[] | undefined;
  onAdd: (e: React.MouseEvent<HTMLButtonElement>, vault: Vault, isAdded: boolean) => void;
  currentStrategy: Strategy | null;
};

export const TopVaults: React.FC<Props> = ({ vaults, onAdd, currentStrategy }) => {
  const navigate = useNavigate();
  if (!vaults) return null;

  return (
    <div className="mb-4 flex w-full flex-row items-center justify-center gap-4">
      {vaults?.map((vault: Vault) => {
        const isAdded = currentStrategy?.vaults.find((v) => v.id === vault.id);
        return (
          <div
            className="flex grow-1 cursor-pointer flex-col gap-4 rounded-3xl bg-[url('/src/components/icons/card-background.png')] bg-cover bg-stone-50 bg-no-repeat p-4 outline outline-zinc-100 outline-offset-[-1px]"
            key={vault.id}
            onClick={() => navigate(toVaultRoute(vault.id))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(toVaultRoute(vault.id));
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-row items-center justify-center gap-[7px] rounded-2xl bg-white p-[8px] outline outline-zinc-100 outline-offset-[-1px]">
              <div className="relative h-[30px] w-[30px]">
                {vault.vaultImage ? (
                  <img alt={vault.title} className="h-full w-full rounded-[31px]" src={vault.vaultImage} />
                ) : (
                  getTokenImage(vault.title)
                )}
                <div className="absolute right-0 bottom-0 rounded-full bg-white">
                  {vault.platformImage ? (
                    <img alt={vault.platform} className="h-4 w-4 rounded-3xl" src={vault.platformImage} />
                  ) : (
                    getPlatformImage(vault.platform)
                  )}
                </div>
              </div>
              <div className="flex flex-1 shrink-0 grow-1 flex-col items-start justify-between">
                <div className="justify-start font-bold text-base text-neutral-800 leading-none">{vault.title}</div>
                <div className="justify-start self-stretch font-normal text-xs text-zinc-500 leading-none">
                  {vault.platform}
                </div>
              </div>
              <button
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg bg-stone-50 p-2 outline outline-zinc-100 outline-offset-[-1px]"
                onClick={(e) => onAdd(e, vault, !!isAdded)}
                type="button"
              >
                {!isAdded ? <PlusIcon className="h-5 w-5" /> : <MinusIcon className="h-5 w-5" stroke="#979797" />}
              </button>
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-1 flex-col items-start justify-between">
                <div className="justify-start font-bold text-base text-neutral-800">
                  {formatMonetaryAmount(vault.tvl)}
                </div>
                <div className="w-14 justify-start font-normal text-xs text-zinc-500 uppercase">TVL</div>
              </div>
              <div className="h-6 w-[2px] bg-zinc-200" />
              <div className="flex flex-1 flex-row items-center justify-center">
                <div className="flex flex-col items-start justify-between">
                  <div className="flex flex-row items-center justify-start font-bold text-base text-neutral-800">
                    {vault.apy}%
                    <StarsIcon className="ml-2 h-3.5 w-3.5" />
                  </div>
                  <div className="w-14 justify-start font-normal text-xs text-zinc-500 uppercase">APY</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
