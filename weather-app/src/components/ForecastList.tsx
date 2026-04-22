import type { WeatherDay } from "../types/weather";
import WeatherCard from "./WeatherCard";

interface Props {
  days: WeatherDay[];
}

export default function ForecastList({ days }: Props) {
  return (
    <div>
      {days.map((day) => (
        <WeatherCard key={day.datetime} day={day} />
      ))}
    </div>
  );
}