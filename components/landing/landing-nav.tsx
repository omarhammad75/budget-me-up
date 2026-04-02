'use client'

import Link from 'next/link'
import { Logo } from '@/components/shared/logo'

export function LandingNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <Logo size={30} showWordmark />

        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="h-9 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="h-9 px-4 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}
