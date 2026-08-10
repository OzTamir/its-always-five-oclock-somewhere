import type { FiveOClockReport } from '../../lib/fiveOClock'
import { Win95Window } from '../Win95Window'

export function NextUp({
  report,
  now,
}: {
  report: FiveOClockReport
  now: Date
}) {
  const secondsLeft = Math.max(
    0,
    report.minutesUntilNext * 60 - now.getSeconds(),
  )
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const imminent = secondsLeft <= 60

  return (
    <Win95Window title="Next Round.exe" icon="⏰">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-system text-sm">
          The clock strikes five next in{' '}
          <strong className="text-[#000080]">{report.nextUp.city}</strong>
        </p>
        <p
          className={`bevel-in bg-black px-4 py-1 font-lcd text-3xl font-bold ${
            imminent ? 'animate-blink text-[#ff5555]' : 'text-[#55ff55]'
          }`}
        >
          {mm}:{ss}
        </p>
        <p className="font-comic text-xs text-[#3f3f74]">
          {imminent ? 'GLASSES READY!!' : 'plenty of time to find a coaster'}
        </p>
      </div>
    </Win95Window>
  )
}
