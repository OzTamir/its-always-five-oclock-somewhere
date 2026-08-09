import type { FiveOClockReport } from '../lib/fiveOClock'
import { clockString } from '../lib/fiveOClock'
import { Win95Window } from './Win95Window'
import { WordArt } from './WordArt'

export function FiveOClockHero({ report }: { report: FiveOClockReport }) {
  const { featured, allAtFive } = report
  const alsoAtFive = allAtFive
    .filter((p) => p.zone !== featured.zone)
    .filter((p, i, arr) => arr.findIndex((q) => q.city === p.city) === i)
    .slice(0, 6)

  return (
    <Win95Window
      title="5 O'Clock Finder — [RESULTS]"
      icon="🍹"
      className="w-full"
    >
      <div className="flex flex-col items-center gap-1 px-1 py-2 sm:gap-2 sm:py-4">
        <WordArt text="IT'S 5 O'CLOCK IN" variant="arch" />
        <WordArt text={featured.city.toUpperCase()} variant="wave" />

        <p className="bevel-in mt-2 flex w-full max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-white px-3 py-2 text-center font-lcd text-sm font-bold sm:text-base">
          <span>
            🕔 Local time in {featured.city}:{' '}
            <span className="text-[#000080]">{clockString(featured)}</span>
          </span>
          <span className="text-[#008000]">✔ CERTIFIED SOMEWHERE™</span>
        </p>

        {alsoAtFive.length > 0 && (
          <div className="mt-1 flex w-full max-w-xl flex-wrap items-center justify-center gap-1.5 text-center">
            <span className="font-comic text-xs text-[#3f3f74] sm:text-sm">
              also pouring in:
            </span>
            {alsoAtFive.map((p) => (
              <span
                key={p.zone}
                className="bevel-out-thin bg-face px-2 py-0.5 font-system text-xs whitespace-nowrap"
              >
                {p.city} {clockString(p)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Win95Window>
  )
}
