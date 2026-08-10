import type { ReactNode } from 'react'

interface Win95WindowProps {
  title: string
  icon?: string
  children: ReactNode
  className?: string
  /** Renders the fake window controls; on by default */
  controls?: boolean
}

function TitleBarButton({ glyph, label }: { glyph: string; label: string }) {
  return (
    <span
      aria-hidden="true"
      title={label}
      className="bevel-out-thin flex h-4 w-4 items-center justify-center bg-face font-system text-[10px] leading-none font-bold text-black"
    >
      {glyph}
    </span>
  )
}

export function Win95Window({
  title,
  icon,
  children,
  className = '',
  controls = true,
}: Win95WindowProps) {
  return (
    <section className={`bevel-out bg-face p-1 ${className}`}>
      <header className="flex items-center gap-1 bg-gradient-to-r from-title-from to-title-to px-1.5 py-0.5">
        {icon && <span className="text-sm leading-none">{icon}</span>}
        <h2 className="min-w-0 flex-1 truncate font-system text-sm font-bold text-title-text">
          {title}
        </h2>
        {controls && (
          <span className="flex gap-0.5">
            <TitleBarButton glyph="_" label="Minimize" />
            <TitleBarButton glyph="□" label="Maximize" />
            <TitleBarButton glyph="✕" label="Close" />
          </span>
        )}
      </header>
      <div className="p-2 sm:p-3">{children}</div>
    </section>
  )
}
