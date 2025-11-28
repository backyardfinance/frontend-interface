import { useMemo } from "react";
import { useUserStrategies } from "@/hooks/api/useStrategy";
import { buildChartDataByKey } from "@/utils/calculations";
import { ChartPieDonut } from "../charts/ChartPieDonut";

export const PlatformExposureChart = () => {
  const { data: userStrategies } = useUserStrategies();

  const { chartData, chartConfig } = useMemo(() => {
    if (!userStrategies?.length) {
      return { chartData: [], chartConfig: {} };
    }

    const allVaults = userStrategies.flatMap((strategy) => strategy.vaults || []);

    return buildChartDataByKey(allVaults, "platform");
  }, [userStrategies]);

  return <ChartPieDonut chartConfig={chartConfig} chartData={chartData} nameKey="platform" title="Platform Exposure" />;
};
