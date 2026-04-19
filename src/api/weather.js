// api/weather.js — Fetches weather data from OpenWeatherMap API
//
// HOW TO GET YOUR API KEY:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account
// 3. Copy your API key from the dashboard
// 4. Replace the placeholder below with your key

const API_KEY = 'YOUR_API_KEY_HERE'  // <-- Replace with your OpenWeatherMap API key
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

  // Make the HTTP request using fetch()
  const response = await fetch(url)

  // If the response is not OK (e.g., 404 = city not found), throw an error
  if (!response.ok) {
    throw new Error('City not found')
  }

  // Parse and return the JSON data
  const data = await response.json()
  return data
}
