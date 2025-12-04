import { MinusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { getPlatformImage } from "@/common/assets/platforms";
import { getVaultTokenImage } from "@/common/assets/tokens";
import { Table } from "@/common/components/table";
import { CompactHybridTooltip } from "@/common/components/ui/hybrid-tooltip";
import { formatMonetaryAmount, truncateAddress } from "@/common/utils";
import { calculateWeights } from "@/common/utils/calculations";
import { formatUnits } from "@/common/utils/format";
import type { Strategy } from "@/common/utils/types";
import { InfoCircleIcon } from "@/icons/info-circle";
import { PlusIcon } from "@/icons/plus";
import PlusThickIcon from "@/icons/plus-thick.svg?react";
import { StarsIcon } from "@/icons/stars";
import { StrategyControl } from "@/position-panel/StrategyControl";
import {
  removeVaultFromStrategy,
  toggleVaultInStrategy,
  updateAllocation,
  updateAmount,
} from "@/position-panel/utils/strategy-helpers";
import { toVaultRoute } from "@/routes";
import { RecentActivity } from "@/strategy/components/RecentActivity";
import { StrategyChart } from "@/strategy/components/StrategyChart";
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
  const navigate = useNavigate();
  const strategy = useStrategyPosition();

  const [slippage, setSlippage] = useState(0.1);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);

  const handleToggleVault = useCallback((vault: Strategy["vaults"][number]) => {
    setCurrentStrategy((prev) => toggleVaultInStrategy(prev, vault));
  }, []);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    e.stopPropagation();
    const vault = strategy?.vaults[rowIndex];
    if (!vault) return;
    handleToggleVault(vault);
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

  if (!strategy) return <div>No found</div>;

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

  const handleRowClick = (rowIndex: number) => {
    navigate(toVaultRoute(strategy.vaults[rowIndex].id));
  };

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
    <section className="flex h-full gap-4 py-8 md:py-10">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex h-36 gap-4">
          <div className="relative flex h-full w-48 shrink-0 flex-col justify-center gap-5 rounded-3xl bg-[#FAFAFA] p-3">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-500">
              <p className="font-bold text-7xl text-white">S</p>
            </div>
            <p className="text-center font-bold text-neutral-800 text-xl">{truncateAddress(strategy.strategyId)}</p>
          </div>
          <div className="relative flex h-full w-full items-center justify-between gap-5 rounded-3xl bg-[#FAFAFA] px-6 py-4.5">
            {data.map((el) => (
              <Item key={el.title} {...el} />
            ))}
          </div>
        </div>
        <StrategyChart strategy={strategy} />
        <div>
          <Table
            action={(rowIndex: number) => {
              const isAdded = currentStrategy?.vaults.find((v) => v.id === strategy.vaults[rowIndex].id);
              return (
                <button
                  className="flex min-h-[27px] min-w-[27px] cursor-pointer items-center justify-center border-none bg-transparent p-0"
                  onClick={(e) => handleAdd(e, rowIndex)}
                  type="button"
                >
                  {!isAdded ? (
                    <PlusIcon className="h-3.5 w-3.5" />
                  ) : (
                    <MinusIcon className="h-3.5 w-3.5" stroke="#979797" />
                  )}
                </button>
              );
            }}
            handleRowClick={handleRowClick}
            headers={table.headers}
            rows={table.rows}
          />
        </div>
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
      <div className="flex h-fit w-[396px] flex-col gap-6">
        <section className="relative flex min-h-[500px] min-w-[364px] flex-1 select-none flex-col">
          {!currentStrategy ? (
            <div className="flex grow flex-col items-center justify-center gap-8 rounded-3xl bg-neutral-50">
              <div className="inline-flex h-12 w-12 rotate-90 items-center justify-center rounded-[64.50px] bg-neutral-200 p-3.5 outline-[0.72px] outline-white">
                <PlusThickIcon className="h-5 w-5" />
              </div>
              <div className="justify-start self-stretch text-center font-normal text-neutral-400 text-sm">
                Add strategies from the left to
                <br />
                deposit into the strategy
              </div>
            </div>
          ) : (
            <StrategyControl
              currentStrategy={currentStrategy}
              onAllocationChange={handleAllocationChange}
              onDepositAmountChange={handleDepositAmountChange}
              onRemoveVault={handleRemoveVault}
              onSlippageChange={setSlippage}
              slippage={slippage}
            />
          )}
        </section>
        <RecentActivity activity={recentActivity} />
      </div>
    </section>
  );
}
