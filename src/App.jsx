// App.jsx — Root component of the Weather App
// Manages weather data state and handles API calls

import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import { fetchWeather } from './api/weather'
import './index.css'

function App() {
  // State for the weather data returned from the API
  const [weather, setWeather] = useState(null)

  // State for loading indicator (true while fetching)
  const [loading, setLoading] = useState(false)

  // State for error messages (e.g., city not found)
  const [error, setError] = useState(null)

  /**
   * Called when the user searches for a city.
   * Fetches weather data and updates state accordingly.
   */
  const handleSearch = async (city) => {
    setLoading(true)   // Show loading state
    setError(null)     // Clear any previous errors
    setWeather(null)   // Clear previous weather data

    try {
      const data = await fetchWeather(city)
      setWeather(data)  // Store the API response
    } catch (err) {
      setError(err.message)  // Store the error message
    } finally {
      setLoading(false)  // Hide loading state regardless of success/failure
    }
  }

  return (
    <div className="app">
      <h1 className="app-title">🌤️ Weather App</h1>

      {/* Pass handleSearch as callback to SearchBar */}
      <SearchBar onSearch={handleSearch} />

      {/* Loading indicator */}
      {loading && <p className="loading-text">Loading...</p>}

      {/* Error message */}
      {error && <p className="error-text">{error}</p>}

      {/* Weather data card — only renders when data exists */}
      <WeatherCard data={weather} />
    </div>
  )
}

export default App
