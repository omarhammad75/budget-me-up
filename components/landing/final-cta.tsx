'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Smartphone, ShieldCheck, Zap, DollarSign } from 'lucide-react'
import { Logo } from '@/components/shared/logo'

const trustItems = [
  { icon: Smartphone, label: 'Installs on iPhone', sub: 'PWA — no App Store needed' },
  { icon: ShieldCheck, label: 'Private & secure', sub: 'Your data stays yours' },
  { icon: Zap, label: '60-second setup', sub: 'No bank connections required' },
  { icon: DollarSign, label: 'Free to use', sub: 'No credit card ever' },
]

export function FinalCTA() {
  return (
    <section className="py-24 px-5">
      <div className="max-w-3xl mx-auto">

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {trustItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex flex-col items-center text-center rounded-2xl border border-white/6 p-4"
                style={{ background: '#111827' }}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-indigo-400" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-semibold text-foreground leading-tight mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground/60">{item.sub}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden border border-indigo-500/20 text-center px-8 py-16"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #111827 60%, #0f1520 100%)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% -10%, rgba(99,102,241,0.3) 0%, transparent 55%)',
            }}
          />

          {/* Corner accent */}
          <div
            className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-15"
            style={{
              background: 'radial-gradient(ellipse at 100% 100%, #22C55E 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10">
            <Logo size={52} className="justify-center mb-6" />

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Take control of your finances today.
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed">
              Free. Installs on your iPhone. Takes 60 seconds to set up.
              No spreadsheets. No stress.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl font-semibold text-base text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 4px 20px rgba(0,0,0,0.35)',
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-2xl font-semibold text-base text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                Already have an account
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground/40">
          <span>© 2026 BudgetMeUp</span>
          <span>·</span>
          <Link href="/login" className="hover:text-muted-foreground transition-colors">Sign in</Link>
          <span>·</span>
          <Link href="/signup" className="hover:text-muted-foreground transition-colors">Sign up</Link>
        </div>
      </div>
    </section>
  )
}
