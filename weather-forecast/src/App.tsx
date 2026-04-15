import React, { useState } from "react";
import ForecastList from "./components/ForecastList";
import { useWeather } from "./hooks/useWeather";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [useMock, setUseMock] = useState<boolean>(true);
  const { forecast, loading, error, refetch } = useWeather(useMock);

  const toggleDataSource = () => {
    setUseMock(!useMock);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.weatherEmoji}>🌤️</span>
          Прогноз погоды
        </h1>
        
        <div className={styles.controls}>
          <button 
            onClick={toggleDataSource}
            className={`${styles.button} ${styles.toggleButton}`}
          >
            {useMock ? "🌐 Использовать API" : "📦 Использовать моки"}
          </button>
          
          <button 
            onClick={handleRefresh}
            className={`${styles.button} ${styles.refreshButton}`}
            disabled={loading}
          >
            {loading ? "🔄 Загрузка..." : "🔄 Обновить"}
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.error}>
          <span>⚠️ Ошибка: {error.message}</span>
          <button onClick={handleRefresh} className={styles.retryButton}>
            Повторить
          </button>
        </div>
      )}

      <main className={styles.main}>
        <ForecastList days={forecast} loading={loading} />
      </main>

      <footer className={styles.footer}>
        <p>Данные предоставлены OpenWeatherMap</p>
        <p className={styles.mockInfo}>
          {useMock ? "📦 Режим: Мок-данные" : "🌐 Режим: Реальные данные"}
        </p>
      </footer>
    </div>
  );
};

export default App;