// api/weather.js — Fetches weather data from Open-Meteo API (free, no API key needed)
//
// Open-Meteo uses coordinates, so we first geocode the city name,
// then fetch the weather for those coordinates.

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Maps WMO weather codes to human-readable descriptions and emoji icons.
 * Full list: https://open-meteo.com/en/docs#weathervariables
 */
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌦️' },
  61: { description: 'Light rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Light snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Light showers', icon: '🌦️' },
  81: { description: 'Moderate showers', icon: '🌧️' },
  82: { description: 'Violent showers', icon: '🌧️' },
  85: { description: 'Light snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
}

/**
 * Fetches current weather data for a given city.
 *
 * Step 1: Geocode the city name to get latitude/longitude
 * Step 2: Fetch weather data for those coordinates
 *
 * @param {string} city — The city name to search for
 * @returns {object} — Formatted weather data
 * @throws {Error} — If the city is not found or the request fails
 */
export async function fetchWeather(city) {
  try {
    // --- Step 1: Geocode the city name ---
    const geoUrl = `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1`
    const geoResponse = await fetch(geoUrl)

    if (!geoResponse.ok) {
      throw new Error('Failed to search for city. Please try again.')
    }

    const geoData = await geoResponse.json()

    // If no results found, the city doesn't exist
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found. Please check the spelling and try again.')
    }

    // Get the first (best) match
    const { latitude, longitude, name, country } = geoData.results[0]

    // --- Step 2: Fetch weather for these coordinates ---
    const weatherUrl = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    const weatherResponse = await fetch(weatherUrl)

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data. Please try again.')
    }

    const weatherData = await weatherResponse.json()
    const current = weatherData.current_weather

    // Look up the weather code to get description and icon
    const weatherInfo = WEATHER_CODES[current.weathercode] || {
      description: 'Unknown',
      icon: '🌡️',
    }

    // Return a clean, formatted object (same shape our WeatherCard expects)
    return {
      name: `${name}, ${country}`,
      temp: Math.round(current.temperature),
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      windspeed: current.windspeed,
    }
  } catch (err) {
    // If it's an error we threw above, re-throw it
    if (err.message.includes('City not found') ||
        err.message.includes('Failed to')) {
      throw err
    }

    // Otherwise it's a network error
    throw new Error('Network error. Please check your internet connection.')
  }
}
