'use client'

import { motion } from 'framer-motion'
import {
  LineChart, Wallet, RefreshCw, Bell, Target, CircleDollarSign,
} from 'lucide-react'

const features = [
  {
    icon: CircleDollarSign,
    title: 'Safe to Spend',
    description: 'One number tells you what you can spend today without guilt — always visible, always current.',
    color: '#22C55E',
  },
  {
    icon: LineChart,
    title: 'Spending Clarity',
    description: 'See exactly where every dollar goes — by category, by day, by habit. No surprises.',
    color: '#6366F1',
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'Set monthly limits per category and get warned before you overspend. Stay on track effortlessly.',
    color: '#818CF8',
  },
  {
    icon: RefreshCw,
    title: 'Subscription Watch',
    description: 'Spot recurring charges you forgot about. Stop paying for what you don\'t use.',
    color: '#F59E0B',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Push notifications when you hit 80% of a budget or log a large expense. Never blindsided.',
    color: '#EF4444',
  },
  {
    icon: Target,
    title: 'Savings Goals',
    description: 'Create goals, track progress, and see exactly how long until you get there.',
    color: '#A78BFA',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-5 relative">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for real financial clarity
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            Not just a tracker — a tool that helps you feel genuinely in control of your money.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={item}
                className="group relative rounded-2xl border border-white/6 p-6 hover:border-white/12 transition-all duration-300 cursor-default"
                style={{ background: '#111827' }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 0%, ${f.color}12 0%, transparent 55%)` }}
                />

                {/* Inner top border glow on hover */}
                <div
                  className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}40, transparent)` }}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 relative"
                  style={{
                    backgroundColor: `${f.color}15`,
                    border: `1px solid ${f.color}25`,
                    boxShadow: `0 0 16px ${f.color}10`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 relative"
                    style={{ color: f.color }}
                    strokeWidth={1.75}
                  />
                </div>

                <h3 className="font-semibold text-foreground mb-2 relative">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative">{f.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
