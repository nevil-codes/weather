// DailyForecast.jsx — 7-day forecast list with Apple Weather layout
// Shows precipitation probability and RainEffect overlay on rainy days

import RainEffect from './RainEffect'
import { shouldShowPrecipitation, getPrecipitationIntensity } from '../utils/precipitation'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDay(isoString, index) {
  if (index === 0) return 'Today'
  const date = new Date(isoString + 'T00:00:00')
  return DAY_NAMES[date.getDay()]
}

function DailyForecast({ days }) {
  if (!days || days.length === 0) return null

  return (
    <section className="forecast-section">
      <h2 className="forecast-title">7-Day Forecast</h2>
      <div className="daily-list">
        {days.map((day, index) => {
          const showRain = shouldShowPrecipitation(day)
          const intensity = getPrecipitationIntensity(day.precipProbability)
          return (
            <div
              key={day.date}
              className={`daily-card${showRain ? ' has-rain' : ''}`}
            >
              {showRain && intensity && <RainEffect intensity={intensity} />}
              <span className="daily-day">{formatDay(day.date, index)}</span>
              <span className="daily-icon" role="img" aria-label={day.description}>
                {day.icon}
              </span>
              <span className="daily-precip-badge">
                {day.precipProbability >= 10
                  ? `${day.precipProbability}%`
                  : ''}
              </span>
              <div className="daily-temp-range">
                <span className="daily-temp-high">{day.high}°</span>
                <span className="daily-temp-low">{day.low}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default DailyForecast
