import Image from "next/image";
import { Droplets, Wind, Thermometer, Gauge, Eye, Sunrise, Sunset } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cityTime } from "@/lib/format-time";
import { windDirection } from "@/lib/forecast";
import type { WeatherResponse } from "@/lib/types";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 py-3">
      <Icon className="size-4 text-muted-foreground" />
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

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
      <CardContent className="divide-y p-0">
        <div className="grid grid-cols-3 divide-x">
          <Stat
            icon={Thermometer}
            label="Feels like"
            value={`${Math.round(data.main.feels_like)}°C`}
          />
          <Stat icon={Droplets} label="Humidity" value={`${data.main.humidity}%`} />
          <Stat
            icon={Wind}
            label="Wind"
            value={`${data.wind.speed} m/s ${windDirection(data.wind.deg)}`}
          />
        </div>
        <div className="grid grid-cols-3 divide-x">
          <Stat icon={Gauge} label="Pressure" value={`${data.main.pressure} hPa`} />
          <Stat
            icon={Eye}
            label="Visibility"
            value={`${(data.visibility / 1000).toFixed(1)} km`}
          />
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs">
            <span className="flex items-center gap-1">
              <Sunrise className="size-3.5 text-muted-foreground" />
              {cityTime(data.sys.sunrise, data.timezone)}
            </span>
            <span className="flex items-center gap-1">
              <Sunset className="size-3.5 text-muted-foreground" />
              {cityTime(data.sys.sunset, data.timezone)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
