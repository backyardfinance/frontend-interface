import { useMemo, useState } from "react";
import { ChartArea } from "@/common/components/charts/ChartArea";
import { ChartPieDonut } from "@/common/components/charts/ChartPieDonut";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { buildChartDataByKey } from "@/common/utils/calculations";
import type { StrategyPosition } from "@/strategy/hooks/useStrategyPosition";

const positionMetrics = ["performance", "apy", "exposure"] as const;
type MetricType = (typeof positionMetrics)[number];

type Props = {
  strategy: StrategyPosition;
};

export const StrategyChart: React.FC<Props> = ({ strategy }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("performance");
  const platformExposure = useMemo(() => {
    return buildChartDataByKey(strategy.vaults, "platform");
  }, [strategy.vaults]);

  const tokenExposure = useMemo(() => {
    const inputTokens = strategy.vaults.map((v) => v.token);
    return buildChartDataByKey(inputTokens, "symbol");
  }, [strategy.vaults.map]);

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
            nameKey="symbol"
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
          chartData={
            selectedMetric === "apy"
              ? [
                  { date: "2025-11-25", [selectedMetric]: 0 },
                  { date: "2025-11-26", [selectedMetric]: 0 },
                  { date: "2025-11-27", [selectedMetric]: 0 },
                  { date: "2025-11-28", [selectedMetric]: 0 },
                  { date: "2025-11-29", [selectedMetric]: 9.5 },
                ]
              : [
                  { date: "2025-11-25", [selectedMetric]: 0 },
                  { date: "2025-11-26", [selectedMetric]: 0 },
                  { date: "2025-11-27", [selectedMetric]: 0 },
                  { date: "2025-11-28", [selectedMetric]: 0 },
                  { date: "2025-11-29", [selectedMetric]: strategy.strategyDepositedAmountUi },
                ]
          }
          title={selectedMetric}
          value={selectedMetric === "apy" ? "9.5%" : `$${strategy.strategyDepositedAmountUi.toFixed(2)}`}
          valueTooltip="APY"
        />
      )}
    </>
  );
};
