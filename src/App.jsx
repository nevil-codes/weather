// App.jsx — Root component of the Weather Dashboard
// Manages all application state and coordinates data flow

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

  // Shared fetch handler to avoid duplicating try/catch logic
  const performFetch = async (fetchFn) => {
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

  // Search by city name
  const handleSearch = (city) => {
    localStorage.setItem('lastCity', city)
    performFetch(() => fetchWeather(city))
  }

  // Use browser geolocation to fetch weather for current position
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError(null)
    setWeather(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        performFetch(() => fetchWeatherByCoords(latitude, longitude))
      },
      (err) => {
        setLoading(false)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please allow location access in your browser settings.')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Please try again.')
            break
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.')
            break
          default:
            setError('Unable to detect your location.')
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }

  // Auto-load last searched city on mount
  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity')
    if (savedCity) {
      handleSearch(savedCity)
    }
  }, [])

  return (
    <div className="app">
      <h1 className="app-title">Weather Dashboard</h1>

      <SearchBar onSearch={handleSearch} />

      <button
        className="geo-button"
        onClick={handleGeolocation}
        disabled={loading}
        aria-label="Use current location"
      >
        📍 Use Current Location
      </button>

      {/* Status area — loading, error, or weather data */}
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
