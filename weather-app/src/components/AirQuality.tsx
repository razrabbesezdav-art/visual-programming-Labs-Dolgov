interface Props {
  data: {
    pm25: number | null;
    pm10: number | null;
  } | null;
}

function getStatus(pm25: number | null) {
  if (pm25 === null) return "No data";

  if (pm25 <= 12) return "Good";
  if (pm25 <= 35) return "Moderate";
  if (pm25 <= 55) return "Unhealthy (Sensitive)";
  if (pm25 <= 150) return "Unhealthy";

  return "Hazardous";
}

export default function AirQuality({ data }: Props) {
  if (!data) {
    return (
      <div className="card">
        <h3>Air Quality</h3>
        <p>No data</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Air Quality</h3>

      <p><strong>PM2.5:</strong> {data.pm25 ?? "-"} µg/m³</p>
      <p><strong>PM10:</strong> {data.pm10 ?? "-"} µg/m³</p>

      <p>Status: {getStatus(data.pm25)}</p>
    </div>
  );
}