// utils/precipitation.js — Precipitation intensity logic system
// Maps weather data to low/medium/high intensity for RainEffect
//
// Activation rules:
//   - precipProbability >= 10%  OR  weather code is a rain/storm type
//   - Intensity scales with probability percentage
//   - Weather code can force activation even with low probability

/** WMO codes that indicate active precipitation */
const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99])
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86])
const DRIZZLE_CODES = new Set([51, 53, 55])
const HEAVY_RAIN_CODES = new Set([65, 82, 95, 96, 99])

/**
 * Determines if a forecast item should show precipitation effects.
 * @param {Object} item - Forecast item with precipProbability, isRain, weathercode
 * @returns {boolean}
 */
export function shouldShowPrecipitation(item) {
  if (!item) return false
  return item.precipProbability >= 10 || item.isRain
}

/**
 * Maps precipitation probability to intensity level.
 * Also considers weather code for more accurate mapping.
 *
 * @param {number} probability - 0 to 100
 * @param {number} [weatherCode] - Optional WMO weather code
 * @returns {'low' | 'medium' | 'high' | null}
 */
export function getPrecipitationIntensity(probability, weatherCode) {
  // Force high intensity for heavy rain/storm codes regardless of probability
  if (weatherCode !== undefined && HEAVY_RAIN_CODES.has(weatherCode)) {
    return 'high'
  }

  // Force at least medium for active rain codes
  if (weatherCode !== undefined && RAIN_CODES.has(weatherCode) && !DRIZZLE_CODES.has(weatherCode)) {
    return probability >= 60 ? 'high' : 'medium'
  }

  // Force at least low for drizzle codes
  if (weatherCode !== undefined && DRIZZLE_CODES.has(weatherCode)) {
    return probability >= 60 ? 'medium' : 'low'
  }

  // Probability-only thresholds
  if (probability < 10) return null
  if (probability < 30) return 'low'
  if (probability < 60) return 'medium'
  return 'high'
}

/**
 * Returns a human-readable precipitation label.
 * @param {'low' | 'medium' | 'high' | null} intensity
 * @returns {string}
 */
export function getPrecipitationLabel(intensity) {
  switch (intensity) {
    case 'low': return 'Light drizzle'
    case 'medium': return 'Moderate rain'
    case 'high': return 'Heavy rain'
    default: return ''
  }
}

export { RAIN_CODES, SNOW_CODES }
