import { createScene } from "./init";

// Base configuration
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const apiConfig = {
  zip: 75000,
  cd: "FR",
  units: "metric",
  key: import.meta.env.VITE_API_KEY,
};

// Fetch the datas
async function fetchWeatherApi(zip, country, units, apiKey) {
  const url = `${BASE_URL}?zip=${zip},${country}&units=${units}&appid=${apiKey}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(resp.statusText);
  return await resp.json();
}

// Parse the data and extract only the needed parts
async function parseWeatherData() {
  try {
    const { name, weather, wind, main } = await fetchWeatherApi(
      apiConfig.zip,
      apiConfig.cd,
      apiConfig.units,
      apiConfig.key
    );

    // Clean datas
    const city = name;
    const mood = weather[0].description;
    const windSpeed = Math.round(wind.speed);
    const temperature = Math.round(main.temp);
    const humidity = Math.round(main.humidity);

    return { city, mood, windSpeed, temperature, humidity }; // Return clean data object
  } catch (error) {
    console.log(error);
  }
}

// Update the weather data based on the new ZIP code and refreshes the scene
function updateWeatherData() {
  const newZip = document.getElementById("zip").value;
  if (newZip) {
    apiConfig.zip = newZip;
    createScene();
  }
}

export { apiConfig, parseWeatherData, updateWeatherData };

// fetchWeatherApi(
//   apiConfig.zip,
//   apiConfig.cd,
//   apiConfig.units,
//   apiConfig.key
// ).then((data) => {
//   console.log(data);
// });
