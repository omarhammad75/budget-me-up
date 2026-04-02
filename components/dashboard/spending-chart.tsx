'use client'

import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/format'
import type { SpendingByCategory } from '@/lib/types'

interface SpendingChartProps {
  data: SpendingByCategory[]
}

// Slightly larger donut for better balance
const DONUT_SIZE = 124

export function SpendingChart({ data }: SpendingChartProps) {
  if (!data.length) return null

  const chartData = data.slice(0, 6).map((d) => ({
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
      className="mx-5 mt-4 rounded-2xl border p-4"
      style={{
        background: '#111827',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Spending Breakdown</h2>
        <span className="text-xs text-muted-foreground/60 font-mono-numbers">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div
          className="relative flex-shrink-0"
          style={{ width: DONUT_SIZE, height: DONUT_SIZE }}
        >
          <PieChart width={DONUT_SIZE} height={DONUT_SIZE}>
            <Pie
              data={chartData}
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              innerRadius={40}
              outerRadius={54}
              dataKey="value"
              strokeWidth={0}
              paddingAngle={2}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.[0]) {
                  const d = payload[0].payload
                  return (
                    <div
                      className="rounded-xl border px-3 py-2 text-xs shadow-lg"
                      style={{
                        background: '#1a2035',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <p className="font-semibold text-foreground">
                        {d.icon} {d.name}
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        {formatCurrency(d.value)} · {Math.round(d.percentage)}%
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/45">
              Total
            </p>
            <p className="mt-1 text-base font-bold leading-none text-foreground font-mono-numbers">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-3">
          {chartData.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{item.icon}</span>
                  <span className="truncate text-sm font-medium text-foreground/90">
                    {item.name}
                  </span>
                </div>
              </div>

              <span className="flex-shrink-0 text-sm text-muted-foreground/70 font-mono-numbers tabular-nums">
                {formatCurrency(item.value)}
              </span>

              <span className="w-9 flex-shrink-0 text-right text-xs text-muted-foreground/45 font-mono-numbers tabular-nums">
                {Math.round(item.percentage)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
