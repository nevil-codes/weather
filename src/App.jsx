import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import HourlyForecast from './components/HourlyForecast'
import DailyForecast from './components/DailyForecast'
import { fetchWeather, fetchWeatherByCoords } from './api/weather'

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadWeather = async (fetchFn) => {
    setLoading(true)
    setError(null)
    setWeather(null)
    try {
      const data = await fetchFn()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (city) => {
    localStorage.setItem('lastCity', city)
    loadWeather(() => fetchWeather(city))
  }

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError(null)
    setWeather(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        loadWeather(() => fetchWeatherByCoords(latitude, longitude))
      },
      (err) => {
        setLoading(false)
        const messages = {
          [err.PERMISSION_DENIED]: 'Location access denied. Please allow location access in your browser settings.',
          [err.POSITION_UNAVAILABLE]: 'Location unavailable. Please try again.',
          [err.TIMEOUT]: 'Location request timed out. Please try again.',
        }
        setError(messages[err.code] || 'Unable to detect your location.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }

  useEffect(() => {
    const saved = localStorage.getItem('lastCity')
    if (saved) handleSearch(saved)
  }, [])

  return (
    <div className="app">
      <h1 className="app-title">Weather Dashboard</h1>

      <SearchBar onSearch={handleSearch} />

      <button
        className="geo-button"
        onClick={handleGeolocation}
        disabled={loading}
      >
        📍 Use Current Location
      </button>

      <div className="status-area">
        {loading && (
          <div className="spinner-container">
            <div className="spinner" />
          </div>
        )}

        {error && !loading && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {weather && !loading && (
          <>
            <WeatherCard data={weather} />
            <HourlyForecast hours={weather.hourly} />
            <DailyForecast days={weather.daily} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
