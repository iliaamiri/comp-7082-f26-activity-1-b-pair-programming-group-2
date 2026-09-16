// Shapes match OpenWeatherMap's actual responses so the real API calls can
// be dropped in later without touching the frontend.

// GET /data/2.5/weather
export type WeatherResponse = {
  name: string;
  sys: {
    country: string;
    sunrise: number; // unix seconds, UTC
    sunset: number;
  };
  timezone: number; // shift from UTC in seconds, for the city itself
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number; // meters
  clouds: {
    all: number; // % cover
  };
};

// GET /data/2.5/forecast - one entry per 3 hours, ~5 days
export type ForecastEntry = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number; // chance of precipitation, 0-1
};

export type ForecastResponse = {
  city: {
    name: string;
    timezone: number;
  };
  list: ForecastEntry[];
};

export type WeatherError = {
  error: string;
};
