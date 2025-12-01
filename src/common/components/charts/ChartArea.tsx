import type * as React from "react";
import { useMemo } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/common/components/ui/chart";
import { CompactHybridTooltip } from "@/common/components/ui/hybrid-tooltip";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AreaChartDataPoint } from "@/common/types/charts";
import { InfoCircleIcon } from "@/icons/info-circle";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  title: string;
  value: string;
  valueTooltip: string;
  chartConfig: ChartConfig;
  chartData: AreaChartDataPoint[];
};

// const duration = [
//   {
//     title: "All time",
//     value: "all",
//   },
//   {
//     title: "3 months",
//     value: "90d",
//   },
//   {
//     title: "1 month",
//     value: "30d",
//   },
//   {
//     title: "1 week",
//     value: "7d",
//   },
// ];

export const ChartArea: React.FC<Props> = ({ title, value, valueTooltip, chartConfig, chartData }) => {
  // const [timeRange, setTimeRange] = useState("90d");

  // Get all data keys from chartConfig (excluding date)
  const dataKeys = useMemo(() => {
    return Object.keys(chartConfig);
  }, [chartConfig]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <p className="flex items-center gap-1 font-bold text-lg text-neutral-800 leading-[normal]">
            {value}
            <CompactHybridTooltip content={valueTooltip}>
              <InfoCircleIcon />
            </CompactHybridTooltip>
          </p>
        </div>
        {/* <Select onValueChange={setTimeRange} value={timeRange}>
          <SelectTrigger aria-label="Select a value">
            <SelectValue placeholder="3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {duration.map(({ title, value }) => (
              <SelectItem className="rounded-lg" key={value} value={value}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent className="pt-3">
        <ChartContainer className="w-full" config={chartConfig}>
          <AreaChart data={chartData} margin={{ left: -4, top: 10 }}>
            <defs>
              {dataKeys.map((key) => (
                <linearGradient id={`fill${key}`} key={key} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <YAxis
              axisLine={false}
              className="text-center font-normal text-[#A6A6A6] text-[8px] leading-[normal]"
              tickLine={false}
              tickMargin={0}
              width={30}
            />
            <XAxis
              axisLine={false}
              className="h-10 text-center font-normal text-[#A6A6A6] text-[8px] leading-[normal]"
              dataKey="date"
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
            />
            {dataKeys.map((key) => (
              <Area
                dataKey={key}
                fill={`url(#fill${key})`}
                key={key}
                stackId="a"
                stroke={`var(--color-${key})`}
                type="bump"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
