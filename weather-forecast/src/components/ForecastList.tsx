import React from "react";
import type { WeatherDay } from "../types/weather";
import WeatherCard from "./WeatherCard";
import styles from "./ForecastList.module.css";

interface ForecastListProps {
  days: WeatherDay[];
  loading?: boolean;
}

const ForecastList: React.FC<ForecastListProps> = ({ days, loading }) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка прогноза погоды...</p>
        </div>
      </div>
    );
  }

  if (!days || days.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>Нет данных о погоде</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {days.map((day) => (
          <WeatherCard key={day.dt} day={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastList;