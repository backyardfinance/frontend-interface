import { StrategyInfoResponseStrategyStatusEnum } from "@/api";
import { CompactHybridTooltip } from "@/common/components/ui/hybrid-tooltip";
import { formatMonetaryAmount } from "@/common/utils";
import { formatUnits } from "@/common/utils/format";
import { InfoCircleIcon } from "@/icons/info-circle";

import { StarsIcon } from "@/icons/stars";
import { RecentActivity } from "@/strategy/components/RecentActivity";
import { StrategyChart } from "@/strategy/components/StrategyChart";
import { StrategyControl } from "@/strategy/components/StrategyControl";
import { StrategyTable } from "@/strategy/components/StrategyTable";
import { StrategyProvider } from "@/strategy/context/StrategyContext";
import { useStrategyPosition } from "@/strategy/hooks/useStrategyPosition";

type Props = {
  title: string;
  value: string;
  valueComponent?: React.ReactNode;
  additionalValue?: string;
};

const Item: React.FC<Props> = ({ title, value, additionalValue, valueComponent }) => {
  return (
    <div className="flex flex-col items-start gap-px">
      <p className="font-normal text-[#828282] text-xs capitalize">{title}</p>
      <div className="flex items-center gap-1">
        <p className="font-bold text-lg text-neutral-800 leading-[normal]">{value}</p>
        {valueComponent}
      </div>
      <p className="font-normal text-[#828282] text-[10px] uppercase leading-[normal]">{additionalValue}</p>
    </div>
  );
};

export default function DashboardStrategyIdPage() {
  const strategy = useStrategyPosition();

  if (!strategy) return <div>No found</div>;

  const uniquePlatforms = new Set(strategy.vaults.map((v) => v.platform)).size;
  const uniqueTokens = new Set(strategy.vaults.map((v) => v.name)).size;

  //TODO: add real recent activity
  const recentActivity = [] as {
    id: string;
    token: string;
    amount: string;
    strategy: string;
    status: string;
  }[];

  const myPosition = strategy.vaults.reduce((acc, v) => {
    const amountInUsd = Number(formatUnits(v.amount.toFixed(), v.token.decimals)) * v.token.usdPrice;
    return acc + amountInUsd;
  }, 0);

  const data = [
    {
      title: "My Position",
      value: `$${formatMonetaryAmount(myPosition.toFixed(2))}`,
      valueComponent: <StarsIcon color="#2ED650" />,
    },
    {
      title: "APY",
      value: `${strategy.strategyApy.toFixed(0)}%`,
      valueComponent: <StarsIcon />,
    },
    {
      title: "Platform Exposure",
      value: `${uniquePlatforms}`,
    },
    {
      title: "Token Exposure",
      value: `${uniqueTokens}`,
    },
  ];

  const additionalInfo = [
    {
      title: "Strategy ID",
      value: strategy.strategyId,
    },
    {
      title: "Performance fee",
      value: "0.00%",
      tooltip: "Performance fee",
    },
    {
      title: "Cooldown",
      value: "4 days",
      tooltip: "Cooldown",
    },
  ];

  return (
    <StrategyProvider strategyPosition={strategy}>
      <section className="flex h-full gap-4 py-8 md:py-10">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex h-36 gap-4">
            <div className="relative flex h-full w-48 shrink-0 flex-col justify-center gap-5 rounded-3xl bg-[#FAFAFA] p-3">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-800">
                <p className="font-bold text-7xl text-white">S</p>
              </div>
              <p className="text-center font-bold text-neutral-800 text-xl">{strategy.strategyName}</p>
            </div>
            <div className="relative flex h-full w-full items-center justify-between gap-5 rounded-3xl bg-[#FAFAFA] px-6 py-4.5">
              {data.map((el) => (
                <Item key={el.title} {...el} />
              ))}
            </div>
          </div>
          <StrategyChart strategy={strategy} />
          <StrategyTable strategy={strategy} />
          <div className="flex flex-col gap-y-4.5 rounded-[23px] border border-[rgba(214,214,214,0.26)] border-solid bg-[#FAFAFA] px-5.5 py-4.5">
            <p className="font-bold text-[22px] text-neutral-800 leading-[normal]">Additional info</p>
            <div className="flex flex-col gap-2">
              {additionalInfo.map((info) => (
                <div className="flex items-center justify-between" key={info.title}>
                  <div className="flex items-center gap-2">
                    <p className="font-normal text-[#646464] text-sm leading-[normal]">{info.title}</p>
                    {info.tooltip && (
                      <CompactHybridTooltip content={info.tooltip}>
                        <InfoCircleIcon />
                      </CompactHybridTooltip>
                    )}
                  </div>
                  <p className="font-normal text-neutral-800 text-sm leading-[normal]">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <section className="relative min-h-[396px] w-[364px]">
            {strategy.strategyStatus === StrategyInfoResponseStrategyStatusEnum.PROCESSING && (
              <div className="absolute inset-0 z-9999 flex items-center justify-center overflow-hidden rounded-3xl bg-[#2F5FA9]/5 backdrop-blur-md">
                <p className="text-center font-bold text-neutral-800 text-xl">
                  Please wait
                  <br />
                  Strategy is in progress
                </p>
              </div>
            )}
            <StrategyControl strategyPosition={strategy} />
          </section>
          <RecentActivity activity={recentActivity} />
        </div>
      </section>
    </StrategyProvider>
  );
}
