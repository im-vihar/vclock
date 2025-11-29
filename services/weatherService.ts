
export const getWeather = async (lat: number, lon: number): Promise<{ temp: string, condition: string, location: string }> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    const data = await response.json();
    
    if (!data.current) throw new Error("No weather data");

    const code = data.current.weather_code;
    const temp = Math.round(data.current.temperature_2m);
    
    let condition = "Clear";
    if (code >= 1 && code <= 3) condition = "Cloudy";
    if (code >= 45 && code <= 48) condition = "Fog";
    if (code >= 51 && code <= 67) condition = "Rain";
    if (code >= 71 && code <= 77) condition = "Snow";
    if (code >= 80 && code <= 82) condition = "Rain";
    if (code >= 95) condition = "Storm";

    // Reverse Geocoding for City Name (using a free API or just generic)
    // For this demo, we'll try to use the browser's timezone or coordinates loosely, 
    // but OpenMeteo doesn't give city names. 
    // We'll return a generic coordinate label or "Local" if we can't get it easily without a key.
    // To keep it high quality without keys, we can leave location generic or user defined.
    
    return {
      location: "Local Weather", 
      temp: `${temp}°C`,
      condition: condition,
    };
  } catch (error) {
    console.error("Weather Error:", error);
    return { location: "Offline", temp: "--", condition: "Unknown" };
  }
};
