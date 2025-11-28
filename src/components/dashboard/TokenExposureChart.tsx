import { useMemo } from "react";
import { useUserStrategies } from "@/hooks/api/useStrategy";
import { buildChartDataByKey } from "@/utils/calculations";
import { ChartPieDonut } from "../charts/ChartPieDonut";

export const TokenExposureChart = () => {
  const { data: userStrategies } = useUserStrategies();

  const { chartData, chartConfig } = useMemo(() => {
    if (!userStrategies?.length) {
      return { chartData: [], chartConfig: {} };
    }

    const allVaults = userStrategies.flatMap((strategy) => strategy.vaults || []);

    return buildChartDataByKey(allVaults, "name");
  }, [userStrategies]);

  return <ChartPieDonut chartConfig={chartConfig} chartData={chartData} nameKey="token" title="Token Exposure" />;
};
