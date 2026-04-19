import RainEffect from './RainEffect'
import { shouldShowRain, getRainIntensity } from '../utils/precipitation'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dayLabel(iso, i) {
  if (i === 0) return 'Today'
  return DAYS[new Date(iso + 'T00:00:00').getDay()]
}

function DailyForecast({ days }) {
  if (!days?.length) return null

  return (
    <section className="forecast-section">
      <h2 className="forecast-title">7-Day Forecast</h2>
      <div className="daily-list">
        {days.map((day, i) => {
          const rainy = shouldShowRain(day)
          const intensity = getRainIntensity(day.precipProbability)
          return (
            <div key={day.date} className={`daily-card${rainy ? ' has-rain' : ''}`}>
              {rainy && intensity && <RainEffect intensity={intensity} />}
              <span className="daily-day">{dayLabel(day.date, i)}</span>
              <span className="daily-icon" role="img" aria-label={day.description}>{day.icon}</span>
              <span className="daily-precip-badge">
                {day.precipProbability >= 10 ? `${day.precipProbability}%` : ''}
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
