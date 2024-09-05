import { hashToRange } from "./utils";

// Select containers
const cellsContainer = document.getElementById("cells-container");
const conicContainer = document.getElementById("conic-container");

// Create the concentric cells composition
function createCells(windSpeed, temperature, humidity) {
  cellsContainer.style.height = window.innerHeight;
  cellsContainer.innerHTML = ""; // Empty the container before refilling it

  // Get a color, warm or cool depending on the weather temperature.
  // The color will be affected by the blend mode, but it's important to get the right tint and saturation
  let isWeatherWarm = temperature >= 20;
  let minRange = isWeatherWarm ? 0 : 120;
  let maxRange = isWeatherWarm ? 120 : 271;

  // Apply hashed hue to the body
  document.body.style.backgroundColor = `hsl(${hashToRange(
    windSpeed - temperature,
    minRange,
    maxRange
  )}deg, 100%, 50%)`;

  // How many cells will be generated inside the cell container
  // It will be between 2 and 4. The seed is the sum of windSpeed and humidity
  let numberOfCells = hashToRange(windSpeed + humidity, 2, 4);

  // Loop through
  for (let index = 0; index < numberOfCells; index++) {
    let step = 100 / numberOfCells;

    // Create the cell
    let cell = document.createElement("div");
    cell.classList.add("cell");

    // Redefine color selection conditions
    isWeatherWarm = temperature <= 20;
    minRange = isWeatherWarm ? 0 : 120;
    maxRange = isWeatherWarm ? 120 : 271;

    // Apply background color to the cell
    let hashedSeed = windSpeed + temperature + humidity + index;
    let hashedHue = hashToRange(hashedSeed, minRange, maxRange);
    cell.style.backgroundColor = `hsl(${hashedHue}deg, 100%, 50%)`;

    // The distortion variable affects the circumference of the ellipse
    // in order to create a more versatile composition
    let distorsion =
      index > 0 ? hashToRange(windSpeed / temperature, -20, 20) : 0;

    // Apply width or height to the cell, depending of the device orientation
    // This part handles the responsive behavior of the cells.
    if (window.innerWidth < window.innerHeight) {
      let widthPercentage = 100 - index * step - distorsion;
      cell.style.width = `${widthPercentage}%`;
    } else {
      let heightPercentage = 100 - index * step - distorsion;
      cell.style.height = `${heightPercentage}%`;
    }

    cellsContainer.append(cell); // Append the newly created cell to the cell container
  }
}

// Create the conic gradient composition
function createGradient(windSpeed, temperature, humidity) {
  conicContainer.style.height = window.innerHeight;
  // Set how many shades will be part of the conic gradient
  // and declare the array to store each of them.
  let numberOfShades = hashToRange(windSpeed + humidity, 5, 10);
  let palette = [];

  // Fullfilled the palette array depending on the predefined number of shades
  for (let index = 0; index < numberOfShades; index++) {
    // Unlike during the cell creation, all available colors can be picked here.
    let minRange = 0;
    let maxRange = 360;
    let hashedSeed = windSpeed + temperature + humidity + index;
    let hashedHue = hashToRange(hashedSeed, minRange, maxRange);

    // Pushs the newly created color into the array
    palette.push(`hsl(${hashedHue}deg, 100%, 50%)`);
  }

  // RequestAnimationFrame is used to animate the harm of the conic gradient
  function updateClockHand(time) {
    let speed = windSpeed / 1000;
    let secondAngle = (time * speed) % 360;

    // The angle is updated before each repaint,
    // and the color palette is parsed and then added to the function.
    conicContainer.style.background = `conic-gradient(from ${secondAngle}deg, ${palette.join(
      ", "
    )})`;

    // Request the next frame
    requestAnimationFrame(updateClockHand);
  }

  // Start the animation
  requestAnimationFrame(updateClockHand);
}

export { createCells, createGradient };
