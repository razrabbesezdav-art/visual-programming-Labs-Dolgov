import React from "react";
import styles from "./WeatherIcon.module.css";

interface WeatherIconProps {
  icon: string;
  alt: string;
  size?: "small" | "medium" | "large";
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  icon, 
  alt, 
  size = "medium" 
}) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  return (
    <img 
      src={iconUrl} 
      alt={alt} 
      className={`${styles.icon} ${styles[size]}`}
      loading="lazy"
    />
  );
};

export default WeatherIcon;