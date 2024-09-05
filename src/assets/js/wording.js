import textFit from "textfit";
const overlay = document.getElementById("overlay-text");

// Get the date, hours and minutes when weather data is fetched
function timeWhenFetched() {
  let currentDate = new Date();
  let day = String(currentDate.getDate()).padStart(2, "0");
  let month = String(currentDate.getMonth() + 1).padStart(2, "0");
  let year = currentDate.getFullYear();
  let hours = String(currentDate.getHours()).padStart(2, "0");
  let minutes = String(currentDate.getMinutes()).padStart(2, "0");

  return { day, month, year, hours, minutes };
}

// Fits the text inside its container
function resizeWording(el) {
  textFit(el, {
    minFontSize: 16,
    maxFontSize: 9999,
    multiLine: true,
  });
}

// Handles the responsive behavior of the text
window.addEventListener("resize", () => {
  resizeWording(overlay);
});

// Main wording function. Generates the descriptive sentence.
export default function createsWording(
  city,
  mood,
  windSpeed,
  temperature,
  humidity
) {
  const { day, month, year, hours, minutes } = timeWhenFetched();

  overlay.innerHTML = `
        In ${city}, it is ${temperature}° celcius, ${mood}, wind speed ${windSpeed} mph, humidity ${humidity}%. These values were fetched on ${day}/${month}/${year} at ${hours}:${minutes} and are being used as seeds to generate this composition. Click on it to generate a new one.`;

  resizeWording(overlay);
}
