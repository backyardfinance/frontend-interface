import { useMemo } from "react";
import { useNavigate } from "react-router";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { Table } from "@/common/components/table";
import { CompactHybridTooltip } from "@/common/components/ui/hybrid-tooltip";
import { formatNumber, truncateAddress } from "@/common/utils";
import { formatUnits } from "@/common/utils/format";
import { useStrategiesPositions } from "@/dashboard/hooks/useStrategiesPositions";
import { StarsIcon } from "@/icons/stars";
import { toStrategyRoute } from "@/routes";

export const DashboardTable = () => {
  const positions = useStrategiesPositions();
  const navigate = useNavigate();
  const headers = ["Strategy ID", "Allocation", "My position", "APY"];
  console.log("positions", positions);
  const rows = useMemo(
    () =>
      positions.map((item) => [
        <span className="font-bold text-neutral-800 text-xs" key={`${item.strategyId}-id`}>
          {truncateAddress(item.strategyId)}
        </span>,
        <div className="flex items-center gap-1" key={`${item.strategyId}-allocation`}>
          {item.vaults.map((vault) => (
            <CompactHybridTooltip
              content={
                <div className="flex items-center gap-1 font-bold text-neutral-800 text-xs leading-[normal]">
                  <p>{vault.apy}%</p>
                  <p>/</p>
                  <p>{formatUnits(vault.amount.toFixed(), vault.token.decimals, 2)}</p>
                  <img alt={vault.token.symbol} className="size-2.5" src={vault.token.icon} />
                </div>
              }
              key={vault.id}
            >
              <div className="flex size-7.5 items-center justify-center rounded-full border border-[#F3F3F3] bg-white p-1">
                {getVaultTokenImage(vault.publicKey)}
              </div>
            </CompactHybridTooltip>
          ))}
        </div>,
        <div
          className="flex items-center gap-0.5 font-bold text-neutral-800 text-xs"
          key={`${item.strategyId}-position`}
        >
          ${formatNumber(item.myPositionUsd)}
          <StarsIcon className="size-3.5" color="#2ED650" />
        </div>,
        <div className="flex items-center gap-0.5 font-bold text-neutral-800 text-xs" key={`${item.strategyId}-apy`}>
          {item.strategyApy}%
          <StarsIcon className="size-3.5" />
        </div>,
      ]),
    [positions]
  );

  const handleRowClick = (rowIndex: number) => {
    const strategy = positions?.[rowIndex];
    if (!strategy) return;
    navigate(toStrategyRoute(strategy.strategyId));
  };

  return <Table handleRowClick={handleRowClick} headers={headers} rows={rows || []} />;
};
