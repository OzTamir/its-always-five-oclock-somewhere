/**
 * The five o'clock engine.
 *
 * Because IANA offsets span UTC-12:00 to UTC+14:00 (including :30 and :45
 * oddballs), at any moment at least one timezone's clock reads 17:xx.
 * Everything here derives from the browser's own timezone database via Intl —
 * no network calls, no bundled data.
 */

import { ZONE_META } from './zoneMeta'

const FIVE_PM = 17 * 60

export interface Place {
  zone: string
  city: string
  region: string
  /** Minutes past local midnight, 0..1439 */
  localMinutes: number
  /** "Australia" — absent for zones missing from zone.tab */
  country?: string
  lat?: number
  lon?: number
}

const regionNames =
  typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames('en', { type: 'region' })
    : undefined

function countryName(code: string): string | undefined {
  try {
    const name = regionNames?.of(code)
    // DisplayNames echoes unknown codes back; treat that as a miss.
    return name && name !== code ? name : undefined
  } catch {
    return undefined
  }
}

export interface FiveOClockReport {
  /** The headliner: freshest 5 o'clock, famous city preferred */
  featured: Place
  /** Everyone currently living the 17:xx dream, freshest first */
  allAtFive: Place[]
  /** Where the clock strikes 17:00 next */
  nextUp: Place
  /** Minutes until nextUp hits 17:00 */
  minutesUntilNext: number
  /** Fraction of zones already past 17:00 (until midnight), 0..1 */
  pastFiveShare: number
}

/** Cities people actually recognize — preferred for the marquee spot. */
const FAMOUS = new Set([
  'New York', 'Los Angeles', 'Chicago', 'Denver', 'Toronto', 'Vancouver',
  'Mexico City', 'Havana', 'Sao Paulo', 'Buenos Aires', 'Santiago', 'Lima',
  'Honolulu', 'Anchorage', 'London', 'Dublin', 'Lisbon', 'Paris', 'Berlin',
  'Madrid', 'Rome', 'Amsterdam', 'Brussels', 'Zurich', 'Vienna', 'Prague',
  'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Warsaw', 'Athens',
  'Istanbul', 'Cairo', 'Jerusalem', 'Moscow', 'Dubai', 'Karachi', 'Kolkata',
  'Kathmandu', 'Dhaka', 'Bangkok', 'Jakarta', 'Singapore', 'Hong Kong',
  'Shanghai', 'Taipei', 'Manila', 'Seoul', 'Tokyo', 'Perth', 'Adelaide',
  'Darwin', 'Brisbane', 'Sydney', 'Melbourne', 'Auckland', 'Fiji', 'Lagos',
  'Nairobi', 'Johannesburg', 'Casablanca', 'Reykjavik', 'Tahiti', 'Azores',
])

const FALLBACK_ZONES = [
  'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles',
  'America/Denver', 'America/Chicago', 'America/New_York', 'America/Halifax',
  'America/Sao_Paulo', 'Atlantic/Azores', 'Europe/London', 'Europe/Paris',
  'Europe/Athens', 'Europe/Moscow', 'Asia/Dubai', 'Asia/Karachi',
  'Asia/Kolkata', 'Asia/Kathmandu', 'Asia/Dhaka', 'Asia/Bangkok',
  'Asia/Singapore', 'Asia/Tokyo', 'Australia/Adelaide', 'Australia/Sydney',
  'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Kiritimati',
  'Pacific/Pago_Pago', 'Pacific/Marquesas',
]

function getZones(): string[] {
  const zones =
    typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : FALLBACK_ZONES
  // Continent/City zones only: skips UTC, Etc/GMT+n and other aliases that
  // make lousy headlines.
  return zones.filter((z) => z.includes('/') && !z.startsWith('Etc/'))
}

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(zone: string): Intl.DateTimeFormat {
  let fmt = formatterCache.get(zone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })
    formatterCache.set(zone, fmt)
  }
  return fmt
}

function toPlace(zone: string, date: Date): Place | null {
  try {
    const parts = getFormatter(zone).formatToParts(date)
    let hour = NaN
    let minute = NaN
    for (const p of parts) {
      if (p.type === 'hour') hour = Number(p.value)
      if (p.type === 'minute') minute = Number(p.value)
    }
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null
    const segments = zone.split('/')
    const meta = ZONE_META[zone]
    return {
      zone,
      city: segments[segments.length - 1].replace(/_/g, ' '),
      region: segments[0],
      localMinutes: (hour % 24) * 60 + minute,
      country: meta ? countryName(meta[0]) : undefined,
      lat: meta?.[1],
      lon: meta?.[2],
    }
  } catch {
    return null
  }
}

/** Minutes past five o'clock; places before 17:00 wrap to later in the day. */
function minutesPastFive(p: Place): number {
  return (p.localMinutes - FIVE_PM + 1440) % 1440
}

function minutesUntilFive(p: Place): number {
  return (FIVE_PM - p.localMinutes + 1440) % 1440
}

/** Freshest five o'clock first; famous cities win ties, then alphabetical. */
function compareFeatured(a: Place, b: Place): number {
  const byFreshness = minutesPastFive(a) - minutesPastFive(b)
  if (byFreshness !== 0) return byFreshness
  const byFame = Number(FAMOUS.has(b.city)) - Number(FAMOUS.has(a.city))
  if (byFame !== 0) return byFame
  return a.city.localeCompare(b.city)
}

export function getFiveOClockReport(date: Date = new Date()): FiveOClockReport {
  const places = getZones()
    .map((z) => toPlace(z, date))
    .filter((p): p is Place => p !== null)

  const atFive = places
    .filter((p) => Math.floor(p.localMinutes / 60) === 17)
    .sort(compareFeatured)

  // Should be impossible thanks to the -12..+14 offset spread, but if a
  // browser ships a threadbare zone list, feature whoever is closest.
  const featured =
    atFive[0] ??
    [...places].sort(
      (a, b) =>
        Math.min(minutesPastFive(a), minutesUntilFive(a)) -
        Math.min(minutesPastFive(b), minutesUntilFive(b)),
    )[0]

  const approaching = places
    .filter((p) => minutesUntilFive(p) > 0 && Math.floor(p.localMinutes / 60) !== 17)
    .sort((a, b) => {
      const byCloseness = minutesUntilFive(a) - minutesUntilFive(b)
      if (byCloseness !== 0) return byCloseness
      const byFame = Number(FAMOUS.has(b.city)) - Number(FAMOUS.has(a.city))
      if (byFame !== 0) return byFame
      return a.city.localeCompare(b.city)
    })

  const nextUp = approaching[0] ?? featured
  const pastFive = places.filter(
    (p) => p.localMinutes >= FIVE_PM,
  ).length

  return {
    featured,
    allAtFive: atFive,
    nextUp,
    minutesUntilNext: minutesUntilFive(nextUp),
    pastFiveShare: places.length > 0 ? pastFive / places.length : 0,
  }
}

/** "Lord Howe, Australia" — or just the city when the country is unknown. */
export function placeLabel(p: Place): string {
  return p.country ? `${p.city}, ${p.country}` : p.city
}

/** "17:08" style local clock reading for a place. */
export function clockString(p: Place): string {
  const h = Math.floor(p.localMinutes / 60)
  const m = p.localMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** How the visitor's own happy hour is going. */
export interface LocalStatus {
  /** Minutes until the visitor's own 17:00; 0 when it's 17:xx right now */
  minutesUntilFive: number
  /** True from 17:00 until midnight local */
  pastFive: boolean
}

export function getLocalStatus(date: Date = new Date()): LocalStatus {
  const localMinutes = date.getHours() * 60 + date.getMinutes()
  const isFiveHour = Math.floor(localMinutes / 60) === 17
  return {
    minutesUntilFive: isFiveHour ? 0 : (FIVE_PM - localMinutes + 1440) % 1440,
    pastFive: localMinutes >= FIVE_PM,
  }
}

export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}
