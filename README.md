# Weather Disk

<img src="docs/cover.png" width="500" />

A browser-based generative composition driven by live weather data. Wind speed, temperature, and humidity are fetched from the OpenWeather API and used as seeds to generate a unique gradient, concentric ellipses, and color palette. Update on demand by ZIP code.

## Usage

### Prerequisites

- [Node.js](https://nodejs.org) or [Docker](https://www.docker.com)
- An [OpenWeather API key](https://openweathermap.org/api)

### Setup

Copy `.env-example` to `.env` and fill in your API key:

```
cp .env-example .env
```

### Run

**With Node**

```
npm install
npm run dev
```

**With Docker**

```
docker-compose up
```

Then open `http://localhost:5173/weather-disk`.
