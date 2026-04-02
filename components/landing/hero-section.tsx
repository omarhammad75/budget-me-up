'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingDown, TrendingUp, ShieldCheck, Smartphone } from 'lucide-react'

const floatingStats = [
  { label: 'Safe to spend', value: '$1,240', color: '#22C55E', icon: TrendingUp, sub: 'this month' },
  { label: 'Subscriptions found', value: '3', color: '#F59E0B', icon: TrendingDown, sub: 'forgotten charges' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16 overflow-hidden">
      {/* Background layers */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(99,102,241,0.22) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(34,197,94,0.15) 0%, transparent 60%)' }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — copy + CTAs */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 mb-7"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wide">
                Personal Finance, Simplified
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6"
            >
              <span className="gradient-text-hero">Know exactly</span>
              <br />
              <span className="text-foreground">where your</span>
              <br />
              <span className="text-foreground">money goes.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              Track spending, catch forgotten subscriptions, and stay
              in control — without the anxiety.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-8"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl font-semibold text-base text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  boxShadow: '0 0 32px rgba(99,102,241,0.4), 0 4px 20px rgba(0,0,0,0.35)',
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-2xl font-semibold text-base text-foreground border border-white/10 hover:border-white/20 hover:bg-white/4 transition-all duration-200"
              >
                Sign in
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-5 flex-wrap"
            >
              {[
                { icon: ShieldCheck, label: 'Secure' },
                { icon: Smartphone, label: 'Installs on iPhone' },
                { icon: Sparkles, label: 'Free to use' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 blur-3xl opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, #6366F1 0%, transparent 65%)' }}
            />

            {/* Main card */}
            <div
              className="relative w-[300px] rounded-3xl overflow-hidden border border-white/8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
              style={{ background: '#111827' }}
            >
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <span className="text-xs text-white/25 font-medium tabular-nums">9:41</span>
                <div className="flex items-center gap-1">
                  {[8, 12, 16].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-white/20" style={{ width: w }} />
                  ))}
                </div>
              </div>

              {/* Greeting */}
              <div className="flex items-center justify-between px-5 pt-2 pb-1">
                <div>
                  <p className="text-[11px] text-white/40">Good morning</p>
                  <p className="text-sm font-bold text-white">Alex 👋</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-xs">
                  👤
                </div>
              </div>

              {/* Hero spend card */}
              <div
                className="mx-4 mt-3 mb-3 rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #1a2035 60%, #111827 100%)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Safe to spend</p>
                  <span className="text-[10px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                    38% used
                  </span>
                </div>
                <p className="text-[28px] font-bold text-white tracking-tight leading-none mb-0.5">$1,240.50</p>
                <p className="text-[11px] text-white/35 mb-3">of $2,000 budget · April 2026</p>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '38%' }}
                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #4F46E5, #22C55E)' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-white/4 rounded-xl p-2.5">
                    <p className="text-[10px] text-white/35">Income</p>
                    <p className="text-sm font-bold text-green-400 tabular-nums">+$3,200</p>
                  </div>
                  <div className="bg-white/4 rounded-xl p-2.5">
                    <p className="text-[10px] text-white/35">Spent</p>
                    <p className="text-sm font-bold text-white/80 tabular-nums">$759.50</p>
                  </div>
                </div>
              </div>

              {/* Mini transaction list */}
              <div
                className="mx-4 mb-4 rounded-2xl border border-white/5 overflow-hidden"
                style={{ background: '#0d1117' }}
              >
                <p className="text-[11px] font-semibold text-white/40 px-4 pt-3 pb-2 uppercase tracking-wider">Recent</p>
                {[
                  { icon: '🍔', name: 'Chipotle', cat: 'Food', amount: '-$14.50', c: '#F59E0B' },
                  { icon: '🚗', name: 'Uber', cat: 'Transport', amount: '-$22.00', c: '#6366F1' },
                  { icon: '📱', name: 'Netflix', cat: 'Subscription', amount: '-$15.99', c: '#A78BFA' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-t border-white/5">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0"
                      style={{ backgroundColor: `${tx.c}20` }}
                    >
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/80 truncate">{tx.name}</p>
                      <p className="text-[10px] text-white/30">{tx.cat}</p>
                    </div>
                    <span className="text-xs font-semibold text-white/50 tabular-nums">{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating stat chips */}
            <motion.div
              initial={{ opacity: 0, x: 24, y: -8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -right-8 top-16 rounded-2xl border border-white/10 px-4 py-3 shadow-elevated"
              style={{ background: '#1a2035' }}
            >
              <p className="text-[10px] text-white/40 mb-0.5">Budget saved</p>
              <p className="text-lg font-bold text-green-400">+$440</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -24, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-8 bottom-24 rounded-2xl border border-white/10 px-4 py-3 shadow-elevated"
              style={{ background: '#1a2035' }}
            >
              <p className="text-[10px] text-amber-400/70 mb-0.5">Subscription found</p>
              <p className="text-sm font-bold text-amber-400">Netflix · $15.99</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center lg:hidden"
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-0.5 h-8 rounded-full bg-gradient-to-b from-primary/40 to-transparent" />
            <p className="text-xs text-muted-foreground/40">Scroll to explore</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
