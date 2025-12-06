import React, { useMemo } from "react";
import { Button } from "@/common/components/ui/button";
import { Separator } from "@/common/components/ui/separator";
import { cn, formatMonetaryAmount } from "@/common/utils";
import { useStrategiesPositions } from "@/dashboard/hooks/useStrategiesPositions";
import { StarsIcon } from "@/icons/stars";

export const DashboardData = ({ disabled = false }: { disabled?: boolean }) => {
  const { positions } = useStrategiesPositions();

  const summaryData = useMemo(
    () =>
      (positions ?? [])?.reduce(
        (acc, item) => {
          const deposited = acc.deposited + item.myPositionUsd;
          const weightedApySum = acc.weightedApySum + item.strategyApy * item.myPositionUsd;
          return { deposited, weightedApySum };
        },
        { deposited: 0, weightedApySum: 0 }
      ),
    [positions]
  );

  const avgAPY = summaryData.deposited > 0 ? summaryData.weightedApySum / summaryData.deposited : 0;

  const data = [
    {
      title: "My Positions",
      value: `$${formatMonetaryAmount(summaryData.deposited.toFixed(2))}`,
      icon: <StarsIcon className="h-3.5 w-3.5" color="#2ED650" />,
    },
    {
      title: "Avg APY",
      value: `${avgAPY.toFixed(2)}%`,
      icon: <StarsIcon className="h-3.5 w-3.5" />,
    },
    {
      title: "Total YARD earned",
      value: "0",
      icon: <img alt="backyard" className="h-3.5 w-3.5" src="/backyard.svg" />,
    },
  ];

  return (
    <div
      className={cn(
        "relative flex h-[115px] w-full rounded-[22px] border border-[#F7F7F7] border-solid ps-11",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="absolute top-0 left-0 size-full rounded-[22px] [background:linear-gradient(90deg,#FAFAFA_10.14%,rgba(250,250,250,0.00)_82.41%)]" />
      <div className="z-10 flex h-full flex-1 justify-between py-7.5">
        {data.map(({ title, value, icon }) => (
          <React.Fragment key={title}>
            <div className="flex flex-col" key={title}>
              <p className="font-normal text-[#828282] text-sm capitalize leading-[normal]">{title}</p>
              <p className="flex items-center gap-1 font-bold text-2xl text-neutral-800 leading-[normal]">
                {value}
                {icon}
              </p>
            </div>
            <Separator orientation="vertical" />
          </React.Fragment>
        ))}
      </div>
      <div className="relative flex w-[348px] justify-end pe-11">
        <div className="-top-0.5 pointer-events-none absolute left-4 h-[117px] w-[348px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.35)_10%,#ffffff_45%,#ffffff_100%)]" />

        <img alt="pattern" className="pointer-events-none absolute top-0 left-0 size-full" src="/pattern.webp" />
        <Button
          className="z-10 flex min-w-[164px] shrink-0 items-center gap-1 self-center rounded-[13px] border border-[#F4F4F4] border-solid py-[9px] pr-2.5 pl-3 text-[#383838] text-[11px]"
          disabled
          variant="secondary"
        >
          Claim YARD
          <img alt="backyard" className="h-2.5 w-2.5" src="/backyard.svg" />
        </Button>
      </div>
    </div>
  );
};
