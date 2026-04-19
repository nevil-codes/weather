// HourlyForecast.jsx — Horizontal scrolling hourly forecast strip
// Shows next 24 hours with Apple Weather–style RainEffect on precipitation cards

import RainEffect from './RainEffect'
import { shouldShowPrecipitation, getPrecipitationIntensity } from '../utils/precipitation'

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
          const showRain = shouldShowPrecipitation(hour)
          const intensity = getPrecipitationIntensity(hour.precipProbability)
          return (
            <div
              key={hour.time}
              className={`hourly-card${showRain ? ' has-rain' : ''}`}
            >
              {showRain && intensity && <RainEffect intensity={intensity} />}
              <span className="hourly-time">
                {index === 0 ? 'Now' : formatHour(hour.time)}
              </span>
              <span className="hourly-icon" role="img" aria-label={hour.description}>
                {hour.icon}
              </span>
              <span className="hourly-temp">{hour.temp}°</span>
              {hour.precipProbability >= 10 && (
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
