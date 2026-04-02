import { cn } from '@/lib/utils/cn'

interface LogoProps {
  size?: number
  className?: string
  showWordmark?: boolean
}

export function Logo({ size = 32, className, showWordmark = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logo-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="logo-arrow" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#F9FAFB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F9FAFB" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="logo-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="#0B0F14" />
        <circle
          cx="50" cy="50" r="44"
          stroke="url(#logo-ring)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="246 30"
          strokeDashoffset="-8"
        />
        <text
          x="50" y="67"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
          fontSize="48"
          fontWeight="800"
          fill="url(#logo-b)"
          textAnchor="middle"
          letterSpacing="-2"
        >
          B
        </text>
        <path
          d="M50 74 L50 22"
          stroke="url(#logo-arrow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M43.5 30 L50 22 L56.5 30"
          stroke="url(#logo-arrow)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showWordmark && (
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: size * 0.5 }}
        >
          Budget<span className="text-primary">Me</span>Up
        </span>
      )}
    </div>
  )
}
