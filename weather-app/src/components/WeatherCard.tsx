import type { WeatherDay } from "../types/weather";

interface Props {
  day: WeatherDay;
}

export default function WeatherCard({ day }: Props) {
  return (
    <div>
      <h3>{day.datetime}</h3>
      <p>{day.temp}°C</p>
      <p>{day.conditions}</p>
    </div>
  );
}