import { useState, useEffect } from "react";
import { getWeather } from "./services/weatherApi";
import type { WeatherResponse } from "./types/weather";
import Search from "./components/Search";
import ForecastList from "./components/ForecastList";
import "./App.css";

function getBackground(condition: string): string {
  const cond = condition.toLowerCase();

  if (cond.includes("rain")) return "#6b7280";     
  if (cond.includes("cloud")) return "#9ca3af";    
  if (cond.includes("clear")) return "#60a5fa";    
  if (cond.includes("snow")) return "#e0f2fe";     

  return "#e5e7eb"; 
}

function App() {
  const [city, setCity] = useState<string>("London");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadWeather = async (city: string) => {
    try {
      setLoading(true);
      const data = await getWeather(city);
      setWeather(data);
    } catch (e) {
      console.error("Ошибка загрузки погоды", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(city);
  }, [city]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadWeather(city);
    }, 3 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [city]);

  const background = weather
    ? getBackground(weather.days[0].conditions)
    : "#e5e7eb";

  return (
    <div className="app" style={{ background }}>
      <h1 className="title">Weather App</h1>

      <div className="search">
        <Search onSearch={setCity} />
      </div>

      {loading && <p>Loading...</p>}

      {weather && !loading && (
        <>
          <h2>{weather.resolvedAddress}</h2>

          <ForecastList days={weather.days} />
        </>
      )}
    </div>
  );
}

export default App;