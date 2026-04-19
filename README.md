# 🌤️ Weather App

A clean, beginner-friendly weather application built with **React** and **Vite**. Enter any city name to get real-time weather data from the OpenWeatherMap API.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 🔍 Search weather by city name
- 🌡️ Displays temperature in Celsius
- ☁️ Shows weather condition with icon
- ⏳ Loading state with pulse animation
- ❌ Descriptive error messages (city not found, network error, bad API key)
- 💾 Saves last searched city in localStorage
- 📱 Fully responsive (mobile-friendly)

## Tech Stack

- **React 19** — Functional components + hooks (`useState`, `useEffect`)
- **Vite 8** — Fast dev server and build tool
- **Vanilla CSS** — No UI libraries, clean custom styles
- **OpenWeatherMap API** — Free weather data

## Project Structure

```
src/
├── api/
│   └── weather.js        # API fetch function
├── components/
│   ├── SearchBar.jsx      # City input + search button
│   └── WeatherCard.jsx    # Weather data display card
├── App.jsx                # Root component (state + logic)
├── index.css              # All styles
└── main.jsx               # Entry point
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier)

### Installation

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Open `src/api/weather.js` and replace the placeholder:
   ```js
   const API_KEY = 'YOUR_API_KEY_HERE'  // <-- paste your key here
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

1. User types a city name in the **SearchBar** and clicks "Search" (or presses Enter)
2. **App.jsx** calls `fetchWeather(city)` from the API utility
3. On success, weather data is passed to **WeatherCard** as a prop
4. On error, a descriptive message is shown
5. The last successfully searched city is saved to `localStorage` and auto-loaded on next visit

## API Reference

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current):

```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric
```

## License

This project is open source and available under the [MIT License](LICENSE).
