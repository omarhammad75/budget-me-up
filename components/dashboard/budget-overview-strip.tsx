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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Budgets</h2>
        <Link
          href="/budgets"
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {budgetsWithSpent.map((b, i) => {
          const barColor =
            b.pct >= 100 ? '#EF4444' :
            b.pct >= 80  ? '#F59E0B' :
            '#22C55E'

          return (
            <div
              key={b.id}
              className={`px-4 py-3 ${i > 0 ? 'border-t border-white/4' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: `${barColor}12`, border: `1px solid ${barColor}18` }}
                  >
                    {b.category?.icon}
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{b.category?.name}</span>
                </div>
                <div className="text-right">
                  <span
                    className="text-sm font-bold font-mono-numbers"
                    style={{ color: b.pct >= 100 ? '#FC8181' : b.pct >= 80 ? '#FCD34D' : '#F9FAFB' }}
                  >
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-xs text-muted-foreground/40 font-mono-numbers">
                    {' '}/ {formatCurrency(b.amount)}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${barColor}99, ${barColor})`,
                    boxShadow: b.pct >= 80 ? `0 0 6px ${barColor}60` : 'none',
                  }}
                />
              </div>

              {/* Pct label */}
              <p className="text-[10px] mt-1 font-medium" style={{ color: `${barColor}99` }}>
                {Math.round(b.pct)}% of budget used
              </p>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
