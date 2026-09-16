import { NextRequest, NextResponse } from "next/server";
import type { WeatherResponse } from "@/lib/types";

// TODO(backend): swap this mock for a real call to OpenWeatherMap.
// GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric
// Key goes in .env.local as OPENWEATHER_API_KEY (see .env.example) - keep it
// server-side, don't expose it with NEXT_PUBLIC_.
// The response shape below already matches what OpenWeatherMap sends back,
// so the frontend shouldn't need any changes once this is wired up.

function seedFor(city: string) {
  return city
    .toLowerCase()
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

const CONDITIONS = [
  { main: "Clear", description: "clear sky", icon: "01d" },
  { main: "Clouds", description: "scattered clouds", icon: "03d" },
  { main: "Rain", description: "light rain", icon: "10d" },
  { main: "Snow", description: "light snow", icon: "13d" },
];

export function fakeWeatherFor(city: string): WeatherResponse {
  const seed = seedFor(city);
  const condition = CONDITIONS[seed % CONDITIONS.length];
  const temp = 10 + (seed % 20);

  // fake but plausible timezone (-12h to +14h) and sunrise/sunset for "today"
  const timezone = ((seed % 27) - 12) * 3600;
  const nowUnix = Math.floor(Date.now() / 1000);
  const cityDayStart = Math.floor((nowUnix + timezone) / 86400) * 86400;
  const sunrise = cityDayStart + 6 * 3600 + 45 * 60 - timezone;
  const sunset = cityDayStart + 19 * 3600 + 15 * 60 - timezone;

  return {
    name: city,
    sys: { country: "--", sunrise, sunset },
    timezone,
    dt: nowUnix,
    main: {
      temp,
      feels_like: temp - 2,
      humidity: 40 + (seed % 40),
      temp_min: temp - 3,
      temp_max: temp + 3,
      pressure: 1000 + (seed % 30),
    },
    weather: [condition],
    wind: { speed: 1 + (seed % 8), deg: (seed * 7) % 360 },
    visibility: 10000 - (seed % 4000),
    clouds: { all: (seed * 3) % 100 },
  };
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city")?.trim();

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  if (city.length > 60) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  return NextResponse.json(fakeWeatherFor(city));
}
