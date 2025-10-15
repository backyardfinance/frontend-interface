import { ChartPieDonut } from "../charts/ChartPieDonut";

export const TokenExposureChart = () => {
  return (
    <ChartPieDonut
      chartConfig={{
        usdt: {
          label: "USDT",
          color: "var(--chart-1)",
        },
        eurc: {
          label: "EURC",
          color: "var(--chart-2)",
        },
        hyusd: {
          label: "HYUSD",
          color: "var(--chart-3)",
        },
        usdc: {
          label: "USDC",
          color: "var(--chart-4)",
        },
      }}
      chartData={[
        { token: "USDT", percentage: 50, fill: "var(--color-usdt)" },
        { token: "EURC", percentage: 10, fill: "var(--color-eurc)" },
        { token: "HYUSD", percentage: 10, fill: "var(--color-hyusd)" },
        { token: "USDC", percentage: 30, fill: "var(--color-usdc)" },
      ]}
      nameKey="token"
      title="Token Exposure"
    />
  );
};
