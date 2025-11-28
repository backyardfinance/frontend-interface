import { MinusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { VaultInfoResponse } from "@/api";
import { getPlatformImage } from "@/common/assets/platforms";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { formatMonetaryAmount } from "@/common/utils";
import type { Strategy } from "@/common/utils/types";
import { PlusIcon } from "@/icons/plus";
import { StarsIcon } from "@/icons/stars";
import { toVaultRoute } from "@/routes";
import BgCardImage from "@/vaults/assets/bg-card.webp";

type Props = {
  vaults: VaultInfoResponse[] | undefined;
  onAdd: (e: React.MouseEvent<HTMLButtonElement>, vault: VaultInfoResponse, isAdded: boolean) => void;
  currentStrategy: Strategy | null;
};

export const TopVaults: React.FC<Props> = ({ vaults, onAdd, currentStrategy }) => {
  const navigate = useNavigate();
  if (!vaults) return null;
  return (
    <div className="mb-4 flex w-full flex-row items-center justify-center gap-4">
      {vaults?.map((vault) => {
        const isAdded = currentStrategy?.vaults.find((v) => v.id === vault.id);
        return (
          <div
            className="relative flex grow-1 cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl p-4 outline outline-zinc-100 outline-offset-[-1px] transition-all duration-300 ease-in-out hover:shadow-md"
            key={vault.id}
            onClick={() => navigate(toVaultRoute(vault.id))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(toVaultRoute(vault.id));
              }
            }}
            role="button"
            style={{
              backgroundImage: `url(${BgCardImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            tabIndex={0}
          >
            <div className="absolute inset-0 bg-[#F9F9F9] opacity-50" />
            <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-[#F9F9F9] to-transparent" />

            <div className="z-10 flex flex-row items-center justify-center gap-[7px] rounded-2xl bg-white p-[8px] outline outline-zinc-100 outline-offset-[-1px]">
              <div className="relative h-[30px] w-[30px]">
                {getVaultTokenImage(vault.publicKey ?? "")}
                <div className="-right-[2px] -bottom-[2px] absolute h-[12px] w-[12px] rounded-full bg-white shadow-[0px_0px_2.0160000324249268px_0px_rgba(0,0,0,0.49)]">
                  {getPlatformImage(vault.platform)}
                </div>
              </div>
              <div className="flex flex-1 shrink-0 grow-1 flex-col items-start justify-between">
                <div className="justify-start font-bold text-base text-neutral-800 leading-none">{vault.name}</div>
                <div className="justify-start self-stretch font-normal text-xs text-zinc-500 leading-none">
                  {vault.platform}
                </div>
              </div>
              <button
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg bg-stone-50 p-2 outline outline-zinc-100 outline-offset-[-1px] transition-all duration-300 ease-in-out hover:shadow-md"
                onClick={(e) => onAdd(e, vault, !!isAdded)}
                type="button"
              >
                {!isAdded ? <PlusIcon className="h-5 w-5" /> : <MinusIcon className="h-5 w-5" stroke="#979797" />}
              </button>
            </div>

            <div className="z-10 flex flex-row items-center justify-between">
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
                    {vault.apy.toFixed(2)}%
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
