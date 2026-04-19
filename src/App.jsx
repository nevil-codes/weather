// App.jsx — Root component of the Weather Dashboard
// Manages all application state and coordinates data flow

import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
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

      {/* Status area — loading, error, or weather card */}
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

        {weather && !loading && <WeatherCard data={weather} />}
      </div>
    </div>
  )
}

export default App
