import { useState } from "react";
import type { VaultInfoResponse } from "@/api";
import { getTokenImage } from "@/assets/tokens";
import { ChartArea } from "@/components/charts/ChartArea";
import { Table } from "@/components/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [selectedCategory, setSelectedCategory] = useState<ChartCategory>("overview");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("apy");

  const handleCategoryChange = (val: string) => {
    const newCategory = val as ChartCategory;
    setSelectedCategory(newCategory);
    setSelectedMetric(MetricMap[newCategory][0]);
  };

  const positions = [
    {
      id: "1",
      deposited: "100,234.23",
      vaultWeight: "87%",
      interestEarned: "1234.42",
      parentStrategy: "Hylo",
    },
    {
      id: "2",
      deposited: "100,234.23",
      vaultWeight: "87%",
      interestEarned: "1234.42",
      parentStrategy: "STR-01",
    },
  ];

  const table = {
    headers: ["Deposited", "Vault weight", "Interest earned", "Parent Strategy"],
    rows: positions.map((position) => [
      <div className="inline-flex items-center justify-start gap-1.5" key={position.id}>
        <div className="size-3">{getTokenImage(vault.name)}</div>
        <div className="justify-start font-bold text-neutral-800 text-sm">{position.deposited}</div>
      </div>,
      position.vaultWeight,
      <div className="inline-flex items-center justify-start gap-1.5" key={position.id}>
        <div className="justify-start font-bold text-neutral-800 text-sm">{position.interestEarned}</div>
        <div className="size-3">{getTokenImage(vault.name)}</div>
      </div>,
      <Button key={position.id} size="sm" variant="white">
        {position.parentStrategy}
        <div className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]">
          <ArrowIcon className="size-2 rotate-45" />
        </div>
      </Button>,
    ]),
  };

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
      {/* //TODO: add chart */}
      <div className="w-full rounded-[23px] border border-[rgba(214,214,214,0.26)] border-solid bg-[#FAFAFA]">
        <ChartArea
          chartConfig={{
            desktop: {
              label: "Desktop",
              color: "var(--chart-1)",
            },
          }}
          chartData={[
            { date: "2024-04-01", desktop: 222 },
            { date: "2024-04-02", desktop: 97 },
            { date: "2024-04-03", desktop: 167 },
          ]}
          title={selectedMetric}
          value="6.04%"
          valueTooltip="APY"
        />
      </div>
      <div>
        <Table headers={table.headers} rows={table.rows} />
      </div>
    </>
  );
};
