import React from "react";
import type { WeatherDay } from "../types/weather";
import WeatherIcon from "./WeatherIcon";
import styles from "./WeatherCard.module.css";

interface WeatherCardProps {
  day: WeatherDay;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ day }) => {
  const date = new Date(day.dt * 1000);
  const dayName = date.toLocaleDateString("ru-RU", { weekday: "long" });
  const dayNumber = date.toLocaleDateString("ru-RU", { day: "numeric" });
  const month = date.toLocaleDateString("ru-RU", { month: "long" });

  const { icon, description, id } = day.weather[0];
  const temp = Math.round(day.temp.day);
  const wind = day.wind_speed.toFixed(1);

  const getBackgroundClass = (weatherId: number): string => {
    if (weatherId >= 200 && weatherId < 300) return styles.thunderstorm;
    if (weatherId >= 300 && weatherId < 600) return styles.rain;
    if (weatherId >= 600 && weatherId < 700) return styles.snow;
    if (weatherId >= 700 && weatherId < 800) return styles.fog;
    if (weatherId === 800) return styles.clear;
    if (weatherId > 800) return styles.clouds;
    return styles.default;
  };

  return (
    <div className={`${styles.card} ${getBackgroundClass(id)}`}>
      <div className={styles.date}>
        <div className={styles.dayName}>{dayName}</div>
        <div className={styles.fullDate}>{dayNumber} {month}</div>
      </div>
      
      <WeatherIcon icon={icon} alt={description} />
      
      <div className={styles.temp}>{temp}°C</div>
      
      <div className={styles.description}>
        {description.charAt(0).toUpperCase() + description.slice(1)}
      </div>
      
      <div className={styles.details}>
        <div className={styles.wind}>
          <span className={styles.label}>Ветер:</span> {wind} м/с
        </div>
        {day.humidity && (
          <div className={styles.humidity}>
            <span className={styles.label}>Влажность:</span> {day.humidity}%
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;