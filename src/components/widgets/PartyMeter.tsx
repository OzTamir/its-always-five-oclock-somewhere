import type { FiveOClockReport } from '../../lib/fiveOClock'
import { Win95Window } from '../Win95Window'

const BLOCKS = 20

export function PartyMeter({
  report,
  className,
}: {
  report: FiveOClockReport
  className?: string
}) {
  const percent = Math.round(report.pastFiveShare * 100)
  const filled = Math.round(report.pastFiveShare * BLOCKS)

  return (
    <Win95Window title="GlobalStatus.exe" icon="🌍" className={className}>
      <div className="flex flex-col gap-2">
        <p className="font-system text-sm">
          Scanning planet&hellip; <strong>{percent}%</strong> of the world is
          past 5PM
        </p>
        <div className="bevel-in flex gap-px bg-white p-1" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          {Array.from({ length: BLOCKS }, (_, i) => (
            <span
              key={i}
              className={`h-4 flex-1 ${i < filled ? 'bg-[#000080]' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <p className="font-comic text-xs text-[#3f3f74]">
          {percent >= 50
            ? 'the majority has spoken: it is officially evening'
            : 'the workday still has the upper hand… for now'}
        </p>
      </div>
    </Win95Window>
  )
}
