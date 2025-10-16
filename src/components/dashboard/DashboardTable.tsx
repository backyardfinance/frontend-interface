import { useMemo } from "react";
import { getTokenImage } from "@/assets/tokens";
import { StarsIcon } from "@/components/icons/stars";
import { Table } from "@/components/table";

const data = [
  {
    strategy: "SRT-001",
    creator: {
      name: "Morpho",
      icon: "/src/assets/images/morpho.png",
    },
    allocation: [
      {
        weight: "10",
        amount: "100",
        token: "USDC",
      },
      {
        weight: "90",
        amount: "300",
        token: "USDC",
      },
    ],
    myPosition: "$123,982.00",
    apy: "10.6",
  },
  {
    strategy: "SRT-002",
    creator: {
      name: "Morpho",
      icon: "/src/assets/images/morpho.png",
    },
    allocation: [
      {
        weight: "10",
        amount: "100",
        token: "USDC",
      },
      {
        weight: "90",
        amount: "300",
        token: "USDC",
      },
    ],
    myPosition: "$123,982.00",
    apy: "10.6",
  },
  {
    strategy: "SRT-003",
    creator: {
      name: "Morpho",
      icon: "/src/assets/images/morpho.png",
    },
    allocation: [
      {
        weight: "10",
        amount: "100",
        token: "USDC",
      },
      {
        weight: "90",
        amount: "300",
        token: "USDC",
      },
    ],
    myPosition: "$123,982.00",
    apy: "10.6",
  },
];

export const DashboardTable = () => {
  const headers = ["Strategy ID", "Creator", "Allocation", "My position", "APY"];

  const rows = useMemo(
    () =>
      data.map((item) => [
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
          {item.allocation.map((allocation) => (
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
    []
  );

  return <Table headers={headers} rows={rows} />;
};
