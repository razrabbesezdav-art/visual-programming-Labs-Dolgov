import type { WeatherResponse } from "../types/weather";

const API_KEY = "4ASN9P4K49CXTNC7AYZVPH7N3";

export async function getWeather(city: string): Promise<WeatherResponse> {
  const res = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}&unitGroup=metric`
  );

  const data = await res.json();
  return data;
}