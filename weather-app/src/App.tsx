import { useEffect, useState } from "react";
import { getWeather } from "./services/weatherApi";
import type { WeatherResponse } from "./types/weather";
import Search from "./components/Search";
import ForecastList from "./components/ForecastList";

function App() {
  const [city, setCity] = useState<string>("London");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    loadWeather(city);
  }, [city]);

  const loadWeather = async (city: string) => {
    const data = await getWeather(city);
    setWeather(data);
  };

  return (
    <div>
      <h1>Weather App</h1>
      <Search onSearch={setCity} />

      {weather && (
        <>
          <h2>{weather.resolvedAddress}</h2>
          <ForecastList days={weather.days} />
        </>
      )}
    </div>
  );
}

export default App;