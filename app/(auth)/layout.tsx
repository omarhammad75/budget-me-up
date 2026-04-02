export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{
        background: '#0B0F14',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)',
      }}
    >
      <div className="w-full max-w-sm">
        <div
          className="rounded-3xl border border-white/8 p-8"
          style={{ background: '#111827' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
