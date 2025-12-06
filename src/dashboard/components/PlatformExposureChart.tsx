import { useMemo } from "react";
import { ChartPieDonut } from "@/common/components/charts/ChartPieDonut";
import { buildChartDataByKey } from "@/common/utils/calculations";
import { useStrategiesPositions } from "@/dashboard/hooks/useStrategiesPositions";

export const PlatformExposureChart = () => {
  const { positions } = useStrategiesPositions();

  const { chartData, chartConfig } = useMemo(() => {
    if (!positions?.length) {
      return { chartData: [], chartConfig: {} };
    }
    const platforms = positions.flatMap((p) => p.vaults);

    return buildChartDataByKey(platforms, "platform");
  }, [positions]);

  return <ChartPieDonut chartConfig={chartConfig} chartData={chartData} nameKey="platform" title="Platform Exposure" />;
};
