'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Smartphone } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 60%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(34,197,94,0.15) 0%, transparent 60%)' }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/22 bg-indigo-500/7 mb-7"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wide">
                Personal Finance, Simplified
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-5"
            >
              <span className="gradient-text-hero">Know exactly</span>
              <br />
              <span className="text-foreground">where your</span>
              <br />
              <span className="text-foreground">money goes.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-[1.05rem] text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed mb-9"
            >
              Track spending, catch forgotten subscriptions, and stay
              in control — without the anxiety.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center lg:items-start justify-center lg:justify-start gap-3 mb-8"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl font-semibold text-[15px] text-white transition-all duration-200 hover:scale-[1.015] active:scale-[0.98]"
                style={{
                  background:  'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  boxShadow:   '0 0 36px rgba(99,102,241,0.38), 0 4px 20px rgba(0,0,0,0.35)',
                }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-14 px-7 rounded-2xl font-medium text-[15px] text-foreground/70 border border-white/10 hover:border-white/18 hover:text-foreground hover:bg-white/3 transition-all duration-200"
              >
                Sign in
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex items-center justify-center lg:justify-start gap-5 flex-wrap"
            >
              {[
                { icon: ShieldCheck, label: 'Private & secure' },
                { icon: Smartphone,  label: 'Installs on iPhone' },
                { icon: Sparkles,    label: 'Free to use' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Mobile-only social proof chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="lg:hidden mt-10 flex items-center justify-center gap-3 flex-wrap"
            >
              {[
                { value: '$219', label: 'avg saved on subs', color: '#4ADE80' },
                { value: '60s',  label: 'setup time',        color: '#818CF8' },
                { value: '100%', label: 'private',           color: '#FBBF24' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center px-4 py-2.5 rounded-2xl border"
                  style={{
                    background:  'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-base font-extrabold font-mono-numbers" style={{ color: s.color }}>
                    {s.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground/45 mt-0.5">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — phone mockup (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, #6366F1 0%, transparent 65%)' }}
            />

            {/* Phone shell */}
            <div
              className="relative w-[290px] rounded-[36px] overflow-hidden border shadow-[0_40px_96px_rgba(0,0,0,0.55)]"
              style={{
                background:  '#111827',
                borderColor: 'rgba(255,255,255,0.09)',
              }}
            >
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <span className="text-xs text-white/22 font-medium tabular-nums">9:41</span>
                <div className="flex items-center gap-1">
                  {[8, 11, 14].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-white/18" style={{ width: w }} />
                  ))}
                </div>
              </div>

              {/* Greeting */}
              <div className="flex items-center justify-between px-5 pt-2 pb-1">
                <div>
                  <p className="text-[10px] text-white/35">Good morning</p>
                  <p className="text-[13px] font-bold text-white">Alex 👋</p>
                </div>
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-xs"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.22)' }}
                >
                  👤
                </div>
              </div>

              {/* Hero spend */}
              <div
                className="mx-4 mt-3 mb-3 rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #1a2035 60%, #111827 100%)',
                  border:     '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] text-white/38 uppercase tracking-wider">Safe to spend</p>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(74,222,128,0.12)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.22)' }}
                  >
                    38% used
                  </span>
                </div>
                <p className="text-[26px] font-bold text-white tracking-tight leading-none mb-0.5">$1,240.50</p>
                <p className="text-[10px] text-white/30 mb-2.5">of $2,000 budget · April 2026</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '38%' }}
                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #4F46E5, #4ADE80)' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.12)' }}>
                    <p className="text-[9px] text-white/30">Income</p>
                    <p className="text-[12px] font-bold text-green-400 tabular-nums">+$3,200</p>
                  </div>
                  <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[9px] text-white/30">Spent</p>
                    <p className="text-[12px] font-bold text-white/70 tabular-nums">$759.50</p>
                  </div>
                </div>
              </div>

              {/* Mini transaction list */}
              <div
                className="mx-4 mb-4 rounded-2xl border overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <p className="text-[9px] font-semibold text-white/35 px-4 pt-3 pb-2 uppercase tracking-wider">Recent</p>
                {[
                  { icon: '🍔', name: 'Chipotle',  cat: 'Food',         amount: '-$14.50', c: '#F59E0B' },
                  { icon: '🚗', name: 'Uber',       cat: 'Transport',    amount: '-$22.00', c: '#6366F1' },
                  { icon: '📱', name: 'Netflix',    cat: 'Subscription', amount: '-$15.99', c: '#A78BFA' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0"
                      style={{ background: `${tx.c}1A` }}
                    >
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-white/80 truncate">{tx.name}</p>
                      <p className="text-[9px] text-white/25">{tx.cat}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-white/45 tabular-nums">{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chips */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -right-10 top-20 rounded-2xl border px-4 py-3"
              style={{ background: '#1a2035', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            >
              <p className="text-[9px] text-white/35 mb-0.5">Budget saved</p>
              <p className="text-base font-bold text-green-400">+$440</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-10 bottom-28 rounded-2xl border px-4 py-3"
              style={{ background: '#1a2035', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            >
              <p className="text-[9px] text-amber-400/60 mb-0.5">Subscription found</p>
              <p className="text-[13px] font-bold text-amber-400">Netflix · $15.99</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
