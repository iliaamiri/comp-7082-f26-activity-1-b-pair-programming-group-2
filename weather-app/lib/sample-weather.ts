import { fakeWeatherFor } from "@/app/api/weather/route";
import { fakeForecastFor } from "@/app/api/forecast/route";

// reuses the same mock generators the api routes use, just called
// directly so /demo doesn't need a network round trip
export const vancouverWeather = fakeWeatherFor("Vancouver");
export const vancouverForecast = fakeForecastFor("Vancouver");
