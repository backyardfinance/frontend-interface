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
        {strategy.strategyId}
        <div className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]">
          <ArrowIcon className="size-2 rotate-45" />
        </div>
      </Button>,
    ]),
  };

  const chartData = useMemo(() => {
    if (!vaultHistory?.length) return [];

    return vaultHistory.map((item) => {
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
  }, [vaultHistory, selectedMetric]);

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
