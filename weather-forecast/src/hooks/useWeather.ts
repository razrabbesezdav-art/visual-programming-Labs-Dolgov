import { useState, useEffect } from "react";
import type { WeatherDay, WeatherError } from "../types/weather";
import { weatherService } from "../services/weatherService";

export const useWeather = (useMock: boolean = true) => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      weatherService.setUseMock(useMock);
      const data = await weatherService.getForecast();
      setForecast(data.daily.slice(0, 7)); // Берем прогноз на 7 дней
    } catch (err) {
      setError(err as WeatherError);
      console.error("Error in useWeather:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [useMock]);

  const refetch = () => {
    fetchWeather();
  };

  return { forecast, loading, error, refetch };
};