import { useMemo } from "react";
import { ChartPieDonut } from "@/common/components/charts/ChartPieDonut";
import { buildChartDataByKey } from "@/common/utils/calculations";
import { useUserStrategies } from "@/strategy/queries";

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
