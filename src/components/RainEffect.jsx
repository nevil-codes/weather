// RainEffect.jsx — Apple Weather–style precipitation overlay
// CSS-only animated raindrops, intensity-driven, non-intrusive
//
// Usage: <RainEffect intensity="low" /> | <RainEffect intensity="medium" /> | <RainEffect intensity="high" />
// Or:   <RainEffect probability={75} />

import { useMemo } from 'react'

/**
 * Maps a precipitation probability (0–100) to an intensity level.
 * Returns null if below activation threshold (10%).
 */
function getIntensityFromProbability(probability) {
  if (probability < 10) return null
  if (probability < 30) return 'low'
  if (probability < 60) return 'medium'
  return 'high'
}

/** Configuration for each intensity level */
const INTENSITY_CONFIG = {
  low: { dropCount: 8, className: 'rain-low' },
  medium: { dropCount: 16, className: 'rain-medium' },
  high: { dropCount: 28, className: 'rain-high' },
}

function RainEffect({ intensity, probability }) {
  // Resolve intensity — prop takes priority, then derive from probability
  const resolvedIntensity = intensity || getIntensityFromProbability(probability ?? 0)

  // Generate raindrop positions (memoized so they don't shift on re-render)
  const drops = useMemo(() => {
    if (!resolvedIntensity) return []
    const config = INTENSITY_CONFIG[resolvedIntensity]
    if (!config) return []

    return Array.from({ length: config.dropCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 1.5).toFixed(2)}s`,
      duration: `${(0.4 + Math.random() * 0.4).toFixed(2)}s`,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  }, [resolvedIntensity])

  // Don't render if below threshold
  if (!resolvedIntensity || drops.length === 0) return null

  const config = INTENSITY_CONFIG[resolvedIntensity]

  return (
    <div
      className={`rain-overlay ${config.className}`}
      aria-hidden="true"
    >
      {drops.map((drop) => (
        <span
          key={drop.id}
          className="raindrop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  )
}

export { getIntensityFromProbability }
export default RainEffect
