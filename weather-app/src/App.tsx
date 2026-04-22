import { useState } from "react";
import "./App.css";
import { getAirQuality } from "./types/airQualityApi";
import type { AirQualityData } from "./types/airQualityApi";

function App() {
  const [city, setCity] = useState("Moscow");
  const [weather, setWeather] = useState<any>(null);
  const [air, setAir] = useState<AirQualityData | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const fetchData = async () => {
    // 🔹 Погода (Open-Meteo)
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) return;

    const { latitude, longitude, name } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weathercode&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    setWeather({
      city: name,
      daily: weatherData.daily.time.map((date: string, i: number) => ({
        date,
        temp: weatherData.daily.temperature_2m_max[i],
        code: weatherData.daily.weathercode[i],
      })),
    });

    // 🔹 Воздух
    const airData = await getAirQuality(name);
    setAir(airData);
  };

  const getWeatherIcon = (code: number) => {
    if (code < 3) return "☀️";
    if (code < 50) return "⛅";
    if (code < 70) return "🌧️";
    return "❄️";
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="search">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchData}>Search</button>
      </div>

      {weather && (
        <>
          <h2>{weather.city}</h2>

          {/* 🔹 Карточки дней */}
          <div className="weather-grid">
            {weather.daily.slice(0, 7).map((day: any, index: number) => (
              <div
                key={index}
                className={`card ${
                  selectedDay === index ? "active" : ""
                }`}
                onClick={() => setSelectedDay(index)}
              >
                <h3>{day.date}</h3>
                <div className="icon">
                  {getWeatherIcon(day.code)}
                </div>
                <p>{day.temp}°C</p>
              </div>
            ))}
          </div>

          {/* 🔹 Детальная карточка */}
          <div className="details-card">
            <div className="details-left">
              <h2>{weather.city}</h2>
              <div className="big-temp">
                +{weather.daily[selectedDay].temp}°
              </div>
              <p>{weather.daily[selectedDay].date}</p>
            </div>

            <div className="details-right">
              <div className="big-icon">
                {getWeatherIcon(weather.daily[selectedDay].code)}
              </div>

              <div className="air-info">
                <h3>Air Quality</h3>
                {air ? (
                  <>
                    <p>PM2.5: {air.pm25 ?? "—"}</p>
                    <p>PM10: {air.pm10 ?? "—"}</p>
                  </>
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;