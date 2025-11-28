import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/common/components/ui/chart";
import type { PieChartDataPoint } from "@/common/types/charts";
import { cn } from "@/common/utils";

type Props = {
  title: string;
  chartData: PieChartDataPoint[];
  chartConfig: ChartConfig;
  nameKey: string;
  className?: string;
};

export const ChartPieDonut: React.FC<Props> = ({ title, chartData, chartConfig, nameKey, className }) => {
  // Add fill property based on chartConfig and format data with colors
  const formattedChartData = useMemo(() => {
    return chartData.map((item) => {
      const name = String(item[nameKey]).toLowerCase();
      const configItem = chartConfig[name as keyof typeof chartConfig];
      const color = configItem && "color" in configItem ? configItem.color : undefined;
      const fill = item.fill || `var(--color-${name})`;
      return { ...item, color, fill, [nameKey]: item[nameKey] };
    });
  }, [chartData, chartConfig, nameKey]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer className="aspect-square size-[150px]" config={chartConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={formattedChartData} dataKey="percentage" innerRadius={40} nameKey={nameKey} />
          </PieChart>
        </ChartContainer>
        <div className="flex flex-1 flex-col items-start gap-1.5 self-center pr-3">
          {formattedChartData.map((item) => {
            const itemName = String((item as Record<string, unknown>)[nameKey]);
            return (
              <div className="flex w-full items-center justify-between" key={itemName}>
                <div className="flex items-center gap-2.5 rounded-[19px] bg-white px-[5px] py-[3px]">
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="font-bold text-[9px] text-neutral-800 leading-[normal]">{itemName}</p>
                </div>
                <p className="text-center font-normal text-[#A6A6A6] text-[9px] leading-[normal]">{item.percentage}%</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
