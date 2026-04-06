'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/format'
import type { SpendingByCategory } from '@/lib/types'

interface SpendingChartProps {
  data: SpendingByCategory[]
}

export function SpendingChart({ data }: SpendingChartProps) {
  if (!data.length) return null

  // Sort highest → lowest, cap at 6
  const sorted = [...data]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)

  const topCategory = sorted[0]
  const total = sorted.reduce((s, d) => s + d.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mx-5 mt-4 rounded-2xl border overflow-hidden"
      style={{
        background:   '#111827',
        borderColor:  'rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Header ───────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-none">
            Spending Breakdown
          </p>
          {topCategory && (
            <p className="text-[11px] text-muted-foreground/45 mt-1 truncate">
              Most on{' '}
              <span className="text-muted-foreground/65">
                {topCategory.category.icon} {topCategory.category.name}
              </span>
            </p>
          )}
        </div>

        <span
          className="ml-3 flex-shrink-0 text-[12px] font-semibold font-mono-numbers tabular-nums px-2.5 py-1 rounded-lg"
          style={{
            background:  'rgba(255,255,255,0.04)',
            color:       'rgba(249,250,251,0.45)',
            border:      '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {formatCurrency(total)}
        </span>
      </div>

      {/* ── Category rows ────────────────────────────── */}
      <div className="px-4 py-2">
        {sorted.map((item, i) => {
          const pct   = total > 0 ? (item.amount / total) * 100 : 0
          const color = item.category.color
          const isTop = i === 0

          return (
            <motion.div
              key={item.category.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.06 + i * 0.04 }}
              className={i < sorted.length - 1 ? 'border-b' : ''}
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="py-3 flex items-center gap-2.5">

                {/* Icon — compact, subtle */}
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] flex-shrink-0"
                  style={{
                    background: `${color}16`,
                    border:     `1px solid ${color}22`,
                  }}
                >
                  {item.category.icon}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground/85 truncate leading-none mb-1.5">
                    {item.category.name}
                  </p>

                  {/* Progress bar track */}
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.55,
                        delay:    0.1 + i * 0.06,
                        ease:     [0.16, 1, 0.3, 1],
                      }}
                      className="h-full rounded-full"
                      style={{
                        background:  `linear-gradient(90deg, ${color}BB, ${color})`,
                        boxShadow:   isTop ? `0 0 5px ${color}55` : 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Right: amount + percentage stacked */}
                <div className="flex-shrink-0 text-right" style={{ minWidth: 64 }}>
                  <p
                    className="text-[12px] font-semibold font-mono-numbers tabular-nums leading-none"
                    style={{ color: isTop ? color : 'rgba(249,250,251,0.75)' }}
                  >
                    {formatCurrency(item.amount)}
                  </p>
                  <p
                    className="text-[10px] font-mono-numbers tabular-nums mt-1 leading-none"
                    style={{ color: 'rgba(249,250,251,0.28)' }}
                  >
                    {Math.round(pct)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Footer mini-strip ────────────────────────── */}
      {sorted.length >= 3 && (
        <div
          className="px-4 py-2.5 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <span className="text-[10px] text-muted-foreground/30">
            Top {sorted.length} categories this month
          </span>

          {/* Proportional color strip */}
          <div className="flex items-center gap-px h-1.5 rounded-full overflow-hidden" style={{ width: 64 }}>
            {sorted.map((item) => {
              const pct = total > 0 ? (item.amount / total) * 100 : 0
              return (
                <div
                  key={item.category.id}
                  className="h-full"
                  style={{
                    width:      `${pct}%`,
                    background: item.category.color,
                    opacity:    0.65,
                    flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
