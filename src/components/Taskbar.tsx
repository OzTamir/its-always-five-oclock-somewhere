export function Taskbar({ now }: { now: Date }) {
  return (
    <footer className="bevel-out fixed right-0 bottom-0 left-0 z-10 flex h-10 items-center gap-1.5 bg-face px-1.5">
      <button type="button" className="win-btn flex items-center gap-1 py-0.5 font-bold">
        <span aria-hidden="true">🪟</span> Start
      </button>
      <span className="mx-0.5 h-6 w-px bg-face-dark" aria-hidden="true" />
      <span className="bevel-in-thin hidden items-center gap-1 bg-face px-3 py-1 font-system text-sm font-bold sm:flex">
        🍹 5 O&apos;Clock Finder
      </span>
      <span className="flex-1" />
      <span className="bevel-in-thin flex items-center gap-2 px-2 py-1 font-system text-sm">
        <span aria-hidden="true">🔊</span>
        {now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </footer>
  )
}
