import { useMemo, useState } from "react";
import { Link } from "react-router";
import type { UserTokenView, VaultInfoResponse } from "@/api";
import { ChartArea } from "@/common/components/charts/ChartArea";
import { Table } from "@/common/components/table";
import { Button } from "@/common/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { formatUnits } from "@/common/utils/format";
import { ArrowIcon } from "@/icons/arrow";
import { toStrategyRoute } from "@/routes";
import { useVaultByIdWithUser, useVaultHistory } from "@/vaults/queries";

type ChartCategory = "overview" | "position";
type OverviewMetricType = "apy" | "tvl" | "price";
type PositionMetricType = "performance" | "apy";

type MetricType = OverviewMetricType | PositionMetricType;

const MetricMap: Record<ChartCategory, MetricType[]> = {
  overview: ["apy", "tvl", "price"],
  position: ["performance", "apy"],
};

type Props = {
  vault: VaultInfoResponse;
  token: UserTokenView;
};

export const Chart: React.FC<Props> = ({ vault, token }) => {
  const { data: vaultHistory } = useVaultHistory(vault.id);
  const { data: vaultWithUser } = useVaultByIdWithUser(vault.id);

  const [selectedCategory, setSelectedCategory] = useState<ChartCategory>("overview");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("apy");
  const handleCategoryChange = (val: string) => {
    const newCategory = val as ChartCategory;
    setSelectedCategory(newCategory);
    setSelectedMetric(MetricMap[newCategory][0]);
  };

  const table = {
    headers: ["Deposited", "Vault weight", "Interest earned", "Parent Strategy"],
    rows: vaultWithUser?.strategies?.map((strategy) => [
      <div className="flex flex-col items-start justify-between" key={strategy.strategyId}>
        <div className="inline-flex items-center justify-start gap-1.5" key={strategy.strategyId}>
          <img alt={token.symbol} className="size-3" src={token.icon} />
          <div className="justify-start font-bold text-neutral-800 text-sm">
            {formatUnits(strategy.depositedAmount.toFixed(), token.decimals)}
          </div>
        </div>
        <div className="w-16 justify-start font-normal text-xs text-zinc-500 uppercase">
          ${formatUnits(strategy.depositedAmount.toFixed(), token.decimals)}
        </div>
      </div>,
      `${strategy.vaultWeight * 100}%`,
      <div className="inline-flex items-center justify-start gap-1.5" key={strategy.strategyId}>
        <div className="justify-start font-bold text-neutral-800 text-sm">{strategy.interestEarned.toFixed(2)}</div>
        <img alt={token.symbol} className="size-3" src={token.icon} />
      </div>,

      <Button asChild key={strategy.strategyId} size="sm" variant="white">
        <Link to={toStrategyRoute(strategy.strategyId)}>
          <span className="overflow-ellipsis">{strategy.strategyId.slice(0, 10)}...</span>
          <div className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]">
            <ArrowIcon className="size-2 rotate-45" />
          </div>
        </Link>
      </Button>,
    ]),
  };

  const fillVaultHistory = (variant: "1" | "2") => {
    const mockData = [];

    // Base values from the vault
    const baseApy = vault.apy || 5.0;
    const baseTvl = vault.tvl || 100000;
    const basePrice = vault.assetPrice || 1.0;

    // Yard reward exact values: 0, 200, 202.94, 302.94

    const yardRewardValues = variant === "1" ? [0, 200, 202.94, 302.94] : [0, 200, 202.94, 202.94];
    const daysApart = 10; // Days between each data point

    for (let i = 0; i < yardRewardValues.length; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (yardRewardValues.length - 1 - i) * daysApart);

      // Generate random variations for each point
      // APY: ±0.1
      const apyVariation = (Math.random() - 0.5) * 0.2; // -0.1 to +0.1
      const apy = baseApy + apyVariation;

      // TVL: ±1%
      const tvlVariation = (Math.random() - 0.5) * 0.02; // -0.01 to +0.01 (1%)
      const tvl = baseTvl * (1 + tvlVariation);

      // Price: ±0.5% for more stable variation
      const priceVariation = (Math.random() - 0.5) * 0.01;
      const assetPrice = basePrice * (1 + priceVariation);

      mockData.push({
        recordedAt: date.toISOString(),
        apy: Number(apy.toFixed(2)),
        tvl: Number(tvl.toFixed(2)),
        assetPrice: Number(assetPrice.toFixed(4)),
        yardReward: yardRewardValues[i],
      });
    }

    return mockData;
  };

  const chartData = useMemo(() => {
    const dataToUse = fillVaultHistory(vaultHistory?.length ? "1" : "2");

    if (!dataToUse.length) return [];

    return dataToUse.map((item) => {
      const date = new Date(item.recordedAt).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      });

      switch (selectedMetric) {
        case "apy":
          return { date, value: item.apy };
        case "tvl":
          return { date, value: item.tvl };
        case "price":
          return { date, value: item.assetPrice };
        case "performance":
          return { date, value: item.yardReward };
        default:
          return { date, value: 0 };
      }
    });
  }, [vaultHistory, selectedMetric, vault, vaultWithUser]);

  const valueStat = useMemo(() => {
    if (!chartData.length) return 0;
    const values = chartData.map((d) => d.value);

    switch (selectedMetric) {
      case "apy":
        return vault.apy;
      case "price":
        return values.reduce((a, b) => a + b, 0) / values.length;
      case "tvl":
        return values.reduce((a, b) => a + b, 0);
      case "performance":
        return values[values.length - 1];
      default:
        return 0;
    }
  }, [chartData, selectedMetric]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Tabs onValueChange={handleCategoryChange} value={selectedCategory}>
          <TabsList>
            <TabsTrigger value="overview">Vault Overview</TabsTrigger>
            <TabsTrigger value="position">Your Position</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs onValueChange={(val) => setSelectedMetric(val as MetricType)} value={selectedMetric} variant="black">
          <TabsList>
            {MetricMap[selectedCategory].map((metric) => (
              <TabsTrigger key={metric} value={metric}>
                {metric.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="w-full rounded-[23px] border border-[rgba(214,214,214,0.26)] border-solid bg-[#FAFAFA]">
        <ChartArea
          chartConfig={{
            value: {
              label: selectedMetric.toUpperCase(),
              color: "var(--chart-1)",
            },
          }}
          chartData={chartData.map((d) => ({
            date: d.date,
            value: d.value,
          }))}
          title={selectedMetric.toUpperCase()}
          value={
            selectedMetric === "apy"
              ? `${valueStat.toFixed(2)}%`
              : selectedMetric === "price"
                ? `$${valueStat.toFixed(2)}`
                : valueStat.toLocaleString()
          }
          valueTooltip={selectedMetric.toUpperCase()}
        />
      </div>
      <div>
        <Table headers={table.headers} rows={table?.rows ?? []} />
      </div>
    </>
  );
};
