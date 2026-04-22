import type{ WeatherDay } from "../types/weather";

interface Props {
  day: WeatherDay;
}

function getIcon(icon: string) {
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${icon}.png`;
}

export default function WeatherCard({ day }: Props) {
  return (
    <div className="card">
      <div className="date">{day.datetime}</div>

      <img src={getIcon(day.icon)} alt={day.conditions} />

      <div className="temp">{day.temp}°C</div>
      <div>{day.conditions}</div>
    </div>
  );
}