// Shape matches OpenWeatherMap's /data/2.5/weather response so the real
// API call can be dropped in later without touching the frontend.
export type WeatherResponse = {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
};

export type WeatherError = {
  error: string;
};
