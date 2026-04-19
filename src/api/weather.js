// api/weather.js — Fetches weather data from OpenWeatherMap API
//
// HOW TO GET YOUR API KEY:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account
// 3. Copy your API key from the dashboard
// 4. Replace the placeholder below with your key

const API_KEY = import.meta.env.VITE_API_KEY  // Loaded from .env file
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

/**
 * Fetches current weather data for a given city.
 *
 * @param {string} city — The city name to search for
 * @returns {object} — The parsed JSON response from the API
 * @throws {Error} — If the city is not found or the request fails
 */
export async function fetchWeather(city) {
  // Build the API URL with query parameters:
  //   q      = city name
  //   appid  = your API key
  //   units  = metric (for Celsius)
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`

  try {
    // Make the HTTP request using fetch()
    const response = await fetch(url)

    // Handle different error status codes with helpful messages
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.')
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.')
      } else {
        throw new Error(`Something went wrong (Error ${response.status}). Please try again.`)
      }
    }

    // Parse and return the JSON data
    const data = await response.json()
    return data
  } catch (err) {
    // If the error is already one we threw above, re-throw it
    if (err.message.includes('City not found') ||
      err.message.includes('Invalid API key') ||
      err.message.includes('Something went wrong')) {
      throw err
    }

    // Otherwise it's a network error (no internet, DNS failure, etc.)
    throw new Error('Network error. Please check your internet connection.')
  }
}
