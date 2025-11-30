import { useParams } from "react-router";
import BigLogo from "@/common/assets/images/big-logo.png";
import { CompactHybridTooltip } from "@/common/components/ui/hybrid-tooltip";
import { formatMonetaryAmount, formatWithPrecision } from "@/common/utils";
import { InfoCircleIcon } from "@/icons/info-circle";
import { StarsIcon } from "@/icons/stars";
import { StrategyControl } from "@/position-panel/StrategyControl";
import { Chart } from "@/strategy/components/Chart";
import { RecentActivity } from "@/strategy/components/RecentActivity";
import { useStrategyById } from "@/strategy/queries";

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
  const { strategyId } = useParams<{ strategyId: string }>();
  const { data: strategy } = useStrategyById({ strategyId: strategyId ?? "" });
  if (!strategyId || !strategy) return <div>No found</div>;

  const uniquePlatforms = new Set(strategy.vaults.map((v) => v.platform)).size;

  const uniqueTokens = new Set(strategy.vaults.map((v) => v.name)).size;
  const recentActivity =
    strategy.strategyId === "STR-01"
      ? [
          {
            id: "1",
            token: "USDC",
            amount: "200",
            strategy: "STR-02",
            status: "Withdrawing",
          },
          {
            id: "2",
            token: "USDG",
            amount: "100",
            strategy: "STR-02",
            status: "Withdrawn",
          },
        ]
      : [
          {
            id: "1",
            token: "USDC",
            amount: "100",
            strategy: "STR-02",
            status: "Withdrawing",
          },
          {
            id: "2",
            token: "CASH",
            amount: "200",
            strategy: "STR-02",
            status: "Withdrawn",
          },
          {
            id: "3",
            token: "USDC",
            amount: "700",
            strategy: "STR-02",
            status: "Deposited",
          },
        ];
  const data = [
    {
      title: "My Position",
      value: `$${formatMonetaryAmount(strategy.strategyDepositedAmount)}`,
      valueComponent: <StarsIcon color="#2ED650" />,
    },
    {
      title: "APY",
      value: `${formatWithPrecision(strategy.strategyApy)}%`,
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
    <section className="flex h-full gap-4 py-8 md:py-10">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex h-36 gap-4">
          <div className="relative flex h-full w-48 shrink-0 flex-col justify-center gap-5 rounded-3xl bg-[#FAFAFA] p-3">
            <div className="-translate-x-1/2 -top-[0px] absolute left-1/2 h-24 w-24">
              <img alt="Big Logo" src={BigLogo} />
            </div>
            <p className="text-center font-bold text-neutral-800 text-xl">{strategy.strategyName}</p>
          </div>
          <div className="relative flex h-full w-full items-center justify-between gap-5 rounded-3xl bg-[#FAFAFA] px-6 py-4.5">
            {data.map((el) => (
              <Item key={el.title} {...el} />
            ))}
          </div>
        </div>
        <Chart strategy={strategy} />
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
      <div className="flex w-[396px] flex-col gap-6">
        <StrategyControl
          currentStrategy={{
            id: strategy.strategyId,
            vaults: [],
            depositAmount: strategy.strategyDepositedAmount,
            totalAllocation: strategy.vaults.reduce(
              (acc, v) => ({ ...acc, [v.id]: v.depositedAmount }),
              {} as Record<string, number>
            ),
          }}
          onAllocationChange={() => {}}
          onDepositAmountChange={() => {}}
          onRemoveVault={() => {}}
          onSlippageChange={() => {}}
          routeSteps={[]}
          showTabs={false}
          slippage={0}
          title="Strategy setup"
        />
        <RecentActivity activity={recentActivity} />
      </div>
    </section>
  );
}
