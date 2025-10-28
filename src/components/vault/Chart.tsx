import { useMemo, useState } from "react";
import type { VaultInfoResponse } from "@/api";
import { getTokenImage } from "@/assets/tokens";
import { ChartArea } from "@/components/charts/ChartArea";
import { Table } from "@/components/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVaultByIdWithUser, useVaultHistory } from "@/hooks/useVaults";
import { ArrowIcon } from "../icons/arrow";
import { Button } from "../ui/button";

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
};

export const Chart: React.FC<Props> = ({ vault }) => {
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
    rows: (vaultWithUser?.strategies ?? []).map((strategy) => [
      <div className="inline-flex items-center justify-start gap-1.5" key={strategy.strategyId}>
        <div className="size-3">{getTokenImage(vault.name)}</div>
        <div className="justify-start font-bold text-neutral-800 text-sm">{strategy.depositedAmount}</div>
      </div>,
      `${strategy.vaultWeight}%`,
      <div className="inline-flex items-center justify-start gap-1.5" key={strategy.strategyId}>
        <div className="justify-start font-bold text-neutral-800 text-sm">{strategy.interestEarned}</div>
        <div className="size-3">{getTokenImage(vault.name)}</div>
      </div>,
      <Button key={strategy.strategyId} size="sm" variant="white">
        <span className="overflow-ellipsis">{strategy.strategyId.slice(0, 10)}...</span>
        <div className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]">
          <ArrowIcon className="size-2 rotate-45" />
        </div>
      </Button>,
    ]),
  };

  const fillVaultHistory = () => {
    const daysToGenerate = 30; // Generate data for the last 30 days
    const mockData = [];

    // Base values from the vault
    const baseApy = vault.apy || 5.0;
    const baseTvl = vault.tvl || 100000;
    const basePrice = vault.assetPrice || 1.0;
    const baseYardReward = vaultWithUser?.myPositionUsd || 0;

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate random variations
      // APY: ±0.1
      const apyVariation = (Math.random() - 0.1) * 0.9; // -0.1 to +0.1
      const apy = baseApy + apyVariation;

      // TVL: ±1%
      const tvlVariation = (Math.random() - 0.5) * 0.9; // -0.01 to +0.01 (1%)
      const tvl = baseTvl * (1 + tvlVariation);

      // Price: ±0.5% for more stable variation
      const priceVariation = (Math.random() - 0.5) * 0.01;
      const assetPrice = basePrice * (1 + priceVariation);

      // YardReward: gradually increasing
      const yardReward = baseYardReward * (1 + ((daysToGenerate - i) / daysToGenerate) * 0.05);

      mockData.push({
        recordedAt: date.toISOString(),
        apy: Number(apy.toFixed(2)),
        tvl: Number(tvl.toFixed(2)),
        assetPrice: Number(assetPrice.toFixed(4)),
        yardReward: Number(yardReward.toFixed(2)),
      });
    }

    return mockData;
  };

  const chartData = useMemo(() => {
    const dataToUse = vaultHistory?.length ? vaultHistory : fillVaultHistory();

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
        <Table headers={table.headers} rows={table.rows} />
      </div>
    </>
  );
};
