import RainEffect from './RainEffect'
import { shouldShowRain, getRainIntensity } from '../utils/precipitation'

function formatHour(iso) {
  const h = new Date(iso).getHours()
  if (h === 0) return '12 AM'
  if (h === 12) return '12 PM'
  return h > 12 ? `${h - 12} PM` : `${h} AM`
}

function HourlyForecast({ hours }) {
  if (!hours?.length) return null

  return (
    <section className="forecast-section">
      <h2 className="forecast-title">Hourly Forecast</h2>
      <div className="hourly-scroll">
        {hours.map((hour, i) => {
          const rainy = shouldShowRain(hour)
          const intensity = getRainIntensity(hour.precipProbability)
          return (
            <div key={hour.time} className={`hourly-card${rainy ? ' has-rain' : ''}`}>
              {rainy && intensity && <RainEffect intensity={intensity} />}
              <span className="hourly-time">{i === 0 ? 'Now' : formatHour(hour.time)}</span>
              <span className="hourly-icon" role="img" aria-label={hour.description}>{hour.icon}</span>
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
