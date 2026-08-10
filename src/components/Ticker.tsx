import type { FiveOClockReport } from '../lib/fiveOClock'
import { placeLabel } from '../lib/fiveOClock'

export function Ticker({ report }: { report: FiveOClockReport }) {
  const places = report.allAtFive
    .map((p) => placeLabel(p))
    .filter((c, i, arr) => arr.indexOf(c) === i)
    .slice(0, 12)

  const message = `+++ IT IS CURRENTLY 5 O'CLOCK IN: ${places.join(' • ')} `

  return (
    <div className="bevel-in overflow-hidden bg-black py-1 whitespace-nowrap">
      <div className="inline-flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden={i === 1}
            className="pr-2 font-lcd text-sm font-bold text-sunny"
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}
