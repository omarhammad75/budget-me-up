'use client'

import { motion } from 'framer-motion'

const painPoints = [
  {
    stat: '$219',
    label: 'Lost to forgotten subscriptions',
    description: 'Most people are paying for 2–3 services they no longer use. BudgetMeUp flags every recurring charge so nothing slips through.',
    accent: '#F59E0B',
    quote: '"I had no idea Netflix, Hulu, AND that old gym membership were all still charging me."',
  },
  {
    stat: '67%',
    label: 'Don\'t know their monthly expenses',
    description: 'Without a clear picture, it\'s impossible to make good decisions. We give you that picture in seconds.',
    accent: '#6366F1',
    quote: '"I kept wondering where my paycheck went every month. Now I see it clearly."',
  },
  {
    stat: '1 in 3',
    label: 'Feel stressed about money weekly',
    description: 'Anxiety comes from uncertainty. Knowing your numbers — clearly, simply — makes everything calmer.',
    accent: '#EF4444',
    quote: '"Just seeing my safe-to-spend number every morning changed how I feel about money."',
  },
]

export function WhySection() {
  return (
    <section
      className="py-24 px-5 relative"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17,24,39,0.4) 50%, transparent 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Why it matters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-xl mx-auto leading-tight">
            Most people have no idea where their money went.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto leading-relaxed">
            That&apos;s not a personal failing. It&apos;s a visibility problem.
            BudgetMeUp fixes that.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((p, i) => (
            <motion.div
              key={p.stat}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border border-white/6 p-7 overflow-hidden group"
              style={{ background: '#111827' }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-70"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${p.accent} 40%, transparent 100%)` }}
              />

              {/* Background glow */}
              <div
                className="absolute top-0 left-0 w-48 h-48 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${p.accent} 0%, transparent 70%)` }}
              />

              <p
                className="text-5xl font-extrabold tracking-tight mb-2 relative"
                style={{ color: p.accent }}
              >
                {p.stat}
              </p>
              <p className="text-base font-semibold text-foreground mb-3 relative leading-snug">
                {p.label}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 relative">
                {p.description}
              </p>

              {/* User quote */}
              <div
                className="relative rounded-xl p-3 border border-white/5"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <p className="text-xs text-muted-foreground/70 italic leading-relaxed">
                  {p.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
