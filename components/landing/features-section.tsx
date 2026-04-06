'use client'

import { motion } from 'framer-motion'
import {
  LineChart, Wallet, RefreshCw, Bell, Target, CircleDollarSign,
} from 'lucide-react'

const features = [
  {
    icon:        CircleDollarSign,
    title:       'Safe to Spend',
    description: 'One number tells you what you can spend today without guilt — always visible, always current.',
    color:       '#4ADE80',
  },
  {
    icon:        LineChart,
    title:       'Spending Clarity',
    description: 'See exactly where every dollar goes — by category, by day, by habit. No surprises.',
    color:       '#6366F1',
  },
  {
    icon:        Wallet,
    title:       'Budget Tracking',
    description: 'Set monthly limits per category and get warned before you overspend. Effortlessly.',
    color:       '#818CF8',
  },
  {
    icon:        RefreshCw,
    title:       'Subscription Watch',
    description: 'Spot recurring charges you forgot about. Stop paying for what you don\'t use.',
    color:       '#FBBF24',
  },
  {
    icon:        Bell,
    title:       'Smart Alerts',
    description: 'Push notifications when you hit 80% of a budget or log a large expense.',
    color:       '#F87171',
  },
  {
    icon:        Target,
    title:       'Savings Goals',
    description: 'Create goals, track progress, and see exactly how long until you get there.',
    color:       '#A78BFA',
  },
]

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-5 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for real financial clarity
          </h2>
          <p className="text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed text-[15px]">
            Not just a tracker — a tool that helps you feel genuinely in control.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={item}
                className="group relative rounded-2xl border p-6 hover:border-white/10 transition-all duration-300 cursor-default overflow-hidden"
                style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
                whileHover={{ y: -2, transition: { duration: 0.18 } }}
              >
                {/* Always-visible top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent 10%, ${f.color} 50%, transparent 90%)` }}
                />

                {/* Corner glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 0%, ${f.color}0E 0%, transparent 50%)` }}
                />

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative"
                  style={{
                    background: `${f.color}12`,
                    border:     `1px solid ${f.color}22`,
                  }}
                >
                  <Icon className="w-4.5 h-4.5 relative" style={{ color: f.color }} strokeWidth={1.75} />
                </div>

                <h3 className="font-semibold text-foreground/95 mb-1.5 relative text-[14px]">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground/70 leading-relaxed relative">{f.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
