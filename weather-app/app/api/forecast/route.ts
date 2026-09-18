import { NextRequest, NextResponse } from "next/server";
import type { ForecastEntry, ForecastResponse } from "@/lib/types";

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
  const firstSlot = Math.floor(now / (3 * 3600)) * 3 * 3600;

  const list: ForecastEntry[] = Array.from({ length: 40 }, (_, i) => {
    const dt = firstSlot + i * 3 * 3600;
    const hourOfDay = ((dt + timezone) / 3600) % 24;
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

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { 
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Accept-Encoding": "gzip"
        }
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      let errorBody: any = { error: "Failed to fetch forecast" };
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.cod === "404") {
          errorBody = { error: "City not found" };
        } else {
          errorBody = { error: errorJson.message || errorJson.error || "Unknown error" };
        }
      } catch {
        errorBody = { error: `HTTP ${res.status}: ${errorText}` };
      }

      if (res.status === 404) {
        return NextResponse.json(errorBody, { status: 404 });
      }
      throw new Error(errorBody.error);
    }

    const data: ForecastResponse = await res.json();
    
    if (!data.city?.name) {
      data.city = { name: city, timezone: data.city?.timezone || 0 };
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Forecast fetch error:", e);
    return NextResponse.json(
      { error: "Failed to fetch forecast" },
      { status: 500 }
    );
  }
}
