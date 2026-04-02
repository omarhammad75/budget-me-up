'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
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
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border/50 overflow-hidden">
        {budgetsWithSpent.map((b, i) => (
          <div key={b.id} className="px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{b.category?.icon}</span>
                <span className="text-sm font-medium text-foreground">{b.category?.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold font-mono-numbers ${
                  b.pct >= 100 ? 'text-red-400' : b.pct >= 80 ? 'text-yellow-400' : 'text-muted-foreground'
                }`}>
                  {formatCurrency(b.spent)}
                </span>
                <span className="text-xs text-muted-foreground/50"> / {formatCurrency(b.amount)}</span>
              </div>
            </div>
            <Progress
              value={b.pct}
              className="h-1.5"
              indicatorClassName={
                b.pct >= 100 ? 'from-red-500 to-red-400' :
                b.pct >= 80 ? 'from-yellow-500 to-yellow-400' :
                undefined
              }
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
