import { useId } from 'react'

interface WordArtProps {
  text: string
  className?: string
}

/**
 * The classic "Arch Up" WordArt preset: Arial Black on a curve, rainbow
 * gradient fill, hard outline, extruded shadow. Rendered as SVG so the arch
 * and stretch-to-fit survive any city name length and any screen width.
 */
export function WordArt({ text, className = '' }: WordArtProps) {
  const id = useId()
  const gradientId = `wordart-fill-${id}`
  const arcId = `wordart-arc-${id}`

  return (
    <svg
      viewBox="0 0 1000 300"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff1493" />
          <stop offset="35%" stopColor="#ff8c00" />
          <stop offset="65%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#00bfff" />
        </linearGradient>
        <path id={arcId} d="M 40 250 Q 500 40 960 250" fill="none" />
      </defs>
      {/* Extruded shadow: same text nudged down-right, drawn first */}
      <g transform="translate(10, 12)" opacity="0.85">
        <text
          fontFamily="'Arial Black', 'Arial Bold', Impact, sans-serif"
          fontSize="92"
          fontWeight="900"
          fill="#3f3f74"
        >
          <textPath
            href={`#${arcId}`}
            startOffset="50%"
            textAnchor="middle"
            textLength="880"
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </textPath>
        </text>
      </g>
      <text
        fontFamily="'Arial Black', 'Arial Bold', Impact, sans-serif"
        fontSize="92"
        fontWeight="900"
        fill={`url(#${gradientId})`}
        stroke="#1a1a5e"
        strokeWidth="2.5"
        paintOrder="stroke"
      >
        <textPath
          href={`#${arcId}`}
          startOffset="50%"
          textAnchor="middle"
          textLength="880"
          lengthAdjust="spacingAndGlyphs"
        >
          {text}
        </textPath>
      </text>
    </svg>
  )
}
