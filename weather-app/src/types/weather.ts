export interface WeatherDay {
  datetime: string;
  temp: number;
  conditions: string;
  icon: string;

  aqi?: number;
}

export interface WeatherResponse {
  resolvedAddress: string;
  days: WeatherDay[];
}