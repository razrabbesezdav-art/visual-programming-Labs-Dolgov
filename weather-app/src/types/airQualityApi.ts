export interface AirQualityData {
  pm25: number | null;
  pm10: number | null;
}

export async function getAirQuality(city: string): Promise<AirQualityData | null> {
  try {
    const res = await fetch(
      `https://api.openaq.org/v2/latest?city=${city}&limit=1`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const measurements = data.results[0].measurements;

    let pm25: number | null = null;
    let pm10: number | null = null;

    measurements.forEach((m: any) => {
      if (m.parameter === "pm25") pm25 = m.value;
      if (m.parameter === "pm10") pm10 = m.value;
    });

    return { pm25, pm10 };
  } catch (error) {
    console.error("OpenAQ error:", error);
    return null;
  }
}

export async function getAirQualityByCoords(
  lat: number,
  lon: number
): Promise<AirQualityData | null> {
  try {
    const res = await fetch(
      `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000&limit=1`
    );

    const data = await res.json();

    if (!data.results?.length) return null;

    const measurements = data.results[0].measurements;

    let pm25: number | null = null;
    let pm10: number | null = null;

    measurements.forEach((m: any) => {
      if (m.parameter === "pm25") pm25 = m.value;
      if (m.parameter === "pm10") pm10 = m.value;
    });

    return { pm25, pm10 };
  } catch (e) {
    console.error(e);
    return null;
  }
}