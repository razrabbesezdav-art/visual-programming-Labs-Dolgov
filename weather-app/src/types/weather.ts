export interface WeatherDay {
  datetime: string;
  temp: number;
  conditions: string;
  icon: string;
}

export interface WeatherResponse {
  resolvedAddress: string;
  days: WeatherDay[];
}