import type { FiveOClockReport } from '../../lib/fiveOClock'
import { Win95Window } from '../Win95Window'

const DRINKS = [
  'a piña colada with a tiny umbrella',
  'a frosty margarita, salt rim mandatory',
  'an ice-cold lemonade (we don’t judge)',
  'a mojito with too much mint',
  'a cucumber spritz',
  'a root beer float',
  'a mai tai in a novelty mug',
  'a cold brew — it counts if it’s in a fancy glass',
  'a virgin daiquiri, extra cherries',
  'a gin & tonic with exactly three ice cubes',
  'a mango lassi',
  'an old fashioned, like this website',
  'a sparkling water with a dramatic lime wedge',
  'a hot chocolate (it’s 5PM somewhere cold)',
  'a milkshake with two straws',
  'a tiki punch that arrives on fire',
]

/** Deterministic pick so the suggestion changes with the featured city. */
function pickDrink(city: string, hourKey: number): string {
  let hash = hourKey
  for (let i = 0; i < city.length; i++) {
    hash = (hash * 31 + city.charCodeAt(i)) >>> 0
  }
  return DRINKS[hash % DRINKS.length]
}

export function Bartender({
  report,
  now,
}: {
  report: FiveOClockReport
  now: Date
}) {
  const drink = pickDrink(
    report.featured.city,
    Math.floor(now.getTime() / 3_600_000),
  )

  return (
    <Win95Window title="Bartender95 Assistant" icon="🍸">
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-hidden="true">
          🍸
        </span>
        <div className="bevel-out-thin relative flex-1 bg-[#ffffcc] p-2">
          <p className="font-comic text-sm text-black">
            It looks like you&apos;re trying to relax! In{' '}
            <strong>{report.featured.city}</strong> they&apos;d recommend{' '}
            <strong>{drink}</strong>.
          </p>
        </div>
      </div>
    </Win95Window>
  )
}
