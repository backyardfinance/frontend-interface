import { useMemo } from "react";
import { useNavigate } from "react-router";
import { getTokenImage } from "@/assets/tokens";
import { StarsIcon } from "@/components/icons/stars";
import { Table } from "@/components/table";
import { toStrategyRoute } from "@/config/routes";
import { useUserStrategies } from "@/hooks/useStrategy";
import { formatNumber } from "@/utils";

export const DashboardTable = () => {
  const { data: strategies } = useUserStrategies();
  const navigate = useNavigate();
  const headers = ["Strategy ID", "Allocation", "My position", "APY"];

  const rows = useMemo(
    () =>
      strategies?.map((item) => [
        <span className="font-bold text-neutral-800 text-xs" key={`${item.strategyId}-id`}>
          {item.strategyId}
        </span>,
        <div className="flex items-center gap-1" key={`${item.strategyId}-allocation`}>
          {item.vaults.map((vault) => (
            <div
              className="flex size-7.5 items-center justify-center rounded-full border border-[#F3F3F3] bg-white p-1"
              key={`${vault.id}-${vault.depositedAmount}`}
            >
              {getTokenImage(vault.name)}
            </div>
          ))}
        </div>,
        <div
          className="flex items-center gap-0.5 font-bold text-neutral-800 text-xs"
          key={`${item.strategyId}-position`}
        >
          {formatNumber(item.strategyDepositedAmount)}
          <StarsIcon className="size-3.5" color="#2ED650" />
        </div>,
        <div className="flex items-center gap-0.5 font-bold text-neutral-800 text-xs" key={`${item.strategyId}-apy`}>
          {item.strategyApy}%
          <StarsIcon className="size-3.5" />
        </div>,
      ]),
    [strategies]
  );

  const handleRowClick = (rowIndex: number) => {
    const strategy = strategies?.[rowIndex];
    if (!strategy) return;
    navigate(toStrategyRoute(strategies?.[rowIndex].strategyId));
  };

  return <Table handleRowClick={handleRowClick} headers={headers} rows={rows || []} />;
};
