'use client'

import { motion } from 'framer-motion'

const mockCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#F59E0B', pct: 72, amount: '$340' },
  { name: 'Transport',     icon: '🚗', color: '#6366F1', pct: 48, amount: '$180' },
  { name: 'Subscriptions', icon: '📱', color: '#A78BFA', pct: 31, amount: '$95' },
  { name: 'Shopping',      icon: '🛍️', color: '#EC4899', pct: 20, amount: '$62' },
]

const mockTransactions = [
  { icon: '🍔', name: 'Chipotle',       cat: 'Food',         amount: '-$14.50', color: '#F59E0B' },
  { icon: '🚗', name: 'Uber',           cat: 'Transport',    amount: '-$22.00', color: '#6366F1' },
  { icon: '📱', name: 'Netflix',        cat: 'Subscription', amount: '-$15.99', color: '#A78BFA' },
  { icon: '💼', name: 'Salary deposit', cat: 'Income',       amount: '+$3,200', color: '#22C55E' },
]

const floatingChips = [
  {
    label: 'Budget saved',
    value: '+$440',
    valueColor: '#22C55E',
    side: 'right' as const,
    top: '18%',
    delay: 0.7,
  },
  {
    label: 'Subscription detected',
    value: 'Netflix · $15.99/mo',
    valueColor: '#F59E0B',
    side: 'left' as const,
    top: '62%',
    delay: 0.85,
  },
]

export function ProductPreview() {
  return (
    <section className="py-24 px-5 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            The dashboard
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything at a glance
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            One screen. All your financial clarity. No spreadsheets required.
          </p>
        </motion.div>

        {/* Phone mockup + floating chips */}
        <div className="relative max-w-xs mx-auto md:max-w-sm">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 scale-150 blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, #6366F1 0%, transparent 65%)' }}
          />

          {/* Phone frame */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto"
            style={{ width: 290 }}
          >
            {/* Phone outer shell */}
            <div
              className="relative rounded-[44px] p-[3px] shadow-[0_48px_120px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)' }}
            >
              {/* Phone screen */}
              <div
                className="rounded-[41px] overflow-hidden relative"
                style={{ background: '#0B0F14' }}
              >
                {/* Dynamic island / notch */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-24 h-7 rounded-full" style={{ background: '#000' }} />
                </div>

                {/* App content */}
                <div className="px-0">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pt-1 pb-2">
                    <div>
                      <p className="text-[10px] text-white/35">Good morning</p>
                      <p className="text-sm font-bold text-white leading-tight">Alex 👋</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-xs">
                      👤
                    </div>
                  </div>

                  {/* Hero card */}
                  <div
                    className="mx-4 mb-3 rounded-2xl p-4 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1e1b4b 0%, #1a2035 60%, #111827 100%)',
                      border: '1px solid rgba(99,102,241,0.2)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[9px] text-white/40 uppercase tracking-wider">Safe to spend</p>
                      <span className="text-[9px] font-semibold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                        38% used
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white tracking-tight">$1,240.50</p>
                    <p className="text-[10px] text-white/35 mb-2.5">of $2,000 budget · April 2026</p>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '38%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #4F46E5, #22C55E)' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                      <div className="bg-white/4 rounded-xl p-2">
                        <p className="text-[9px] text-white/35">Income</p>
                        <p className="text-xs font-bold text-green-400">+$3,200</p>
                      </div>
                      <div className="bg-white/4 rounded-xl p-2">
                        <p className="text-[9px] text-white/35">Spent</p>
                        <p className="text-xs font-bold text-white/70">$759.50</p>
                      </div>
                    </div>
                  </div>

                  {/* Spending breakdown */}
                  <div
                    className="mx-4 mb-3 rounded-2xl p-3.5 border border-white/5"
                    style={{ background: '#111827' }}
                  >
                    <p className="text-[10px] font-semibold text-white/45 mb-2.5 uppercase tracking-wider">
                      Spending
                    </p>
                    <div className="space-y-2">
                      {mockCategories.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs w-4 flex-shrink-0">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${cat.pct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.3 + i * 0.08 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-white/35 tabular-nums w-9 text-right">{cat.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent transactions */}
                  <div
                    className="mx-4 mb-4 rounded-2xl border border-white/5 overflow-hidden"
                    style={{ background: '#111827' }}
                  >
                    <p className="text-[10px] font-semibold text-white/45 px-4 pt-3 pb-2 uppercase tracking-wider">
                      Recent
                    </p>
                    {mockTransactions.map((tx, i) => (
                      <div key={i} className="flex items-center gap-2.5 px-3.5 py-2 border-t border-white/5 first:border-0">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0"
                          style={{ backgroundColor: `${tx.color}20` }}
                        >
                          {tx.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-white/80 truncate">{tx.name}</p>
                          <p className="text-[9px] text-white/30">{tx.cat}</p>
                        </div>
                        <span className={`text-[11px] font-semibold tabular-nums ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white/50'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Home indicator */}
                  <div className="flex justify-center pb-3">
                    <div className="w-24 h-1 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating chips — desktop only */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute hidden md:block rounded-2xl border border-white/10 px-4 py-3 shadow-elevated"
            style={{
              background: 'rgba(26,32,53,0.95)',
              backdropFilter: 'blur(12px)',
              right: '-100px',
              top: '18%',
            }}
          >
            <p className="text-[10px] text-white/40 mb-0.5">Budget saved</p>
            <p className="text-base font-bold text-green-400">+$440 💚</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute hidden md:block rounded-2xl border border-white/10 px-4 py-3 shadow-elevated"
            style={{
              background: 'rgba(26,32,53,0.95)',
              backdropFilter: 'blur(12px)',
              left: '-110px',
              top: '58%',
            }}
          >
            <p className="text-[10px] text-amber-400/60 mb-0.5">⚠ Subscription</p>
            <p className="text-sm font-bold text-amber-400">Netflix · $15.99</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
