import { useId } from 'react'

type Variant = 'arch' | 'wave'

interface WordArtProps {
  text: string
  variant?: Variant
  className?: string
}

interface Preset {
  viewBox: string
  path: string
  fontSize: number
  textLength: number
  stops: Array<{ offset: string; color: string }>
  stroke: string
  shadow: string
  shadowOffset: { x: number; y: number }
}

/**
 * Two beloved presets from the WordArt gallery: "Arch Up" and the wavy one
 * everybody used for birthday flyers. Arial Black on a curve, gradient fill,
 * hard outline, extruded shadow. Rendered as SVG so the curve and the
 * stretch-to-fit survive any city name length and any screen width.
 */
const PRESETS: Record<Variant, Preset> = {
  arch: {
    viewBox: '0 0 1000 300',
    path: 'M 40 250 Q 500 40 960 250',
    fontSize: 92,
    textLength: 880,
    stops: [
      { offset: '0%', color: '#ff1493' },
      { offset: '35%', color: '#ff8c00' },
      { offset: '65%', color: '#ffd700' },
      { offset: '100%', color: '#00bfff' },
    ],
    stroke: '#1a1a5e',
    shadow: '#3f3f74',
    shadowOffset: { x: 10, y: 12 },
  },
  wave: {
    viewBox: '0 0 1000 280',
    path: 'M 30 170 Q 265 70 500 170 T 970 170',
    fontSize: 118,
    textLength: 900,
    stops: [
      { offset: '0%', color: '#fff200' },
      { offset: '45%', color: '#ff7f00' },
      { offset: '100%', color: '#e4007c' },
    ],
    stroke: '#5e0a1a',
    shadow: '#742f3f',
    shadowOffset: { x: 12, y: 14 },
  },
}

export function WordArt({ text, variant = 'arch', className = '' }: WordArtProps) {
  const id = useId()
  const preset = PRESETS[variant]
  const gradientId = `wordart-fill-${id}`
  const pathId = `wordart-path-${id}`
  const fontFamily = "'Arial Black', 'Arial Bold', Impact, sans-serif"

  const textPathProps = {
    href: `#${pathId}`,
    startOffset: '50%',
    textAnchor: 'middle',
    textLength: preset.textLength,
    lengthAdjust: 'spacingAndGlyphs',
  } as const

  return (
    <svg
      viewBox={preset.viewBox}
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          {preset.stops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <path id={pathId} d={preset.path} fill="none" />
      </defs>
      {/* Extruded shadow: same text nudged down-right, drawn first */}
      <g
        transform={`translate(${preset.shadowOffset.x}, ${preset.shadowOffset.y})`}
        opacity="0.85"
      >
        <text
          fontFamily={fontFamily}
          fontSize={preset.fontSize}
          fontWeight="900"
          fill={preset.shadow}
        >
          <textPath {...textPathProps}>{text}</textPath>
        </text>
      </g>
      <text
        fontFamily={fontFamily}
        fontSize={preset.fontSize}
        fontWeight="900"
        fill={`url(#${gradientId})`}
        stroke={preset.stroke}
        strokeWidth="2.5"
        paintOrder="stroke"
      >
        <textPath {...textPathProps}>{text}</textPath>
      </text>
    </svg>
  )
}
