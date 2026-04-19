// WeatherCard.jsx — Displays weather data for a city
// Receives weather data as a prop and renders it in a styled card

function WeatherCard({ data }) {
  // If no data is passed, don't render anything
  if (!data) {
    return null
  }

  // Destructure the fields we need from the API response
  // API response structure: { name, main: { temp }, weather: [{ description, icon }] }
  const { name } = data
  const { temp } = data.main
  const { description, icon } = data.weather[0]

  // OpenWeatherMap provides icon codes — we use them to build the image URL
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div className="weather-card">
      {/* City name */}
      <h2 className="weather-city">{name}</h2>

      {/* Weather icon from OpenWeatherMap */}
      <img
        className="weather-icon"
        src={iconUrl}
        alt={description}
      />

      {/* Temperature in Celsius, rounded to 1 decimal */}
      <p className="weather-temp">{Math.round(temp)}°C</p>

      {/* Weather condition description (e.g., "light rain") */}
      <p className="weather-description">{description}</p>
    </div>
  )
}

export default WeatherCard
