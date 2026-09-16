import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cityWeekday } from "@/lib/format-time";
import type { DayForecast } from "@/lib/forecast";

export function DailyForecast({
  days,
  timezone,
}: {
  days: DayForecast[];
  timezone: number;
}) {
  return (
    <Card>
      <CardContent className="flex justify-between gap-2 py-4">
        {days.map((day) => {
          const icon = day.representative.weather[0];
          return (
            <div
              key={day.dateKey}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {cityWeekday(day.representative.dt, timezone)}
              </span>
              <Image
                src={`https://openweathermap.org/img/wn/${icon.icon}.png`}
                alt={icon.description}
                width={36}
                height={36}
              />
              <span className="text-sm">
                <span className="font-medium">{day.max}°</span>{" "}
                <span className="text-muted-foreground">{day.min}°</span>
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
