import { useState } from 'react'
import type { FiveOClockReport } from '../lib/fiveOClock'
import { clockString, placeLabel } from '../lib/fiveOClock'
import { GlobePanel } from './GlobePanel'
import { Win95Window } from './Win95Window'
import type { Variant } from './WordArt'
import { CITY_VARIANTS, WordArt } from './WordArt'

/** Easter eggs: ?city=Anywhere / ?style=chrome (also how we test lengths). */
function readOverrides(): { city?: string; style?: Variant } {
  const params = new URLSearchParams(window.location.search)
  const style = params.get('style') as Variant | null
  return {
    city: params.get('city') ?? undefined,
    style: style && CITY_VARIANTS.includes(style) ? style : undefined,
  }
}

export function FiveOClockHero({ report }: { report: FiveOClockReport }) {
  // One WordArt preset per visit — reload for a new masterpiece.
  const [{ city: cityOverride, style }] = useState(readOverrides)
  const [variant] = useState(
    () =>
      style ?? CITY_VARIANTS[Math.floor(Math.random() * CITY_VARIANTS.length)],
  )

  const { featured, allAtFive } = report
  const displayCity = cityOverride ?? featured.city
  const alsoAtFive = allAtFive
    .filter((p) => p.zone !== featured.zone)
    .filter((p, i, arr) => arr.findIndex((q) => q.city === p.city) === i)
    .slice(0, 6)

  return (
    <Win95Window
      title="It's Always 5 O'Clock Somewhere"
      icon="🍹"
      className="w-full"
    >
      <div className="flex flex-col items-center gap-0 px-1 py-2 sm:py-3">
        <WordArt
          text="IT'S 5 O'CLOCK IN"
          variant="arch"
          palette={variant}
          className="max-w-xl"
        />
        <WordArt
          text={displayCity.toUpperCase()}
          variant={variant}
          className="-mt-6 max-w-xl sm:-mt-10"
        />

        {cityOverride ? (
          <p className="mt-2 font-comic text-sm text-[#3f3f74]">
            (demo mode — timezone science temporarily suspended)
          </p>
        ) : (
          <>
            <div className="-mt-1 w-full max-w-sm sm:-mt-4">
              <GlobePanel place={featured} />
            </div>
            <p className="bevel-in mt-2 w-full max-w-xl bg-white px-3 py-2 text-center font-lcd text-sm font-bold sm:text-base">
              🕔 Local time in {placeLabel(featured)}:{' '}
              <span className="text-[#000080]">{clockString(featured)}</span>
            </p>

            {alsoAtFive.length > 0 && (
              <div className="mt-2 flex w-full max-w-xl flex-wrap items-center justify-center gap-1.5 text-center">
                <span className="font-comic text-xs text-[#3f3f74] sm:text-sm">
                  also pouring in:
                </span>
                {alsoAtFive.map((p) => (
                  <span
                    key={p.zone}
                    className="bevel-out-thin bg-face px-2 py-0.5 font-system text-xs whitespace-nowrap"
                  >
                    {placeLabel(p)} {clockString(p)}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Win95Window>
  )
}
