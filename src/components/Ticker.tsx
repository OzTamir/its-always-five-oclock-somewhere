import type { FiveOClockReport } from '../lib/fiveOClock'

export function Ticker({ report }: { report: FiveOClockReport }) {
  const cities = report.allAtFive
    .map((p) => p.city)
    .filter((c, i, arr) => arr.indexOf(c) === i)
    .slice(0, 12)

  const message = `+++ IT IS CURRENTLY 5 O'CLOCK IN: ${cities.join(' • ')} +++ BYOB +++ best viewed at 800×600 +++ `

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
