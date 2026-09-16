"use client";

import { useState } from "react";
import { CloudSun, AlertCircle } from "lucide-react";
import { WeatherSearch } from "@/components/weather-search";
import { WeatherCard } from "@/components/weather-card";
import { TemperatureChart } from "@/components/temperature-chart";
import { DailyForecast } from "@/components/daily-forecast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { groupForecastByDay } from "@/lib/forecast";
import type { ForecastResponse, WeatherResponse } from "@/lib/types";

export default function Home() {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(city: string) {
    setIsLoading(true);
    setError(null);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?city=${encodeURIComponent(city)}`),
        fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
      ]);
      const weatherBody = await weatherRes.json();

      if (!weatherRes.ok) {
        throw new Error(weatherBody.error ?? "Something went wrong");
      }

      setData(weatherBody);
      setForecast(forecastRes.ok ? await forecastRes.json() : null);
    } catch (err) {
      setData(null);
      setForecast(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-gradient-to-b from-sky-50 via-white to-white px-4 py-16 dark:from-slate-950 dark:via-background dark:to-background">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <CloudSun className="size-9 text-sky-500" />
          <h1 className="text-2xl font-semibold tracking-tight">Weather</h1>
          <p className="text-sm text-muted-foreground">
            Look up current conditions for any city.
          </p>
        </div>

        <WeatherSearch onSearch={handleSearch} isLoading={isLoading} />

        <div className="flex w-full flex-col gap-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          )}

          {!isLoading && error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Couldn&apos;t fetch weather</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && data && (
            <>
              <WeatherCard data={data} />
              {forecast && (
                <>
                  <TemperatureChart
                    entries={forecast.list.slice(0, 8)}
                    timezone={forecast.city.timezone}
                  />
                  <DailyForecast
                    days={groupForecastByDay(forecast.list, forecast.city.timezone).slice(0, 5)}
                    timezone={forecast.city.timezone}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
