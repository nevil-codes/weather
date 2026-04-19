// WeatherCard.jsx — Production weather data display
// Glassmorphism card with structured layout and visual hierarchy

function WeatherCard({ data }) {
  if (!data) return null

  const { name, temp, description, icon, windspeed } = data

  return (
    <div className="weather-card">
      <p className="weather-location">{name}</p>

      <div className="weather-main">
        <span className="weather-icon" role="img" aria-label={description}>
          {icon}
        </span>
        <span className="weather-temp">{temp}°</span>
      </div>

      <p className="weather-description">{description}</p>

      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{windspeed} km/h</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{temp}°C</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
