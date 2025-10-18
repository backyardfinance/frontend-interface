import { useState } from "react";
import { getTokenImage } from "@/assets/tokens";
import { ChartArea } from "@/components/charts/ChartArea";
import { Table } from "@/components/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Strategy } from "@/hooks/useStrategy";
import { ChartPieDonut } from "../charts/ChartPieDonut";

const positionMetrics = ["performance", "apy", "exposure"] as const;
type MetricType = (typeof positionMetrics)[number];

type Props = {
  strategy: Strategy;
};

export const Chart: React.FC<Props> = ({ strategy }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("performance");

  const positions = [
    {
      id: "1",
      deposited: "100,234.23",
      strategyWeight: "87%",
      interestEarned: "1234.42",
      parentStrategy: "Hylo",
    },
    {
      id: "2",
      deposited: "100,234.23",
      strategyWeight: "87%",
      interestEarned: "1234.42",
      parentStrategy: "STR-01",
    },
  ];

  const table = {
    headers: ["Markets Exposure", "Platform", "APY", "Strategy weight", "My Position"],
    rows: positions.map((position) => [
      <div className="inline-flex items-center justify-start gap-1.5" key={position.id}>
        <div className="size-3">{getTokenImage(strategy.allocation[0].token)}</div>
        <div className="justify-start font-bold text-neutral-800 text-sm">{position.deposited}</div>
      </div>,
      "Backyard",
      "10.6%",
      position.strategyWeight,
      <div className="inline-flex items-center justify-start gap-1.5" key={position.id}>
        <div className="justify-start font-bold text-neutral-800 text-sm">{position.interestEarned}</div>
        <div className="size-3">{getTokenImage(strategy.allocation[1].token)}</div>
      </div>,
    ]),
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="font-bold text-[#383838] text-base">Strategy overview</p>

        <Tabs onValueChange={(val) => setSelectedMetric(val as MetricType)} value={selectedMetric} variant="black">
          <TabsList>
            {positionMetrics.map((metric) => (
              <TabsTrigger key={metric} value={metric}>
                {metric.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {/* //TODO: add chart */}
      {selectedMetric === "exposure" ? (
        <div className="flex h-[281.5px] justify-around rounded-[14px] border border-[rgba(214,214,214,0.26)] bg-[#FAFAFA]">
          <ChartPieDonut
            chartConfig={{
              morpho: {
                label: "Hylo",
                color: "var(--chart-1)",
              },
              jupiter: {
                label: "Jupiter",
                color: "var(--chart-5)",
              },
            }}
            chartData={[
              { platform: "Hylo", percentage: 34, fill: "var(--color-morpho)" },
              {
                platform: "Jupiter",
                percentage: 66,
                fill: "var(--color-jupiter)",
              },
            ]}
            className="max-w-[254px] flex-1 border-none bg-transparent"
            nameKey="platform"
            title="Platform Exposure"
          />
          <ChartPieDonut
            chartConfig={{
              usdt: {
                label: "USDT",
                color: "var(--chart-1)",
              },
              eurc: {
                label: "EURC",
                color: "var(--chart-2)",
              },
              hyusd: {
                label: "HYUSD",
                color: "var(--chart-3)",
              },
              usdc: {
                label: "USDC",
                color: "var(--chart-4)",
              },
            }}
            chartData={[
              { token: "USDT", percentage: 50, fill: "var(--color-usdt)" },
              { token: "EURC", percentage: 10, fill: "var(--color-eurc)" },
              { token: "HYUSD", percentage: 10, fill: "var(--color-hyusd)" },
              { token: "USDC", percentage: 30, fill: "var(--color-usdc)" },
            ]}
            className="max-w-[254px] flex-1 border-none bg-transparent"
            nameKey="token"
            title="Token Exposure"
          />
        </div>
      ) : (
        <ChartArea
          chartConfig={{
            [selectedMetric]: {
              label: selectedMetric,
              color: "var(--chart-1)",
            },
          }}
          chartData={[
            { date: "2024-04-01", [selectedMetric]: 222 },
            { date: "2024-04-02", [selectedMetric]: 97 },
            { date: "2024-04-03", [selectedMetric]: 167 },
            { date: "2024-04-04", [selectedMetric]: 13 },
            { date: "2024-04-05", [selectedMetric]: 322 },
          ]}
          title={selectedMetric}
          value="6.04%"
          valueTooltip="APY"
        />
      )}
      <div>
        <Table headers={table.headers} rows={table.rows} />
      </div>
    </>
  );
};
