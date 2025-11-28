import { useNavigate } from "react-router";
import type { VaultInfoResponse } from "@/api";
import { getPlatformImage } from "@/common/assets/platforms";
import { getTokenImage } from "@/common/assets/tokens";
import { formatNumber } from "@/common/utils";
import { PlusIcon } from "@/icons/plus";
import { StarsIcon } from "@/icons/stars";
import { toVaultRoute } from "@/routes";

type Props = {
  vault: VaultInfoResponse;
  onAdd: (e: React.MouseEvent<HTMLDivElement>, vault: VaultInfoResponse) => void;
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
          <div className="h-[27px] w-[27px] p-[3px]">{getTokenImage(vault.name)}</div>
        </div>
        <div className="inline-flex items-start justify-start gap-[0.67px]">
          <div className="justify-start font-bold text-neutral-800 text-xs">{vault.name}</div>
        </div>
      </div>
      <div className="inline-flex flex-2 items-center justify-start gap-2.5">
        <div className="inline-flex items-center justify-start gap-1">
          {getPlatformImage(vault.platform)}
          <div className="justify-start font-normal text-neutral-800 text-xs">{vault.platform}</div>
        </div>
      </div>
      <div className="inline-flex flex-2 items-center justify-start gap-1.5">
        <div className="justify-center text-center font-bold text-neutral-800 text-xs">{formatNumber(vault.tvl)}</div>
      </div>

      <div className="inline-flex flex-2 items-center justify-start gap-0.5">
        <div className="flex flex-row items-center justify-start gap-0.5 font-bold text-neutral-800 text-xs">
          {vault.apy}%
          <StarsIcon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="inline-flex items-center justify-end" onClick={(e) => onAdd(e, vault)} role="button" tabIndex={0}>
        <PlusIcon className="h-3.5 w-3.5" />
      </div>
    </button>
  );
};
