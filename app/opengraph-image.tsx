import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BudgetMeUp — Know exactly where your money goes'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0F14',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 50% -10%, rgba(99,102,241,0.35) 0%, transparent 55%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 400,
            height: 400,
            background:
              'radial-gradient(ellipse at 100% 100%, rgba(34,197,94,0.18) 0%, transparent 60%)',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40,
            position: 'relative',
          }}
        >
          {/* SVG logo inline */}
          <svg width="72" height="72" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="r" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill="#0B0F14" />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#r)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="246 30"
              strokeDashoffset="-8"
            />
            <text
              x="50"
              y="67"
              fontSize="48"
              fontWeight="800"
              fill="#F9FAFB"
              textAnchor="middle"
              letterSpacing="-2"
            >
              B
            </text>
          </svg>

          <span
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: '#F9FAFB',
              letterSpacing: '-1px',
            }}
          >
            Budget
            <span style={{ color: '#6366F1' }}>Me</span>
            Up
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: '#F9FAFB',
            textAlign: 'center',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            maxWidth: 900,
            position: 'relative',
          }}
        >
          Know exactly where
          <br />
          <span style={{ color: '#6366F1' }}>your money goes.</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(249,250,251,0.5)',
            marginTop: 28,
            textAlign: 'center',
            maxWidth: 640,
            lineHeight: 1.5,
            position: 'relative',
          }}
        >
          Track spending, catch subscriptions, stay in control.
          <br />
          Free. Installs on iPhone. 60-second setup.
        </div>

        {/* Pills */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 44,
            position: 'relative',
          }}
        >
          {['💚 Safe to spend', '📊 Spending clarity', '🔔 Smart alerts'].map((label) => (
            <div
              key={label}
              style={{
                padding: '10px 20px',
                borderRadius: 100,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(249,250,251,0.7)',
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
