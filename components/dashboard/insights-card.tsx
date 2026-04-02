'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { MonthlyInsight } from '@/lib/types'

interface InsightsCardProps {
  insights: MonthlyInsight[]
}

const variantConfig = {
  warning: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.18)',
    iconBg: 'rgba(245,158,11,0.12)',
    textColor: '#F59E0B',
    Icon: AlertTriangle,
  },
  success: {
    bg: 'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.15)',
    iconBg: 'rgba(34,197,94,0.12)',
    textColor: '#22C55E',
    Icon: CheckCircle2,
  },
  info: {
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.18)',
    iconBg: 'rgba(99,102,241,0.12)',
    textColor: '#818CF8',
    Icon: Info,
  },
}

export function InsightsCard({ insights }: InsightsCardProps) {
  if (!insights.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="mx-5 mt-4"
    >
      <h2 className="text-sm font-semibold text-foreground mb-3">Smart Insights</h2>
      <div className="space-y-2.5">
        {insights.map((insight, i) => {
          const cfg = variantConfig[insight.type]
          const Icon = cfg.Icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-start gap-3 p-3.5 rounded-2xl border"
              style={{ background: cfg.bg, borderColor: cfg.border }}
            >
              {/* Icon badge */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: cfg.iconBg }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.textColor }} strokeWidth={1.75} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug" style={{ color: cfg.textColor }}>
                  {insight.title}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
