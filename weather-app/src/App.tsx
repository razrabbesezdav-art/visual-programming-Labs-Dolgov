import { useState } from "react";
import "./App.css";

interface WeatherDay {
  date: string;
  temp: number;
  minTemp: number;
  code: number;
}

interface AirQualityData {
  pm25: number | null;
  pm10: number | null;
}

function App() {
  const [city, setCity] = useState("Moscow");
  const [weather, setWeather] = useState<any>(null);
  const [air, setAir] = useState<AirQualityData | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const fetchData = async () => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found");
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      const daily: WeatherDay[] = weatherData.daily.time.map(
        (date: string, i: number) => ({
          date,
          temp: weatherData.daily.temperature_2m_max[i],
          minTemp: weatherData.daily.temperature_2m_min[i],
          code: weatherData.daily.weathercode[i],
        })
      );

      setWeather({
        city: name,
        daily,
      });

      setSelectedDay(0);

      const airRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5`
      );
      const airJson = await airRes.json();

      if (airJson?.current) {
        setAir({
          pm25: airJson.current.pm2_5 ?? null,
          pm10: airJson.current.pm10 ?? null,
        });
      } else {
        setAir(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code < 3) return "⛅";
    if (code < 50) return "☁️";
    if (code < 70) return "🌧️";
    if (code < 80) return "❄️";
    return "❓";
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code < 3) return "Partly cloudy";
    if (code < 50) return "Cloudy";
    if (code < 70) return "Rain";
    if (code < 80) return "Snow";
    return "Unknown";
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className={`app ${theme}`}>
      <h1>Weather App</h1>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

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

          {/* 🔹 карточки */}
          <div className="weather-grid">
            {weather.daily.slice(0, 7).map((day: WeatherDay, index: number) => (
              <div
                key={index}
                className={`card ${selectedDay === index ? "active" : ""}`}
                onClick={() => setSelectedDay(index)}
              >
                <h3>{day.date}</h3>
                <div className="icon">{getWeatherIcon(day.code)}</div>
                <p>{day.temp}°C</p>
              </div>
            ))}
          </div>

          {/* 🔹 большая карточка */}
          <div className="details-card">
            <div className="details-left">
              <h2>{weather.city}</h2>

              <p>{getDayName(weather.daily[selectedDay].date)}</p>

              <div className="big-temp">
                +{weather.daily[selectedDay].temp}°
              </div>

              <p>
                {getWeatherDescription(
                  weather.daily[selectedDay].code
                )}
              </p>

              <p>
                {weather.daily[selectedDay].minTemp}° /{" "}
                {weather.daily[selectedDay].temp}°
              </p>

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