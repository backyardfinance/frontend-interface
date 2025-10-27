import { useMemo, useState } from "react";
import type { StrategyInfoResponse } from "@/api";
import { getTokenImage } from "@/assets/tokens";
import { ChartArea } from "@/components/charts/ChartArea";
import { Table } from "@/components/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildChartDataByKey, calculateWeights } from "@/utils/calculations";
import { ChartPieDonut } from "../charts/ChartPieDonut";

const positionMetrics = ["performance", "apy", "exposure"] as const;
type MetricType = (typeof positionMetrics)[number];

type Props = {
  strategy: StrategyInfoResponse;
};

export const Chart: React.FC<Props> = ({ strategy }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("performance");

  const platformExposure = useMemo(() => {
    return buildChartDataByKey(strategy.vaults, "platform");
  }, [strategy.vaults]);

  const tokenExposure = useMemo(() => {
    return buildChartDataByKey(strategy.vaults, "token");
  }, [strategy.vaults]);

  //TODO: token
  const table = {
    headers: ["Markets Exposure", "Platform", "APY", "Strategy weight", "My Position"],
    rows: strategy.vaults.map((vault) => [
      <div className="inline-flex items-center justify-start gap-1.5" key={vault.id}>
        <div className="size-3">{getTokenImage(vault.token)}</div>
        <div className="justify-start font-bold text-neutral-800 text-sm">{vault.token}</div>
      </div>,
      vault.name,
      `${vault.apy}%`,
      calculateWeights(strategy.strategyDepositedAmount, vault.depositedAmount).weightPercent.toFixed(0),
      <div className="inline-flex items-center justify-start gap-1.5" key={vault.id}>
        <div className="justify-start font-bold text-neutral-800 text-sm">{vault.depositedAmount}</div>
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
            chartConfig={platformExposure.chartConfig}
            chartData={platformExposure.chartData}
            className="max-w-[254px] flex-1 border-none bg-transparent"
            nameKey="platform"
            title="Platform Exposure"
          />
          <ChartPieDonut
            chartConfig={tokenExposure.chartConfig}
            chartData={tokenExposure.chartData}
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
