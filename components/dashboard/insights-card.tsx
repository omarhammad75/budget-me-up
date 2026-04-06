'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { MonthlyInsight } from '@/lib/types'

interface InsightsCardProps {
  insights: MonthlyInsight[]
}

const variantConfig = {
  warning: {
    bg:        'rgba(251,191,36,0.05)',
    border:    'rgba(251,191,36,0.14)',
    iconBg:    'rgba(251,191,36,0.1)',
    iconBorder:'rgba(251,191,36,0.18)',
    textColor: '#FBBF24',
    Icon:      AlertTriangle,
  },
  success: {
    bg:        'rgba(74,222,128,0.05)',
    border:    'rgba(74,222,128,0.12)',
    iconBg:    'rgba(74,222,128,0.1)',
    iconBorder:'rgba(74,222,128,0.18)',
    textColor: '#4ADE80',
    Icon:      CheckCircle2,
  },
  info: {
    bg:        'rgba(99,102,241,0.05)',
    border:    'rgba(99,102,241,0.14)',
    iconBg:    'rgba(99,102,241,0.1)',
    iconBorder:'rgba(99,102,241,0.18)',
    textColor: '#818CF8',
    Icon:      Info,
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
      <h2 className="text-[13px] font-semibold text-foreground mb-2.5">Insights</h2>

      <div className="space-y-2">
        {insights.map((insight, i) => {
          const cfg  = variantConfig[insight.type]
          const Icon = cfg.Icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.07 }}
              className="flex items-start gap-3 px-3.5 py-3 rounded-xl border"
              style={{ background: cfg.bg, borderColor: cfg.border }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border"
                style={{ background: cfg.iconBg, borderColor: cfg.iconBorder }}
              >
                <Icon className="w-3 h-3" style={{ color: cfg.textColor }} strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold leading-snug" style={{ color: cfg.textColor }}>
                  {insight.title}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-relaxed">
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
