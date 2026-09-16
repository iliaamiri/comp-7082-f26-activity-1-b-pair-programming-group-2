import { NextRequest, NextResponse } from "next/server";
import type { ForecastEntry, ForecastResponse } from "@/lib/types";

// TODO(backend): swap this mock for a real call to OpenWeatherMap.
// GET https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric
// Free tier, no card required. Returns one entry every 3 hours for ~5 days.
// The shape below matches that response, so the frontend shouldn't need
// any changes once this is wired up.

const CONDITIONS = [
  { main: "Clear", description: "clear sky", icon: "01d" },
  { main: "Clouds", description: "scattered clouds", icon: "03d" },
  { main: "Rain", description: "light rain", icon: "10d" },
  { main: "Snow", description: "light snow", icon: "13d" },
];

function seedFor(city: string) {
  return city
    .toLowerCase()
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function fakeForecastFor(city: string): ForecastResponse {
  const seed = seedFor(city);
  const baseTemp = 10 + (seed % 20);
  const timezone = ((seed % 27) - 12) * 3600;
  const now = Math.floor(Date.now() / 1000);
  // round down to the nearest 3h slot, like OWM does
  const firstSlot = Math.floor(now / (3 * 3600)) * 3 * 3600;

  const list: ForecastEntry[] = Array.from({ length: 40 }, (_, i) => {
    const dt = firstSlot + i * 3 * 3600;
    const hourOfDay = ((dt + timezone) / 3600) % 24;
    // day/night sine wave so the chart actually looks like weather
    const dayNightSwing = Math.sin(((hourOfDay - 6) / 24) * 2 * Math.PI) * 6;
    const drift = Math.sin((i / 40) * Math.PI * 2 + seed) * 3;
    const temp = Math.round((baseTemp + dayNightSwing + drift) * 10) / 10;
    const condition = CONDITIONS[(seed + Math.floor(i / 4)) % CONDITIONS.length];

    return {
      dt,
      dt_txt: new Date(dt * 1000).toISOString().replace("T", " ").slice(0, 19),
      main: {
        temp,
        feels_like: Math.round((temp - 1.5) * 10) / 10,
        humidity: 40 + ((seed + i * 3) % 40),
      },
      weather: [condition],
      pop: ((seed + i * 5) % 10) / 10,
    };
  });

  return {
    city: { name: city, timezone },
    list,
  };
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city")?.trim();

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  return NextResponse.json(fakeForecastFor(city));
}
