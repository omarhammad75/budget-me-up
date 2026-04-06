'use client'

import { motion } from 'framer-motion'

const painPoints = [
  {
    stat:        '$219',
    label:       'Lost to forgotten subscriptions',
    description: 'Most people are paying for 2–3 services they no longer use. BudgetMeUp flags every recurring charge so nothing slips through.',
    accent:      '#FBBF24',
    quote:       '"I had no idea Netflix, Hulu, AND that old gym membership were all still charging me."',
  },
  {
    stat:        '67%',
    label:       'Don\'t know their monthly expenses',
    description: 'Without a clear picture, it\'s impossible to make good decisions. We give you that picture in seconds.',
    accent:      '#818CF8',
    quote:       '"I kept wondering where my paycheck went every month. Now I see it clearly."',
  },
  {
    stat:        '1 in 3',
    label:       'Feel stressed about money weekly',
    description: 'Anxiety comes from uncertainty. Knowing your numbers — clearly, simply — makes everything calmer.',
    accent:      '#F87171',
    quote:       '"Just seeing my safe-to-spend number every morning changed how I feel about money."',
  },
]

export function WhySection() {
  return (
    <section
      className="py-24 px-5 relative"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17,24,39,0.35) 50%, transparent 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Why it matters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-lg mx-auto leading-tight">
            Most people have no idea where their money went.
          </h2>
          <p className="text-muted-foreground/70 mt-4 max-w-sm mx-auto leading-relaxed text-[15px]">
            That&apos;s not a personal failing — it&apos;s a visibility problem.
            BudgetMeUp fixes that.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {painPoints.map((p, i) => (
            <motion.div
              key={p.stat}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border p-6 overflow-hidden group"
              style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent 10%, ${p.accent} 50%, transparent 90%)` }}
              />

              {/* Corner glow */}
              <div
                className="absolute top-0 left-0 w-40 h-40 pointer-events-none opacity-8 group-hover:opacity-15 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${p.accent} 0%, transparent 70%)` }}
              />

              {/* Stat */}
              <p
                className="text-[3rem] font-extrabold tracking-tight mb-1.5 relative leading-none"
                style={{ color: p.accent }}
              >
                {p.stat}
              </p>

              {/* Label */}
              <p className="text-[14px] font-semibold text-foreground/90 mb-3 relative leading-snug">
                {p.label}
              </p>

              {/* Description */}
              <p className="text-[13px] text-muted-foreground/65 leading-relaxed mb-5 relative">
                {p.description}
              </p>

              {/* Quote */}
              <div
                className="relative rounded-xl px-3.5 py-3 border"
                style={{
                  background:  `${p.accent}07`,
                  borderColor: `${p.accent}18`,
                }}
              >
                <p className="text-[12px] text-muted-foreground/60 italic leading-relaxed">
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
