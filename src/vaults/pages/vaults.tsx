import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { VaultInfoResponse } from "@/api";
import { getPlatformImage } from "@/common/assets/platforms";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { Table } from "@/common/components/table";
import { TogglePlusMinusButton } from "@/common/components/toggle-plus-minus-button";
import { Input } from "@/common/components/ui/input";
import { formatNumber } from "@/common/utils";
import type { Strategy } from "@/common/utils/types";
import Logo from "@/icons/backyard-logo.svg";

import PlusThickIcon from "@/icons/plus-thick.svg?react";
import { SearchIcon } from "@/icons/search";
import { StarsIcon } from "@/icons/stars";
import { StrategySetup } from "@/position-panel/StrategySetup";
import {
  removeVaultFromStrategy,
  toggleVaultInStrategy,
  updateAllocation,
  updateAmount,
} from "@/position-panel/utils/strategy-helpers";
import { toVaultRoute } from "@/routes";
import { TopVaults } from "@/vaults/components/TopVaults";
import { useVaults } from "@/vaults/queries";

export default function VaultsPage() {
  const { data: vaults } = useVaults();
  console.log(vaults);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [slippage, setSlippage] = useState(0.1);
  const navigate = useNavigate();
  const topVaults = vaults?.slice(0, 3);
  const [search, setSearch] = useState("");
  const headers = ["Vault", "Platform", "TVL", "APY"];

  const handleToggleVault = useCallback((vault: VaultInfoResponse) => {
    setCurrentStrategy((prev) => toggleVaultInStrategy(prev, vault));
  }, []);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    e.stopPropagation();
    const vault = vaults?.[rowIndex];
    if (!vault) return;
    handleToggleVault(vault);
  };

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>, vault: VaultInfoResponse) => {
    e.stopPropagation();
    handleToggleVault(vault);
  };

  const handleRowClick = (rowIndex: number) => {
    navigate(toVaultRoute(vaults?.[rowIndex].id || ""));
  };

  const handleDepositAmountChange = useCallback((amount: number) => {
    setCurrentStrategy((prev) => {
      if (!prev) return null;
      return updateAmount(prev, amount);
    });
  }, []);

  const handleAllocationChange = useCallback((vaultId: string, amount: number) => {
    setCurrentStrategy((prev) => {
      if (!prev) return null;
      return updateAllocation(prev, vaultId, amount);
    });
  }, []);

  const handleRemoveVault = useCallback((vaultId: string) => {
    setCurrentStrategy((prev) => {
      if (!prev) return null;
      return removeVaultFromStrategy(prev, vaultId);
    });
  }, []);

  const rows = useMemo(
    () => [
      ...(vaults
        ?.filter((vault) => vault.name.toLowerCase().includes(search.toLowerCase()))
        ?.map((vault) => [
          <div className="inline-flex flex-2 items-center justify-start gap-2" key={vault.id}>
            <div className="relative flex items-center justify-center">
              <div className="h-[27px] w-[27px] p-[3px]">{getVaultTokenImage(vault.publicKey ?? "")}</div>
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
              {vault.apy.toFixed(2)}%
              <StarsIcon className="h-3.5 w-3.5" />
            </div>
          </div>,
        ]) || []),
    ],
    [vaults, search]
  );

  if (!vaults) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <img alt="backyard" src={Logo} />
        <span className="shimmer text-[rgba(51,51,51,0.95)] text-base leading-normal">Loading</span>
      </div>
    );
  }

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
            return <TogglePlusMinusButton handleToggle={(e) => handleAdd(e, rowIndex)} isAdded={!!isAdded} />;
          }}
          handleRowClick={handleRowClick}
          headers={headers}
          rows={rows}
        />
      </section>
      <section className="relative flex min-w-[364px] flex-1 select-none flex-col">
        {!currentStrategy ? (
          <div className="flex grow flex-col items-center justify-center gap-8 rounded-3xl bg-neutral-50">
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
            onAllocationChange={handleAllocationChange}
            onDepositAmountChange={handleDepositAmountChange}
            onRemoveVault={handleRemoveVault}
            onSlippageChange={setSlippage}
            slippage={slippage}
          />
        )}
      </section>
    </div>
  );
}
