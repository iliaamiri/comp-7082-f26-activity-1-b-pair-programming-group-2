import type { ForecastEntry } from "@/lib/types";

export type DayForecast = {
  dateKey: string;
  representative: ForecastEntry;
  min: number;
  max: number;
};

// OWM's forecast is one entry per 3 hours - group it into daily
// min/max + a representative (closest to midday) entry for the icon.
export function groupForecastByDay(
  list: ForecastEntry[],
  timezoneOffsetSeconds: number,
): DayForecast[] {
  const days = new Map<string, ForecastEntry[]>();

  for (const entry of list) {
    const cityMs = (entry.dt + timezoneOffsetSeconds) * 1000;
    const dateKey = new Date(cityMs).toISOString().slice(0, 10);
    if (!days.has(dateKey)) days.set(dateKey, []);
    days.get(dateKey)!.push(entry);
  }

  return Array.from(days.entries()).map(([dateKey, entries]) => {
    const temps = entries.map((e) => e.main.temp);
    const hourOf = (e: ForecastEntry) =>
      new Date((e.dt + timezoneOffsetSeconds) * 1000).getUTCHours();
    const representative = entries.reduce((closest, e) =>
      Math.abs(hourOf(e) - 13) < Math.abs(hourOf(closest) - 13) ? e : closest,
    );

    return {
      dateKey,
      representative,
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps)),
    };
  });
}

export function windDirection(deg: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}
