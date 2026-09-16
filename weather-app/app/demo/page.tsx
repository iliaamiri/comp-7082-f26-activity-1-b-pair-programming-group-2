import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { WeatherCard } from "@/components/weather-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { sampleWeather } from "@/lib/sample-weather";

// not linked from the real app - just a place to eyeball every state the
// weather card can be in without hitting the api or waiting on real data
export default function DemoPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-10 bg-muted/30 px-4 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">UI demo</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          hardcoded fixtures so we can see every state without waiting on the
          real api.{" "}
          <Link href="/" className="underline underline-offset-4">
            back to the actual app
          </Link>
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {sampleWeather.map((sample) => (
          <div key={sample.label} className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {sample.label}
            </span>
            <WeatherCard data={sample} />
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Loading
          </span>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Error
          </span>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Couldn&apos;t fetch weather</AlertTitle>
            <AlertDescription>City not found</AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
