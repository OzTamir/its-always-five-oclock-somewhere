import type { Place } from '../lib/fiveOClock'
import { placeLabel } from '../lib/fiveOClock'
import { ZONE_META } from '../lib/zoneMeta'

const GRID = 3

function project(lat: number, lon: number): { x: number; y: number } {
  return {
    x: Math.round((lon + 180) / GRID) * GRID,
    y: Math.round((90 - lat) / GRID) * GRID,
  }
}

/**
 * The world as the timezone database sees it: every IANA zone's reference
 * city becomes one chunky pixel, and the continents draw themselves.
 */
const LAND_PIXELS: Array<{ x: number; y: number }> = (() => {
  const seen = new Set<string>()
  const pixels: Array<{ x: number; y: number }> = []
  for (const [, lat, lon] of Object.values(ZONE_META)) {
    const p = project(lat, lon)
    const key = `${p.x},${p.y}`
    if (!seen.has(key)) {
      seen.add(key)
      pixels.push(p)
    }
  }
  return pixels
})()

export function GlobePanel({ place }: { place: Place }) {
  const pin =
    place.lat !== undefined && place.lon !== undefined
      ? project(place.lat, place.lon)
      : null

  return (
    <svg
      viewBox="0 0 360 180"
      className="bevel-in h-auto w-full select-none bg-[#000040]"
      role="img"
      aria-label={`World map pinpointing ${placeLabel(place)}`}
    >
      {LAND_PIXELS.map((p) => (
        <rect
          key={`${p.x},${p.y}`}
          x={p.x - 1}
          y={p.y - 1}
          width={2.5}
          height={2.5}
          fill="#00a86b"
        />
      ))}
      {pin && (
        <g className="animate-blink">
          <circle
            cx={pin.x}
            cy={pin.y}
            r={5}
            fill="none"
            stroke="#ff2400"
            strokeWidth={1.5}
          />
          <line x1={pin.x - 9} y1={pin.y} x2={pin.x + 9} y2={pin.y} stroke="#ff2400" strokeWidth={1.5} />
          <line x1={pin.x} y1={pin.y - 9} x2={pin.x} y2={pin.y + 9} stroke="#ff2400" strokeWidth={1.5} />
        </g>
      )}
      {pin && <circle cx={pin.x} cy={pin.y} r={2} fill="#ffd700" />}
    </svg>
  )
}
