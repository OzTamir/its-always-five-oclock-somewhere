import { useMemo } from 'react'
import { FiveOClockHero } from './components/FiveOClockHero'
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
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-3 sm:p-6">
        <FiveOClockHero report={report} />
      </div>
    </main>
  )
}

export default App
