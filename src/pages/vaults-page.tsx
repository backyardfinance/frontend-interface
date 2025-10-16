import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
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
import type { Strategy, Vault } from "@/utils/types";

export default function VaultsPage() {
  const { data: vaults } = useVaults();
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [slippage, setSlippage] = useState(0.1);
  const navigate = useNavigate();
  const topVaults = vaults?.slice(0, 3);

  const headers = ["Vault", "Platform", "TVL", "APY"];

  const handleAdd = (e: React.MouseEvent<HTMLDivElement>, rowIndex: number) => {
    e.stopPropagation();
    const vault = vaults?.[rowIndex];
    if (!vault) return;
    handleAddClick(e as unknown as React.MouseEvent<HTMLButtonElement>, vault);
  };

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>, vault: Vault) => {
    e.stopPropagation();
    setCurrentStrategy((prev) => {
      const newLength = (prev?.vaults?.length || 0) + 1;
      const updatedAllocation = 100 / newLength;

      return {
        vaults: [...(prev?.vaults || []), vault],
        id: prev?.id || "",
        depositAmount: prev?.depositAmount || BigInt(0),
        allocation: Array.from({ length: newLength }, () => updatedAllocation),
      };
    });
  };

  const handleRowClick = (rowIndex: number) => {
    navigate(toVaultRoute(vaults?.[rowIndex].id || ""));
  };

  const rows = useMemo(
    () => [
      ...(vaults?.map((vault) => [
        <div className="inline-flex flex-2 items-center justify-start gap-2" key={vault.id}>
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
            <div className="justify-start font-bold text-neutral-800 text-xs">{vault.title}</div>
          </div>
        </div>,
        <div className="inline-flex w-full items-center justify-start gap-2.5" key={vault.id}>
          <div className="inline-flex items-center justify-start gap-1">
            {vault.platformImage ? (
              <img alt={vault.platform} className="h-4 w-4 rounded-3xl" src={vault.platformImage} />
            ) : (
              getPlatformImage(vault.platform)
            )}
            <div className="justify-start font-normal text-neutral-800 text-xs">{vault.platform}</div>
          </div>
        </div>,
        <div className="inline-flex flex-2 items-center justify-start gap-1.5" key={vault.id}>
          <div className="justify-center text-center font-bold text-neutral-800 text-xs">{formatNumber(vault.tvl)}</div>
        </div>,
        <div className="inline-flex flex-2 items-center justify-start gap-0.5" key={vault.id}>
          <div className="flex flex-row items-center justify-start gap-0.5 font-bold text-neutral-800 text-xs">
            {vault.apy}%
            <StarsIcon className="h-3.5 w-3.5" />
          </div>
        </div>,
      ]) || []),
    ],
    [vaults]
  );
  console.log("currentStrategy?.vaults", currentStrategy?.vaults);
  if (!vaults) return <div>No vaults matching the filters</div>;

  return (
    <div className="flex select-none flex-row gap-4">
      <section className="flex-3">
        <TopVaults onAdd={handleAddClick} vaults={topVaults} />
        <Input leftIcon={<SearchIcon />} placeholder="Search for vault" />
        <Table
          action={(rowIndex: number) => (
            <div
              className="inline-flex cursor-pointer items-center justify-end"
              onClick={(e) => handleAdd(e, rowIndex)}
              role="button"
              tabIndex={0}
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </div>
          )}
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
              Add vaults from the left to <br />
              build a strategy
            </div>
          </div>
        ) : (
          <StrategySetup
            allocations={currentStrategy?.allocation || []}
            depositAmount={currentStrategy?.depositAmount}
            setAllocation={(index, amount) => {
              setCurrentStrategy((prevStrategy) => {
                const newAllocation = prevStrategy?.allocation || [];
                newAllocation[index] = amount;
                return {
                  ...prevStrategy,
                  id: prevStrategy?.id || "",
                  depositAmount: prevStrategy?.depositAmount || BigInt(0),
                  vaults: prevStrategy?.vaults || [],
                  allocation: newAllocation,
                };
              });
            }}
            setDepositAmount={(amount) => {
              setCurrentStrategy((prevStrategy) => {
                return {
                  ...prevStrategy,
                  id: prevStrategy?.id || "",
                  depositAmount: amount || BigInt(0),
                  vaults: prevStrategy?.vaults || [],
                  allocation: prevStrategy?.allocation || [],
                };
              });
            }}
            setSlippage={setSlippage}
            slippage={slippage}
            vaults={currentStrategy?.vaults || []}
          />
        )}
      </section>
    </div>
  );
}
