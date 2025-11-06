import Big from "big.js";
import { MinusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { VaultInfoResponse } from "@/api";
import { getPlatformImage } from "@/assets/platforms";
import { getTokenImage } from "@/assets/tokens";
import { PlusIcon } from "@/components/icons/plus";
import PlusThickIcon from "@/components/icons/plus-thick.svg?react";
import { SearchIcon } from "@/components/icons/search";
import { StarsIcon } from "@/components/icons/stars";
import { Table } from "@/components/table";
import { Input } from "@/components/ui/input";
import { StrategySetup } from "@/components/vault/StrategySetup";
import { TopVaults } from "@/components/vaults/TopVaults";
import { toVaultRoute } from "@/config/routes";
import { useVaults } from "@/hooks/useVaults";
import { formatNumber } from "@/utils";
import type { Strategy } from "@/utils/types";

export default function VaultsPage() {
  const { data: vaults } = useVaults();
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [slippage, setSlippage] = useState(0.1);
  const navigate = useNavigate();
  const topVaults = vaults?.slice(0, 3);
  const [search, setSearch] = useState("");
  const headers = ["Vault", "Platform", "TVL", "APY"];

  const handleAdd = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number, isAdded: boolean) => {
    e.stopPropagation();
    const vault = vaults?.[rowIndex];
    if (!vault) return;
    handleAddClick(e as unknown as React.MouseEvent<HTMLButtonElement>, vault, isAdded);
  };

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>, vault: VaultInfoResponse, isAdded: boolean) => {
    e.stopPropagation();

    setCurrentStrategy((prev: Strategy | null) => {
      const vaults = prev?.vaults || [];
      const updatedVaults = isAdded ? vaults.filter((v) => v.id !== vault.id) : [...vaults, vault];

      const newLength = updatedVaults.length;
      const newAllocation = newLength ? Array(newLength).fill(100 / newLength) : [];

      return {
        id: prev?.id || "",
        depositAmount: prev?.depositAmount || Number(0),
        vaults: updatedVaults,
        allocation: newAllocation,
      };
    });
  };

  const handleRowClick = (rowIndex: number) => {
    navigate(toVaultRoute(vaults?.[rowIndex].id || ""));
  };

  const rows = useMemo(
    () => [
      ...(vaults
        ?.filter((vault) => vault.name.toLowerCase().includes(search.toLowerCase()))
        ?.map((vault) => [
          <div className="inline-flex flex-2 items-center justify-start gap-2" key={vault.id}>
            <div className="relative flex items-center justify-center">
              <div className="h-[27px] w-[27px] p-[3px]">{getTokenImage(vault.name)}</div>
            </div>
            <div className="inline-flex items-start justify-start gap-[0.67px]">
              <div className="justify-start font-bold text-neutral-800 text-xs">{vault.name}</div>
            </div>
          </div>,
          <div className="inline-flex w-full items-center justify-start gap-2.5" key={vault.id}>
            <div className="inline-flex items-center justify-start gap-1">
              <div className="size-4">{getPlatformImage(vault.platform)}</div>
              <div className="justify-start font-normal text-neutral-800 text-xs">{vault.platform}</div>
            </div>
          </div>,
          <div className="inline-flex flex-2 items-center justify-start gap-1.5" key={vault.id}>
            <div className="justify-center text-center font-bold text-neutral-800 text-xs">
              {formatNumber(vault.tvl)}
            </div>
          </div>,
          <div className="inline-flex flex-2 items-center justify-start gap-0.5" key={vault.id}>
            <div className="flex flex-row items-center justify-start gap-0.5 font-bold text-neutral-800 text-xs">
              {Big(vault.apy).toFixed(2)}%
              <StarsIcon className="h-3.5 w-3.5" />
            </div>
          </div>,
        ]) || []),
    ],
    [vaults, search]
  );

  if (!vaults) return <div>No vaults matching the filters</div>;

  return (
    <div className="flex select-none flex-row gap-4">
      <section className="flex-3">
        <TopVaults currentStrategy={currentStrategy} onAdd={handleAddClick} vaults={topVaults} />
        <Input
          leftIcon={<SearchIcon />}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for vault"
          value={search}
        />
        <Table
          action={(rowIndex: number) => {
            const isAdded = currentStrategy?.vaults.find((v) => v.id === vaults?.[rowIndex].id);
            return (
              <div
                className="flex min-h-[27px] min-w-[27px] cursor-pointer items-center justify-center"
                onClick={(e) => handleAdd(e, rowIndex, !!isAdded)}
                onKeyDown={(e) => handleAdd(e as unknown as React.MouseEvent<HTMLDivElement>, rowIndex, !!isAdded)}
                role="button"
                tabIndex={0}
              >
                {!isAdded ? (
                  <PlusIcon className="h-3.5 w-3.5" />
                ) : (
                  <MinusIcon className="h-3.5 w-3.5" stroke="#979797" />
                )}
              </div>
            );
          }}
          handleRowClick={handleRowClick}
          headers={headers}
          rows={rows}
        />
      </section>
      <section className="relative flex min-w-[364px] flex-1 select-none flex-col">
        {!currentStrategy ? (
          <div className="flex grow-1 flex-col items-center justify-center gap-8 rounded-3xl bg-neutral-50">
            <div className="inline-flex h-12 w-12 rotate-90 items-center justify-center rounded-[64.50px] bg-neutral-200 p-3.5 outline-[0.72px] outline-white">
              <PlusThickIcon className="h-5 w-5" />
            </div>
            <div className="justify-start self-stretch text-center font-normal text-neutral-400 text-sm">
              Add vaults from the left to
              <br />
              build a strategy
            </div>
          </div>
        ) : (
          <StrategySetup
            currentStrategy={currentStrategy}
            setCurrentStrategy={setCurrentStrategy}
            setSlippage={setSlippage}
            slippage={slippage}
          />
        )}
      </section>
    </div>
  );
}
