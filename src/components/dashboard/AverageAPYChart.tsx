import { ChartArea } from "../charts/ChartArea";

export const AverageAPYChart = () => {
  return (
    <ChartArea
      chartConfig={{
        apy: {
          label: "apy",
          color: "var(--chart-1)",
        },
      }}
      chartData={[
        { date: "2024-04-01", apy: 8 },
        { date: "2024-04-02", apy: 9 },
        { date: "2024-04-03", apy: 15.9 },
        { date: "2024-04-04", apy: 10 },
      ]}
      title="Avg APY"
      value="6.04%"
      valueTooltip="APY"
    />
  );
};
