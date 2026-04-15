export interface WeatherDay {
  dt: number;
  temp: {
    day: number;
    min?: number;
    max?: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind_speed: number;
  humidity?: number;
}

export interface WeatherResponse {
  daily: WeatherDay[];
  timezone?: string;
}

export interface WeatherError {
  message: string;
  code?: number;
}