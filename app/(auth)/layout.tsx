export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
