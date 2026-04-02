'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/format'
import type { SpendingByCategory } from '@/lib/types'

interface SpendingChartProps {
  data: SpendingByCategory[]
}

const FALLBACK_COLOR = '#475569'

export function SpendingChart({ data }: SpendingChartProps) {
  if (!data.length) return null

  const chartData = data.slice(0, 6).map(d => ({
    name: d.category.name,
    value: d.amount,
    color: d.category.color,
    icon: d.category.icon,
    percentage: d.percentage,
  }))

  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mx-5 mt-4 rounded-2xl border border-border bg-card p-5"
    >
      <h2 className="text-sm font-semibold text-foreground mb-4">Spending Breakdown</h2>

      <div className="flex gap-4 items-center">
        {/* Pie chart */}
        <div className="w-24 h-24 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={44}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    const d = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-xl p-2.5 shadow-elevated text-xs">
                        <p className="font-semibold">{d.icon} {d.name}</p>
                        <p className="text-muted-foreground">{formatCurrency(d.value)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category list */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
                  <span className="text-xs font-semibold text-muted-foreground ml-2 flex-shrink-0">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono-numbers flex-shrink-0 ml-1">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
