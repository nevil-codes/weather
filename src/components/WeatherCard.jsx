// WeatherCard.jsx — Displays weather data for a city
// Receives formatted weather data as a prop and renders it in a styled card

function WeatherCard({ data }) {
  // If no data is passed, don't render anything
  if (!data) {
    return null
  }

  // Data comes pre-formatted from our API utility:
  // { name, temp, description, icon (emoji), windspeed }
  const { name, temp, description, icon, windspeed } = data

  return (
    <div className="weather-card">
      {/* City name and country */}
      <h2 className="weather-city">{name}</h2>

      {/* Weather emoji icon */}
      <span className="weather-icon">{icon}</span>

      {/* Temperature in Celsius */}
      <p className="weather-temp">{temp}°C</p>

      {/* Weather condition description */}
      <p className="weather-description">{description}</p>

      {/* Wind speed */}
      <p className="weather-wind">💨 {windspeed} km/h</p>
    </div>
  )
}

export default WeatherCard
