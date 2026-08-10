import { useId } from 'react'

export type Variant = 'arch' | 'wave' | 'valley' | 'chrome' | 'sunset' | 'fiesta'

/** The presets the city name draws from — one is picked per visit. */
export const CITY_VARIANTS: Variant[] = [
  'wave',
  'valley',
  'chrome',
  'sunset',
  'fiesta',
]

interface WordArtProps {
  text: string
  variant?: Variant
  /** Borrow another preset's colors while keeping this variant's geometry */
  palette?: Variant
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
  /** Extra transform on the whole word, e.g. the classic chrome skew */
  transform?: string
}

/**
 * The WordArt gallery, faithfully reimagined: Arial Black on a curve,
 * gradient fill, hard outline, extruded shadow. Rendered as SVG so the curve
 * and the stretch-to-fit survive any city name length and any screen width.
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
  valley: {
    viewBox: '0 0 1000 300',
    path: 'M 30 110 Q 500 260 970 110',
    fontSize: 104,
    textLength: 900,
    stops: [
      { offset: '0%', color: '#c6ff5e' },
      { offset: '50%', color: '#00c853' },
      { offset: '100%', color: '#0091ea' },
    ],
    stroke: '#0a4a1e',
    shadow: '#2f5e3f',
    shadowOffset: { x: 11, y: 13 },
  },
  chrome: {
    viewBox: '0 0 1000 250',
    path: 'M 40 185 L 960 185',
    fontSize: 122,
    textLength: 860,
    stops: [
      { offset: '0%', color: '#e8f4ff' },
      { offset: '38%', color: '#9cc6e8' },
      { offset: '55%', color: '#1f3d78' },
      { offset: '62%', color: '#d8ecff' },
      { offset: '100%', color: '#4a6ab0' },
    ],
    stroke: '#16324f',
    shadow: '#3a3a3a',
    shadowOffset: { x: 12, y: 12 },
    transform: 'skewX(-8)',
  },
  sunset: {
    viewBox: '0 0 1000 300',
    path: 'M 40 235 L 960 125',
    fontSize: 108,
    textLength: 880,
    stops: [
      { offset: '0%', color: '#ff8c00' },
      { offset: '55%', color: '#f107a3' },
      { offset: '100%', color: '#7b2ff7' },
    ],
    stroke: '#3a0a5e',
    shadow: '#4d2f74',
    shadowOffset: { x: 11, y: 13 },
  },
  fiesta: {
    viewBox: '0 0 1000 300',
    path: 'M 40 220 Q 500 105 960 220',
    fontSize: 100,
    textLength: 890,
    stops: [
      { offset: '0%', color: '#ff2400' },
      { offset: '33%', color: '#ffd700' },
      { offset: '66%', color: '#00c853' },
      { offset: '100%', color: '#2962ff' },
    ],
    stroke: '#1a1a5e',
    shadow: '#3f3f74',
    shadowOffset: { x: 10, y: 12 },
  },
}

export function WordArt({
  text,
  variant = 'arch',
  palette,
  className = '',
}: WordArtProps) {
  const id = useId()
  const geometry = PRESETS[variant]
  const colors = PRESETS[palette ?? variant]
  const preset = {
    ...geometry,
    stops: colors.stops,
    stroke: colors.stroke,
    shadow: colors.shadow,
  }
  const gradientId = `wordart-fill-${id}`
  const pathId = `wordart-path-${id}`
  const fontFamily = "'Arial Black', 'Arial Bold', Impact, sans-serif"

  // Stretch-to-fit like the real thing, but stop short names ("FIJI") from
  // being pulled into taffy: never wider than ~1em per character.
  const textPathProps = {
    href: `#${pathId}`,
    startOffset: '50%',
    textAnchor: 'middle',
    textLength: Math.min(preset.textLength, text.length * preset.fontSize),
    lengthAdjust: 'spacingAndGlyphs',
  } as const

  return (
    <svg
      viewBox={preset.viewBox}
      className={`h-auto w-full select-none ${className}`}
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
      <g transform={preset.transform}>
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
      </g>
    </svg>
  )
}
