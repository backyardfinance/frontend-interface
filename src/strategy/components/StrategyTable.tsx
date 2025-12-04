import { useCallback } from "react";
import { useNavigate } from "react-router";
import { getPlatformImage } from "@/common/assets/platforms";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { Table } from "@/common/components/table";
import { TogglePlusMinusButton } from "@/common/components/toggle-plus-minus-button";
import { calculateWeights } from "@/common/utils/calculations";
import { formatUnits } from "@/common/utils/format";
import type { Strategy } from "@/common/utils/types";

import { toVaultRoute } from "@/routes";
import type { StrategyPosition } from "@/strategy/hooks/useStrategyPosition";
import { useStrategyContext } from "../context/StrategyContext";

type StrategyTableProps = {
  strategy: StrategyPosition;
};

export const StrategyTable = ({ strategy }: StrategyTableProps) => {
  const { depositStrategy, handleDepositToggleVault } = useStrategyContext();
  const navigate = useNavigate();

  const handleRowClick = (rowIndex: number) => {
    navigate(toVaultRoute(strategy.vaults[rowIndex].id));
  };

  const handleToggleVault = useCallback(
    (vault: Strategy["vaults"][number]) => {
      handleDepositToggleVault(vault);
    },
    [handleDepositToggleVault]
  );

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    e.stopPropagation();
    const vault = strategy?.vaults[rowIndex];
    if (!vault) return;
    handleToggleVault(vault);
  };

  const table = {
    headers: ["Markets Exposure", "Platform", "APY", "Strategy weight", "My Position"],
    rows: strategy.vaults.map((vault) => {
      return [
        <div className="inline-flex items-center justify-start gap-1.5" key={vault.id}>
          <div className="size-3">{getVaultTokenImage(vault.publicKey)}</div>
          <div className="justify-start font-bold text-neutral-800 text-sm">{vault.name}</div>
        </div>,
        <div className="inline-flex items-center justify-start gap-1.5" key={vault.id}>
          <div className="size-3">{getPlatformImage(vault.platform)}</div> {vault.platform}
        </div>,
        `${vault.apy}%`,
        <>{calculateWeights(strategy.strategyDepositedAmount, vault.amount).weightPercent.toFixed(0)}%</>,
        <div className="inline-flex items-center justify-start gap-1.5" key={vault.id}>
          <div className="justify-start font-bold text-neutral-800 text-sm">
            ${formatUnits(vault.amount.toString(), vault.token.decimals, 2)}
          </div>
        </div>,
      ];
    }),
  };
  return (
    <div>
      <Table
        action={(rowIndex: number) => {
          const isAdded = depositStrategy?.vaults.find((v) => v.id === strategy.vaults[rowIndex].id);
          return <TogglePlusMinusButton handleToggle={(e) => handleAdd(e, rowIndex)} isAdded={!!isAdded} />;
        }}
        handleRowClick={handleRowClick}
        headers={table.headers}
        rows={table.rows}
      />
    </div>
  );
};
