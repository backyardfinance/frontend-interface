import { useNavigate } from "react-router";
import { getPlatformImage } from "@/assets/platforms";
import { getTokenImage } from "@/assets/tokens";
import { toVaultRoute } from "@/config/routes";
import { formatNumber } from "@/utils";
import type { Vault } from "@/utils/types";
import { PlusIcon } from "../icons/plus";
import { StarsIcon } from "../icons/stars";

type Props = {
  vault: Vault;
  onAdd: (e: React.MouseEvent<HTMLButtonElement>, vault: Vault) => void;
};

export const VaultRow: React.FC<Props> = ({ vault, onAdd }) => {
  const navigate = useNavigate();
  return (
    <button
      className="relative flex min-h-[21px] w-full cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl bg-neutral-50 px-[16px] py-[13px] outline outline-zinc-300/30 outline-offset-[-1px]"
      onClick={() => navigate(toVaultRoute(vault.id))}
      type="button"
    >
      <div className="inline-flex flex-2 items-center justify-start gap-2">
        <div className="relative flex items-center justify-center">
          <div className="h-[27px] w-[27px] p-[3px]">
            {vault.vaultImage ? (
              <img alt={vault.title} className="h-full w-full rounded-[31px]" src={vault.vaultImage} />
            ) : (
              getTokenImage(vault.title)
            )}
          </div>
        </div>
        <div className="inline-flex items-start justify-start gap-[0.67px]">
          <div className="justify-start font-['Product_Sans'] font-bold text-neutral-800 text-xs">{vault.title}</div>
        </div>
      </div>
      <div className="inline-flex flex-2 items-center justify-start gap-2.5">
        <div className="inline-flex items-center justify-start gap-1">
          {vault.platformImage ? (
            <img alt={vault.platform} className="h-4 w-4 rounded-3xl" src={vault.platformImage} />
          ) : (
            getPlatformImage(vault.platform)
          )}
          <div className="justify-start font-['Product_Sans'] font-normal text-neutral-800 text-xs">
            {vault.platform}
          </div>
        </div>
      </div>
      <div className="inline-flex flex-2 items-center justify-start gap-1.5">
        <div className="justify-center text-center font-['Product_Sans'] font-bold text-neutral-800 text-xs">
          {formatNumber(vault.tvl)}
        </div>
      </div>

      <div className="inline-flex flex-2 items-center justify-start gap-0.5">
        <div className="flex flex-row items-center justify-start gap-0.5 font-['Product_Sans'] font-bold text-neutral-800 text-xs">
          {vault.apy}%
          <StarsIcon className="h-3.5 w-3.5" />
        </div>
      </div>
      <button className="inline-flex items-center justify-end" onClick={(e) => onAdd(e, vault)} type="button">
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </button>
  );
};
