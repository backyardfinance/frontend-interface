import { useMemo } from "react";
import { useNavigate } from "react-router";
import { getTokenImage } from "@/assets/tokens";
import { StarsIcon } from "@/components/icons/stars";
import { Table } from "@/components/table";
import { toStrategyRoute } from "@/config/routes";
import { useUserStrategies } from "@/hooks/useStrategy";
import type { BackendAllocation } from "@/utils/types";

export const DashboardTable = () => {
  const { data: strategies } = useUserStrategies();
  const navigate = useNavigate();
  const headers = ["Strategy ID", "Creator", "Allocation", "My position", "APY"];

  //TODO: remove type any
  const rows = useMemo(
    () =>
      strategies?.map((item: any) => [
        <span className="font-bold text-neutral-800 text-xs" key={`${item.strategy}-id`}>
          {item.strategy}
        </span>,
        <div className="flex items-center gap-2" key={`${item.strategy}-creator`}>
          <div className="size-6 rounded-full border border-[#E7E7E7] bg-white p-1">
            <img alt={item.creator.name} className="size-full" src={item.creator.icon} />
          </div>
          <span className="font-bold text-neutral-800 text-xs">{item.creator.name}</span>
        </div>,
        <div className="flex items-center gap-1" key={`${item.strategy}-allocation`}>
          {item.allocation.map((allocation: BackendAllocation) => (
            <div
              className="flex size-7.5 items-center justify-center rounded-full border border-[#F3F3F3] bg-white p-1"
              key={`${allocation.token}-${allocation.weight}`}
            >
              {getTokenImage(allocation.token)}
            </div>
          ))}
        </div>,
        <div className="flex items-center gap-0.5 font-bold text-neutral-800 text-xs" key={`${item.strategy}-position`}>
          {item.myPosition}
          <StarsIcon className="size-3.5" color="#2ED650" />
        </div>,
        <div className="flex items-center gap-0.5 font-bold text-neutral-800 text-xs" key={`${item.strategy}-apy`}>
          {item.apy}%
          <StarsIcon className="size-3.5" />
        </div>,
      ]),
    [strategies]
  );

  const handleRowClick = (rowIndex: number) => {
    const strategy = strategies?.[rowIndex];
    if (!strategy) return;
    navigate(toStrategyRoute(strategies?.[rowIndex].strategy));
  };

  return <Table handleRowClick={handleRowClick} headers={headers} rows={rows || []} />;
};
