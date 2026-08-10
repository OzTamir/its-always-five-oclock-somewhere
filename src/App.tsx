import { useMemo } from 'react'
import { FiveOClockHero } from './components/FiveOClockHero'
import { Taskbar } from './components/Taskbar'
import { Ticker } from './components/Ticker'
import { Bartender } from './components/widgets/Bartender'
import { NextUp } from './components/widgets/NextUp'
import { PartyMeter } from './components/widgets/PartyMeter'
import { YourClock } from './components/widgets/YourClock'
import { useNow } from './hooks/useNow'
import { getFiveOClockReport } from './lib/fiveOClock'

function App() {
  const now = useNow()
  // The report only changes when a minute ticks over; the seconds tick is
  // for countdowns and the taskbar clock.
  const minuteKey = Math.floor(now.getTime() / 60_000)
  const report = useMemo(
    () => getFiveOClockReport(new Date(minuteKey * 60_000)),
    [minuteKey],
  )

  return (
    <main className="min-h-full bg-desktop">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 p-3 pb-16 sm:gap-4 sm:p-6 sm:pb-20">
        <Ticker report={report} />
        <FiveOClockHero report={report} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <NextUp report={report} now={now} />
          <PartyMeter report={report} />
          <Bartender report={report} now={now} />
          <YourClock now={now} />
        </div>
        <p className="text-center font-comic text-xs text-white/80">
          itsalwaysfiveoclocksomewhere.com — est. 2026, designed for 1996 ·
          please drink responsibly, wherever it&apos;s five
        </p>
      </div>
      <Taskbar now={now} />
    </main>
  )
}

export default App
