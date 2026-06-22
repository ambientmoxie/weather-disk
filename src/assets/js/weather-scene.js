import { hashToRange } from "./utils";
import textFit from "textfit";

export default class WeatherScene {
    #rafId = null;

    constructor(
        cellsContainer,
        conicContainer,
        overlay,
        { baseUrl, zip, cd, units, key } = {},
    ) {
        this.cellsContainer = cellsContainer;
        this.conicContainer = conicContainer;
        this.overlay = overlay;
        this.modal = document.getElementById("modal");
        if (!this.cellsContainer || !this.conicContainer || !this.overlay)
            return;
        this.apiConfig = { baseUrl, zip, cd, units, key };
        this.init();
    }

    init = async () => {
        this.weatherData = await this.#parseWeatherData();
        this.#createScene(this.weatherData);
        this.#initEventListeners();
    };

    // --------------------------------------------------------------
    // OPEN WEATHER API
    // --------------------------------------------------------------

    // Destructure API config object for ease of use,
    // and build a base URL to fetch weather data from the API.
    #fetchWeatherApi = async () => {
        const { baseUrl, zip, cd, units, key } = this.apiConfig;
        const url = `${baseUrl}?zip=${zip},${cd}&units=${units}&appid=${key}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(resp.statusText);

        return await resp.json();
    };

    // Parse the API data and return an object stripped of unnecessary entries.
    #parseWeatherData = async () => {
        try {
            const { name, weather, wind, main } = await this.#fetchWeatherApi();
            return {
                city: name,
                mood: weather[0].description,
                windSpeed: Math.round(wind.speed),
                temperature: Math.round(main.temp),
                humidity: Math.round(main.humidity),
            };
        } catch (error) {
            throw new Error(`Error parsing the data: ${error}`);
        }
    };

    // --------------------------------------------------------------
    // GRADIENT
    // --------------------------------------------------------------

    #createScene = (weatherData) => {
        this.#createGradient(weatherData);
        this.#createCells(weatherData);
        this.#createWording(weatherData);
    };

    #createGradient = (weatherData) => {
        const { windSpeed, temperature, humidity } = weatherData;

        let numberOfShades = hashToRange(windSpeed + humidity, 5, 10);
        let palette = [];

        for (let index = 0; index < numberOfShades; index++) {
            let minRange = 0;
            let maxRange = 360;
            let hashedSeed = windSpeed + temperature + humidity + index;
            let hashedHue = hashToRange(hashedSeed, minRange, maxRange);
            palette.push(`hsl(${hashedHue}deg, 100%, 50%)`);
        }

        if (this.#rafId) cancelAnimationFrame(this.#rafId);

        const updateClockHand = (time) => {
            let speed = windSpeed / 1000;
            let secondAngle = (time * speed) % 360;

            this.conicContainer.style.background = `conic-gradient(from ${secondAngle}deg, ${palette.join(
                ", ",
            )})`;

            this.#rafId = requestAnimationFrame(updateClockHand);
        };

        this.#rafId = requestAnimationFrame(updateClockHand);
    };

    #createCells = (weatherData) => {
        const { windSpeed, temperature, humidity } = weatherData;

        this.cellsContainer.style.height = `${window.innerHeight}px`;
        this.cellsContainer.innerHTML = "";

        // Get a color, warm or cool depending on the weather temperature.
        // The color will be affected by the blend mode, but it's important to get the right tint and saturation
        let isWeatherWarm = temperature >= 20;
        let minRange = isWeatherWarm ? 0 : 120;
        let maxRange = isWeatherWarm ? 120 : 271;

        // Apply hashed hue to the body
        document.body.style.backgroundColor = `hsl(${hashToRange(
            windSpeed - temperature,
            minRange,
            maxRange,
        )}deg, 100%, 50%)`;

        // How many cells will be generated inside the cell container?
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

            this.cellsContainer.append(cell); // Append the newly created cell to the cell container
        }
    };

    // --------------------------------------------------------------
    // WORDING
    // --------------------------------------------------------------

    #timeWhenFetched = () => {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, "0");
        let month = String(currentDate.getMonth() + 1).padStart(2, "0");
        let year = currentDate.getFullYear();
        let hours = String(currentDate.getHours()).padStart(2, "0");
        let minutes = String(currentDate.getMinutes()).padStart(2, "0");
        return { day, month, year, hours, minutes };
    };

    // Fits the text inside its container
    #resizeWording = () => {
        textFit(this.overlay, {
            minFontSize: 16,
            maxFontSize: 9999,
            multiLine: true,
        });
    };

    #createWording = (weatherData) => {
        const { city, mood, windSpeed, temperature, humidity } = weatherData;
        const { day, month, year, hours, minutes } = this.#timeWhenFetched();
        this.overlay.innerHTML = `
        In ${city}, it is ${temperature}° celcius, ${mood}, wind speed ${windSpeed} mph, humidity ${humidity}%. These values were fetched on ${day}/${month}/${year} at ${hours}:${minutes} and are being used as seeds to generate this composition. Click on it to generate a new one.`;
        this.#resizeWording(this.overlay);
    };

    // --------------------------------------------------------------
    // UPDATE SCENE
    // --------------------------------------------------------------

    // Update the weather data based on the new ZIP code and refreshes the scene
    #updateWeatherData = async () => {
        const newZip = document.getElementById("zip").value;
        if (!newZip) return;
        this.apiConfig.zip = newZip;
        this.weatherData = await this.#parseWeatherData();
        this.#createScene(this.weatherData);
    };

    // --------------------------------------------------------------
    // EVENT LISTENERS
    // --------------------------------------------------------------

    #initEventListeners = () => {
        window.addEventListener("resize", () => {
            this.#resizeWording();
            if (this.weatherData) this.#createCells(this.weatherData);  
        });

        const closeModal = document.getElementById("close-modal");
        const submitBtn = document.getElementById("submit");
        this.overlay.addEventListener("click", () => this.modal.style.display = "flex");
        closeModal.addEventListener("click", () => this.modal.style.display = "none");
        submitBtn.addEventListener("click", () => {
            this.modal.style.display = "none";
            this.#updateWeatherData();
        });
    };
}
