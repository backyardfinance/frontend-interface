import { ChartPieDonut } from "../charts/ChartPieDonut";

export const PlatformExposureChart = () => {
  return (
    <ChartPieDonut
      chartConfig={{
        morpho: {
          label: "Morpho",
          color: "var(--chart-1)",
        },
        jupiter: {
          label: "Jupiter",
          color: "var(--chart-5)",
        },
      }}
      chartData={[
        { platform: "Hylo", percentage: 34, fill: "var(--color-morpho)" },
        { platform: "Jupiter", percentage: 66, fill: "var(--color-jupiter)" },
      ]}
      nameKey="platform"
      title="Platform Exposure"
    />
  );
};
