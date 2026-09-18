import type { WeatherResponse } from "@/lib/types";
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

// only used by /demo now that GET hits the real api
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
