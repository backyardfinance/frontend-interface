import { useMemo } from "react";
import { ChartPieDonut } from "@/common/components/charts/ChartPieDonut";
import { buildChartDataByKey } from "@/common/utils/calculations";
import { useUserStrategies } from "@/strategy/queries";

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
