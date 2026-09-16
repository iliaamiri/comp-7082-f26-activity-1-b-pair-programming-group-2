import type { WeatherResponse } from "@/lib/types";

// hardcoded fixtures for /demo - not used by the real app flow
export const sampleWeather: (WeatherResponse & { label: string })[] = [
  {
    label: "Clear",
    name: "Vancouver",
    sys: { country: "CA" },
    main: { temp: 22, feels_like: 21, humidity: 45, temp_min: 19, temp_max: 24 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    wind: { speed: 3 },
  },
  {
    label: "Clouds",
    name: "London",
    sys: { country: "GB" },
    main: { temp: 14, feels_like: 12, humidity: 70, temp_min: 11, temp_max: 16 },
    weather: [{ main: "Clouds", description: "overcast clouds", icon: "04d" }],
    wind: { speed: 5 },
  },
  {
    label: "Rain",
    name: "Tokyo",
    sys: { country: "JP" },
    main: { temp: 18, feels_like: 18, humidity: 88, temp_min: 16, temp_max: 19 },
    weather: [{ main: "Rain", description: "moderate rain", icon: "10d" }],
    wind: { speed: 4 },
  },
  {
    label: "Snow",
    name: "Oslo",
    sys: { country: "NO" },
    main: { temp: -4, feels_like: -9, humidity: 80, temp_min: -6, temp_max: -2 },
    weather: [{ main: "Snow", description: "light snow", icon: "13d" }],
    wind: { speed: 6 },
  },
];
