'use client'

import { motion } from 'framer-motion'
import type { MonthlyInsight } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

interface InsightsCardProps {
  insights: MonthlyInsight[]
}

const variantStyles = {
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  success: 'bg-green-500/10 border-green-500/20 text-green-400',
  info: 'bg-primary/10 border-primary/20 text-primary',
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
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className={cn(
              'flex items-start gap-3 p-3.5 rounded-2xl border',
              variantStyles[insight.type]
            )}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
            <div>
              <p className="text-sm font-semibold leading-tight">{insight.title}</p>
              <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{insight.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
