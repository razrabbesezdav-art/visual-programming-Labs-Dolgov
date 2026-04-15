import { WeatherResponse } from "../types/weather";

export const mockWeatherData: WeatherResponse = {
  daily: [
    {
      dt: Math.floor(Date.now() / 1000),
      temp: { 
        day: 22,
        min: 18,
        max: 24 
      },
      weather: [{ 
        id: 800, 
        main: "Clear", 
        description: "ясно", 
        icon: "01d" 
      }],
      wind_speed: 3.5,
      humidity: 45
    },
    {
      dt: Math.floor(Date.now() / 1000) + 86400,
      temp: { 
        day: 18,
        min: 15,
        max: 20 
      },
      weather: [{ 
        id: 500, 
        main: "Rain", 
        description: "небольшой дождь", 
        icon: "10d" 
      }],
      wind_speed: 5.2,
      humidity: 75
    },
    {
      dt: Math.floor(Date.now() / 1000) + 172800,
      temp: { 
        day: 15,
        min: 12,
        max: 17 
      },
      weather: [{ 
        id: 200, 
        main: "Thunderstorm", 
        description: "гроза", 
        icon: "11d" 
      }],
      wind_speed: 7.8,
      humidity: 85
    },
    {
      dt: Math.floor(Date.now() / 1000) + 259200,
      temp: { 
        day: 20,
        min: 16,
        max: 22 
      },
      weather: [{ 
        id: 801, 
        main: "Clouds", 
        description: "небольшая облачность", 
        icon: "02d" 
      }],
      wind_speed: 4.1,
      humidity: 55
    },
    {
      dt: Math.floor(Date.now() / 1000) + 345600,
      temp: { 
        day: 25,
        min: 21,
        max: 27 
      },
      weather: [{ 
        id: 800, 
        main: "Clear", 
        description: "ясно", 
        icon: "01d" 
      }],
      wind_speed: 2.9,
      humidity: 40
    }
  ]
};

// Функция для получения моковых данных
export const getMockWeather = (): Promise<WeatherResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWeatherData), 500);
  });
};