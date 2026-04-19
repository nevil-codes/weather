// App.jsx — Root component of the Weather App
// Imports both child components and provides the page layout

import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import './index.css'

function App() {
  return (
    // Main wrapper — centers everything on screen
    <div className="app">
      <h1 className="app-title">🌤️ Weather App</h1>

      {/* Search bar for entering a city name */}
      <SearchBar />

      {/* Card that will display the weather data */}
      <WeatherCard />
    </div>
  )
}

export default App
