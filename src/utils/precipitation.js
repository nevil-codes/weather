const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99])
const DRIZZLE_CODES = new Set([51, 53, 55])
const HEAVY_CODES = new Set([65, 82, 95, 96, 99])

export function shouldShowRain(item) {
  if (!item) return false
  return item.precipProbability >= 10 || item.isRain
}

export function getRainIntensity(probability, code) {
  // weather code can override thresholds for more accurate visuals
  if (code !== undefined && HEAVY_CODES.has(code)) return 'high'
  if (code !== undefined && RAIN_CODES.has(code) && !DRIZZLE_CODES.has(code)) {
    return probability >= 60 ? 'high' : 'medium'
  }
  if (code !== undefined && DRIZZLE_CODES.has(code)) {
    return probability >= 60 ? 'medium' : 'low'
  }

  if (probability < 10) return null
  if (probability < 30) return 'low'
  if (probability < 60) return 'medium'
  return 'high'
}
