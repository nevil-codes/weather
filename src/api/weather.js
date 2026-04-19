// api/weather.js — Weather data layer using Open-Meteo API
// Supports both city name search and coordinate-based lookup (for geolocation)

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_GEO_URL = 'https://nominatim.openstreetmap.org/reverse'

/** WMO weather code → description + emoji mapping */
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
 * Internal helper — fetches weather for given coordinates.
 * Shared by both fetchWeather and fetchWeatherByCoords.
 */
async function getWeatherForCoords(latitude, longitude) {
  const url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch weather data. Please try again.')
  }

  const data = await response.json()
  const current = data.current_weather

  const weatherInfo = WEATHER_CODES[current.weathercode] || {
    description: 'Unknown',
    icon: '🌡️',
  }

  return {
    temp: Math.round(current.temperature),
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    windspeed: current.windspeed,
  }
}

/**
 * Fetches weather by city name.
 * Step 1: Geocode city → coords
 * Step 2: Fetch weather for coords
 */
export async function fetchWeather(city) {
  try {
    const geoUrl = `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=5&language=en`
    const geoResponse = await fetch(geoUrl)

    if (!geoResponse.ok) {
      throw new Error('Failed to search for city. Please try again.')
    }

    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found. Please check the spelling.')
    }

    const { latitude, longitude, name, country } = geoData.results[0]
    const weather = await getWeatherForCoords(latitude, longitude)

    return { ...weather, name: `${name}, ${country}` }
  } catch (err) {
    if (err.message.includes('City not found') || err.message.includes('Failed to')) {
      throw err
    }
    throw new Error('Network error. Check your internet connection.')
  }
}

/**
 * Fetches weather by geographic coordinates (for geolocation feature).
 * Uses reverse geocoding to get the city name.
 */
export async function fetchWeatherByCoords(latitude, longitude) {
  try {
    // Fetch weather data
    const weather = await getWeatherForCoords(latitude, longitude)

    // Reverse geocode to get a city name
    const geoUrl = `${REVERSE_GEO_URL}?lat=${latitude}&lon=${longitude}&format=json`
    const geoResponse = await fetch(geoUrl, {
      headers: { 'Accept-Language': 'en' },
    })

    let cityName = 'Your Location'
    if (geoResponse.ok) {
      const geoData = await geoResponse.json()
      const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || ''
      const country = geoData.address?.country || ''
      if (city) {
        cityName = country ? `${city}, ${country}` : city
      }
    }

    return { ...weather, name: cityName }
  } catch (err) {
    if (err.message.includes('Failed to')) throw err
    throw new Error('Network error. Check your internet connection.')
  }
}

/**
 * Returns city suggestions for autocomplete.
 * Uses the Open-Meteo geocoding API with count=5.
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return []

  try {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(query.trim())}&count=5&language=en`
    const response = await fetch(url)

    if (!response.ok) return []

    const data = await response.json()
    if (!data.results) return []

    // Return unique city strings
    const seen = new Set()
    return data.results
      .map((r) => `${r.name}, ${r.country}`)
      .filter((name) => {
        if (seen.has(name)) return false
        seen.add(name)
        return true
      })
  } catch {
    return []
  }
}
