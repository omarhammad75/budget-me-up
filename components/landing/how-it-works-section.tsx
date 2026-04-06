'use client'

import { motion } from 'framer-motion'
import { UserPlus, SlidersHorizontal, TrendingUp } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create your account',
    description:
      'Sign up in under a minute. Set your monthly income and any budget limits you want. No bank connection required — your financial data stays yours.',
    color: '#6366F1',
    detail: '60-second setup',
  },
  {
    step: '02',
    icon: SlidersHorizontal,
    title: 'Log your spending',
    description:
      'Add transactions as you go. BudgetMeUp automatically categorizes them, flags recurring charges, and keeps your safe-to-spend number updated in real time.',
    color: '#22C55E',
    detail: 'Auto-categorized',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Make smarter decisions',
    description:
      'See your spending clearly, get notified before you overspend, and use the affordability checker before any big purchase. Money clarity, finally.',
    color: '#F59E0B',
    detail: 'Real-time insights',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 px-5 relative overflow-hidden">
      {/* Subtle connecting line behind steps */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-32 bottom-32 w-px hidden md:block pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.2) 20%, rgba(99,102,241,0.2) 80%, transparent 100%)' }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Up and running in minutes.
            <br />
            <span className="text-muted-foreground font-normal">Not hours.</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isRight = i % 2 === 1

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col md:flex-row items-center gap-8 ${isRight ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Card */}
                <div
                  className="flex-1 rounded-2xl border p-7 relative overflow-hidden group"
                  style={{
                    background:  '#111827',
                    borderColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${step.color}50, transparent)` }}
                  />
                  {/* Corner glow */}
                  <div
                    className="absolute top-0 left-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 0% 0%, ${step.color}12 0%, transparent 70%)` }}
                  />

                  <div className="relative flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${step.color}14`,
                        border:     `1px solid ${step.color}28`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} strokeWidth={1.75} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-base">{step.title}</h3>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${step.color}14`,
                            color:      step.color,
                            border:     `1px solid ${step.color}25`,
                          }}
                        >
                          {step.detail}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step number — center connector */}
                <div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0 w-16">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                    style={{
                      background:  `${step.color}14`,
                      border:      `2px solid ${step.color}30`,
                      color:       step.color,
                    }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Spacer on opposite side for alignment */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
