import { useParams } from "react-router";
import { getTokenImage } from "@/assets/tokens";
import { InfoCircleIcon } from "@/components/icons/info-circle";
import { StarsIcon } from "@/components/icons/stars";
import { Chart } from "@/components/strategy/Chart";
import { RecentActivity } from "@/components/strategy/RecentActivity";
import { CompactHybridTooltip } from "@/components/ui/hybrid-tooltip";
import { StrategyControl } from "@/components/vault/StrategyControl";
import { useStrategyById } from "@/hooks/useStrategy";
import { formatMonetaryAmount } from "@/utils";

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
  console.log(strategy);
  const data = [
    {
      title: "My Position",
      value: `$${formatMonetaryAmount(strategy.strategyDepositedAmount)}`,
      valueComponent: <StarsIcon color="#2ED650" />,
    },
    {
      title: "APY",
      value: `${strategy.strategyApy}%`,
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
            <div className="-translate-x-1/2 -top-12 absolute left-1/2 h-24 w-24">
              {getTokenImage("USDC")}
              {/* {getTokenImage(strategy.strategy)} */}
            </div>
            <p className="text-center font-bold text-neutral-800 text-xl">{strategy.strategyId}</p>
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
          allocations={strategy.vaults.map((v) => v.depositedAmount)}
          currentStrategy={{
            id: strategy.strategyId,
            vaults: [],
            depositAmount: BigInt(strategy.strategyDepositedAmount),
            allocation: strategy.vaults.map((v) => v.depositedAmount),
          }}
          depositAmount={BigInt(strategy.strategyDepositedAmount)}
          isAllocationShown={false}
          setAllocation={() => {}}
          setCurrentStrategy={() => {}}
          setDepositAmount={() => {}}
          setSlippage={() => {}}
          slippage={0}
          vaults={[]}
        />
        {/* <div className="h-[485px] rounded-[23px] border-2 border-[#F6F6F6] border-solid bg-[#FAFAFA] px-4 pt-4 pb-6" /> */}
        <RecentActivity />
      </div>
    </section>
  );
}
