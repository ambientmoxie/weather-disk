import { parseWeatherData, updateWeatherData } from "./weatherApi";
import { createGradient, createCells } from "./gradient";
import createWording from "./wording";


// Handle the entire weather scene creation process
async function createScene() {
  try {
    const weatherData = await parseWeatherData(); // Fetch the weather data
    updateScene(weatherData); // Update the scene with fetched data
  } catch (error) {
    console.error("Failed to create the scene:", error);
  }
}

// Update the visual elements and wording based on weather data
function updateScene({ city, mood, windSpeed, temperature, humidity }) {
  createGradient(windSpeed, temperature, humidity); // Create the conic gradient
  createCells(windSpeed, temperature, humidity); // Create the radial gradient
  createWording(city, mood, windSpeed, temperature, humidity); // Generate descriptive text  
}

// Initializes event listeners
function initEventListeners() {
  const updateButton = document.getElementById("submit");
  updateButton.addEventListener("click", updateWeatherData);

  // Handle the responsive behavior by generates new cells on window resize
  window.addEventListener("resize", async () => {
    try {
      const { windSpeed, temperature, humidity } = await parseWeatherData();
      createCells(windSpeed, temperature, humidity);
    } catch (error) {
      console.error("Failed to update cells on resize:", error);
    }
  });
}

export { initEventListeners, createScene, updateScene };
