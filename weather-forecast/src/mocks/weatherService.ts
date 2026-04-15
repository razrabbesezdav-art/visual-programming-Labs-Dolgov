import { WeatherResponse, WeatherError } from "../types/weather";
import { mockWeatherData } from "../mocks/weatherMock";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

export class WeatherService {
  private useMock: boolean;

  constructor(useMock: boolean = true) {
    this.useMock = useMock;
  }

  setUseMock(useMock: boolean) {
    this.useMock = useMock;
  }

  async getForecast(lat: number = 55.7558, lon: number = 37.6173): Promise<WeatherResponse> {
    if (this.useMock) {
      // Возвращаем моковые данные с задержкой для имитации запроса
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockWeatherData), 800);
      });
    }

    try {
      const url = `${BASE_URL}?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}&lang=ru`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error: WeatherError = {
          message: `HTTP error! status: ${response.status}`,
          code: response.status
        };
        throw error;
      }
      
      const data: WeatherResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService(true);