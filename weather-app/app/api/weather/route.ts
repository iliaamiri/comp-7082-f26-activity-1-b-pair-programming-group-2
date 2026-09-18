import { NextRequest, NextResponse } from "next/server";
import type { WeatherResponse } from "@/lib/types";

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
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
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
      let errorBody: any = { error: "Failed to fetch weather" };
      
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

    const data: WeatherResponse = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Weather fetch error:", e);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
