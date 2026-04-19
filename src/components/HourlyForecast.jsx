// HourlyForecast.jsx — Horizontal scrolling hourly forecast strip
// Shows next 24 hours with RainEffect overlay on precipitation cards

import RainEffect from './RainEffect'

const PRECIP_THRESHOLD = 10 // Show rain effect above this %

function formatHour(isoString) {
  const date = new Date(isoString)
  const hours = date.getHours()
  if (hours === 0) return '12 AM'
  if (hours === 12) return '12 PM'
  return hours > 12 ? `${hours - 12} PM` : `${hours} AM`
}

function HourlyForecast({ hours }) {
  if (!hours || hours.length === 0) return null

  return (
    <section className="forecast-section">
      <h2 className="forecast-title">Hourly Forecast</h2>
      <div className="hourly-scroll">
        {hours.map((hour, index) => {
          const showRain = hour.precipProbability >= PRECIP_THRESHOLD || hour.isRain
          return (
            <div
              key={hour.time}
              className={`hourly-card${showRain ? ' has-rain' : ''}`}
            >
              {showRain && <RainEffect probability={hour.precipProbability} />}
              <span className="hourly-time">
                {index === 0 ? 'Now' : formatHour(hour.time)}
              </span>
              <span className="hourly-icon" role="img" aria-label={hour.description}>
                {hour.icon}
              </span>
              <span className="hourly-temp">{hour.temp}°</span>
              {hour.precipProbability >= PRECIP_THRESHOLD && (
                <span className="hourly-precip">{hour.precipProbability}%</span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HourlyForecast
