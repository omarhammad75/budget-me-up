'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import type { Budget, Transaction } from '@/lib/types'

interface BudgetOverviewStripProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export function BudgetOverviewStrip({ budgets, transactions }: BudgetOverviewStripProps) {
  if (!budgets.length) return null

  const budgetsWithSpent = budgets.slice(0, 4).map(b => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category_id === b.category_id)
      .reduce((sum, t) => sum + t.amount, 0)
    const pct = Math.min((spent / b.amount) * 100, 100)
    return { ...b, spent, pct }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mx-5 mt-4"
    >
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[13px] font-semibold text-foreground">Budgets</h2>
        <Link
          href="/budgets"
          className="flex items-center gap-1 text-[11px] text-indigo-400/80 hover:text-indigo-300 font-medium transition-colors"
        >
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {budgetsWithSpent.map((b, i) => {
          const isOver   = b.pct >= 100
          const isNear   = b.pct >= 80
          const barColor = isOver ? '#F87171' : isNear ? '#FBBF24' : '#4ADE80'

          return (
            <div
              key={b.id}
              className={`px-4 py-3 ${i > 0 ? 'border-t' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center justify-between mb-2">
                {/* Left: icon + name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] flex-shrink-0"
                    style={{ background: `${barColor}14`, border: `1px solid ${barColor}20` }}
                  >
                    {b.category?.icon}
                  </div>
                  <span className="text-[12px] font-medium text-foreground/85 truncate">
                    {b.category?.name}
                  </span>
                </div>

                {/* Right: spent / budget */}
                <div className="flex-shrink-0 text-right ml-3">
                  <span
                    className="text-[12px] font-semibold font-mono-numbers tabular-nums"
                    style={{ color: isOver ? '#F87171' : isNear ? '#FBBF24' : 'rgba(249,250,251,0.75)' }}
                  >
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-[11px] text-muted-foreground/30 font-mono-numbers">
                    {' '}/ {formatCurrency(b.amount)}
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 0.65, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                    boxShadow:  isNear ? `0 0 5px ${barColor}55` : 'none',
                  }}
                />
              </div>

              <p
                className="text-[10px] mt-1.5 font-medium"
                style={{ color: `${barColor}80` }}
              >
                {Math.round(b.pct)}% used
              </p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
