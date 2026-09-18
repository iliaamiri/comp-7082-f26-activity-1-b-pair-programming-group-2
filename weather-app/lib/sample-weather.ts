import { fakeWeatherFor, fakeForecastFor } from "@/lib/faker";

// reuses the same mock generators the api routes use, just called
// directly so /demo doesn't need a network round trip
export const vancouverWeather = fakeWeatherFor("Vancouver");
export const vancouverForecast = fakeForecastFor("Vancouver");
