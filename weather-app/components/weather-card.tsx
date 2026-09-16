import Image from "next/image";
import { Droplets, Wind, Thermometer } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { WeatherResponse } from "@/lib/types";

export function WeatherCard({ data }: { data: WeatherResponse }) {
  const condition = data.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;

  return (
    <Card className="w-full overflow-hidden py-0">
      <CardHeader className="gap-1 bg-gradient-to-br from-sky-500 to-blue-600 py-6 text-white [.border-b]:pb-6">
        <CardDescription className="text-sky-100">
          {data.sys.country !== "--" ? `${data.name}, ${data.sys.country}` : data.name}
        </CardDescription>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="text-4xl font-semibold tracking-tight">
            {Math.round(data.main.temp)}°C
          </span>
          <Image
            src={iconUrl}
            alt={condition.description}
            width={64}
            height={64}
            className="drop-shadow-sm"
          />
        </CardTitle>
        <p className="text-sm capitalize text-sky-100">{condition.description}</p>
      </CardHeader>
      <CardContent className="py-5">
        <div className="flex items-center justify-between text-center text-sm">
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <Thermometer className="size-4 text-muted-foreground" />
            <span className="font-medium">{Math.round(data.main.feels_like)}°C</span>
            <span className="text-xs text-muted-foreground">Feels like</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1.5 border-x">
            <Droplets className="size-4 text-muted-foreground" />
            <span className="font-medium">{data.main.humidity}%</span>
            <span className="text-xs text-muted-foreground">Humidity</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <Wind className="size-4 text-muted-foreground" />
            <span className="font-medium">{data.wind.speed} m/s</span>
            <span className="text-xs text-muted-foreground">Wind</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
