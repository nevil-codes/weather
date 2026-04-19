import { useMemo } from 'react'

const INTENSITY_CONFIG = {
  low: { count: 8, className: 'rain-low' },
  medium: { count: 16, className: 'rain-medium' },
  high: { count: 28, className: 'rain-high' },
}

function intensityFromProbability(prob) {
  if (prob < 10) return null
  if (prob < 30) return 'low'
  if (prob < 60) return 'medium'
  return 'high'
}

function RainEffect({ intensity, probability }) {
  const level = intensity || intensityFromProbability(probability ?? 0)

  // memoize random positions so they don't jump on re-renders
  const drops = useMemo(() => {
    if (!level) return []
    const config = INTENSITY_CONFIG[level]
    if (!config) return []

    return Array.from({ length: config.count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 1.5).toFixed(2)}s`,
      duration: `${(0.4 + Math.random() * 0.4).toFixed(2)}s`,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  }, [level])

  if (!level || drops.length === 0) return null

  const config = INTENSITY_CONFIG[level]

  return (
    <div className={`rain-overlay ${config.className}`} aria-hidden="true">
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

export default RainEffect
