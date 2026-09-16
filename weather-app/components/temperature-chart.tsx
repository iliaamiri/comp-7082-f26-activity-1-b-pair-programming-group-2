"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cityHour } from "@/lib/format-time";
import type { ForecastEntry } from "@/lib/types";

const chartConfig = {
  temp: {
    label: "Temp (°C)",
    // shadcn's default --chart-1 is near-white in this theme; use the
    // app's own accent so the line is actually visible on a white card
    color: "#0ea5e9",
  },
} satisfies ChartConfig;

export function TemperatureChart({
  entries,
  timezone,
}: {
  entries: ForecastEntry[];
  timezone: number;
}) {
  const data = entries.map((entry) => ({
    hour: cityHour(entry.dt, timezone),
    temp: entry.main.temp,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Next 24 hours</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[180px] w-full">
          <LineChart data={data} margin={{ top: 8, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(v) => `${v}°`}
              width={40}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="temp"
              type="monotone"
              stroke="var(--color-temp)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
