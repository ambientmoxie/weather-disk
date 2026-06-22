import "../scss/style.scss";
import WeatherScene from "./weather-scene";

const cellsContainer = document.getElementById("cells-container");
const conicContainer = document.getElementById("conic-container");
const overlay = document.getElementById("overlay-text");

new WeatherScene(cellsContainer, conicContainer, overlay, {
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    zip: 75000,
    cd: "FR",
    units: "metric",
    key: import.meta.env.VITE_API_KEY,
});

