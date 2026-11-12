interface BrandMarkProps {
  size?: number
  className?: string
}

/** Inline O.G. mark matching public/favicon.svg for crisp splash/header use. */
export function BrandMark({ size = 96, className = '' }: BrandMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#0b4d2c" stroke="#f3ecdc" strokeWidth="3" />
      <path d="M6 40h52" stroke="#c8102e" strokeWidth="5" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="Bebas Neue, Impact, Arial Narrow, sans-serif"
        fontSize="25"
        fill="#f3ecdc"
        letterSpacing="1"
      >
        O.G.
      </text>
    </svg>
  )
}
