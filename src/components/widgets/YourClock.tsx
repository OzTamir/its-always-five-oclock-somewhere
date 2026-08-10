import { formatDuration, getLocalStatus } from '../../lib/fiveOClock'
import { Win95Window } from '../Win95Window'

export function YourClock({ now }: { now: Date }) {
  const status = getLocalStatus(now)

  return (
    <Win95Window title="LocalStatus.exe" icon="🖥️">
      <div className="flex flex-col gap-1 font-system text-sm">
        <p>
          Your local time:{' '}
          <strong>
            {now.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </strong>
        </p>
        {status.minutesUntilFive === 0 ? (
          <p className="font-comic text-[#008000]">
            ★ IT&apos;S 5 O&apos;CLOCK RIGHT HERE, RIGHT NOW ★ You are the
            somewhere!
          </p>
        ) : status.pastFive ? (
          <p className="font-comic text-[#008000]">
            You&apos;re past five. Whatever you&apos;re doing, you&apos;ve
            earned a break. 🍻
          </p>
        ) : (
          <p className="font-comic text-[#aa0000]">
            Only <strong>{formatDuration(status.minutesUntilFive)}</strong>{' '}
            until it&apos;s 5PM <em>your</em> time. Until then, celebrate
            vicariously.
          </p>
        )}
      </div>
    </Win95Window>
  )
}
