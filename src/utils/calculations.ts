export const calculateWeights = (totalDeposited: number, depositAmount: number) => {
  const weight = totalDeposited > 0 ? depositAmount / totalDeposited : 0;
  return {
    weight,
    weightPercent: weight * 100,
  };
};

type ChartDataItem = {
  [key: string]: string | number;
  percentage: number;
  fill: string;
};

type ChartConfig = Record<string, { label: string; color: string }>;

type ChartResult = {
  chartData: ChartDataItem[];
  chartConfig: ChartConfig;
};

export const buildChartDataByKey = <T extends Record<string, unknown>>(
  items: T[],
  groupByKey: keyof T
): ChartResult => {
  if (!items?.length) {
    return { chartData: [], chartConfig: {} };
  }

  const counts = items.reduce<Record<string, number>>((acc, item) => {
    const value = item[groupByKey];
    if (value !== undefined && value !== null) {
      const key = String(value);
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  const chartData = Object.entries(counts).map(([key, count], index) => ({
    [groupByKey as string]: key,
    percentage: Number(((count / totalCount) * 100).toFixed(2)),
    fill: `var(--chart-${(index % 10) + 1})`, // max 8 colors
  }));

  const chartConfig = chartData.reduce<ChartConfig>((acc, item) => {
    const key = item[groupByKey as string] as string;
    const normalizedKey = key.toLowerCase();
    acc[normalizedKey] = {
      label: key,
      color: item.fill,
    };
    return acc;
  }, {});

  return { chartData, chartConfig };
};
