import { useMemo } from "react";
import { ChartPieDonut } from "@/common/components/charts/ChartPieDonut";
import { buildChartDataByKey } from "@/common/utils/calculations";
import { useStrategiesPositions } from "@/dashboard/hooks/useStrategiesPositions";

export const TokenExposureChart = () => {
  const positions = useStrategiesPositions();

  const { chartData, chartConfig } = useMemo(() => {
    if (!positions?.length) {
      return { chartData: [], chartConfig: {} };
    }

    const tokens = positions.flatMap((p) => p.vaults.map((v) => v.token));

    return buildChartDataByKey(tokens, "symbol");
  }, [positions]);

  return <ChartPieDonut chartConfig={chartConfig} chartData={chartData} nameKey="symbol" title="Token Exposure" />;
};
