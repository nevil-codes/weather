const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_GEO_URL = 'https://nominatim.openstreetmap.org/reverse'

// WMO weather codes: https://open-meteo.com/en/docs#weathervariables
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

const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99])

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { description: 'Unknown', icon: '🌡️' }
}

async function getWeatherForCoords(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current_weather: 'true',
    hourly: 'temperature_2m,weathercode,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  })

  const res = await fetch(`${WEATHER_URL}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch weather data. Please try again.')

  const data = await res.json()
  const current = data.current_weather
  const currentInfo = getWeatherInfo(current.weathercode)

  // grab the next 24 hours starting from now
  const now = new Date()
  const startIdx = data.hourly.time.findIndex((t) => new Date(t) >= now)

  const hourly = []
  for (let i = 0; i < 24 && startIdx + i < data.hourly.time.length; i++) {
    const idx = startIdx + i
    const info = getWeatherInfo(data.hourly.weathercode[idx])
    hourly.push({
      time: data.hourly.time[idx],
      temp: Math.round(data.hourly.temperature_2m[idx]),
      icon: info.icon,
      description: info.description,
      precipProbability: data.hourly.precipitation_probability[idx] || 0,
      isRain: RAIN_CODES.has(data.hourly.weathercode[idx]),
    })
  }

  const daily = data.daily.time.map((time, i) => {
    const info = getWeatherInfo(data.daily.weathercode[i])
    return {
      date: time,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      icon: info.icon,
      description: info.description,
      precipProbability: data.daily.precipitation_probability_max[i] || 0,
      isRain: RAIN_CODES.has(data.daily.weathercode[i]),
    }
  })

  return {
    temp: Math.round(current.temperature),
    description: currentInfo.description,
    icon: currentInfo.icon,
    windspeed: current.windspeed,
    hourly,
    daily,
  }
}

export async function fetchWeather(city) {
  try {
    const geoUrl = `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=5&language=en`
    const geoRes = await fetch(geoUrl)
    if (!geoRes.ok) throw new Error('Failed to search for city. Please try again.')

    const geoData = await geoRes.json()
    if (!geoData.results?.length) throw new Error('City not found. Please check the spelling.')

    const { latitude, longitude, name, country } = geoData.results[0]
    const weather = await getWeatherForCoords(latitude, longitude)
    return { ...weather, name: `${name}, ${country}` }
  } catch (err) {
    if (err.message.includes('City not found') || err.message.includes('Failed to')) throw err
    throw new Error('Network error. Check your internet connection.')
  }
}

export async function fetchWeatherByCoords(latitude, longitude) {
  try {
    const weather = await getWeatherForCoords(latitude, longitude)

    // try to reverse-geocode for a nice city name
    const geoUrl = `${REVERSE_GEO_URL}?lat=${latitude}&lon=${longitude}&format=json`
    const geoRes = await fetch(geoUrl, { headers: { 'Accept-Language': 'en' } })

    let cityName = 'Your Location'
    if (geoRes.ok) {
      const geoData = await geoRes.json()
      const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || ''
      const country = geoData.address?.country || ''
      if (city) cityName = country ? `${city}, ${country}` : city
    }

    return { ...weather, name: cityName }
  } catch (err) {
    if (err.message.includes('Failed to')) throw err
    throw new Error('Network error. Check your internet connection.')
  }
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return []

  try {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(query.trim())}&count=5&language=en`
    const res = await fetch(url)
    if (!res.ok) return []

    const data = await res.json()
    if (!data.results) return []

    // dedupe results with the same display name
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
