'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { SetBudgetSheet } from '@/components/budgets/set-budget-sheet'
import { EmptyState } from '@/components/shared/empty-state'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBudgets } from '@/lib/hooks/use-budgets'
import { useTransactions } from '@/lib/hooks/use-transactions'
import { useCategories } from '@/lib/hooks/use-categories'
import { formatCurrency, formatMonth, getCurrentMonth } from '@/lib/utils/format'
import type { Budget } from '@/lib/types'

export default function BudgetsPage() {
  const { month, year } = getCurrentMonth()
  const { budgets, loading, upsert, remove } = useBudgets(month, year)
  const { transactions } = useTransactions(true)
  const { categories } = useCategories('expense')
  const [editBudget, setEditBudget] = useState<Budget | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const budgetsWithSpent = useMemo(() => {
    return budgets.map(b => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category_id === b.category_id)
        .reduce((sum, t) => sum + t.amount, 0)
      const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0
      return { ...b, spent, pct }
    })
  }, [budgets, transactions])

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent = budgetsWithSpent.reduce((s, b) => s + b.spent, 0)
  const totalPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <div className="pb-6">
      <Header title={`Budgets · ${formatMonth(month, year)}`} />

      <div className="px-5 space-y-4">
        {/* Summary card */}
        {budgets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.05) 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Total budget</p>
                <p className="text-3xl font-bold text-foreground font-mono-numbers">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className={`text-xl font-bold font-mono-numbers ${
                  totalPct > 100 ? 'text-red-400' : totalPct > 80 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>
            <Progress value={Math.min(totalPct, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(Math.max(totalBudget - totalSpent, 0))} remaining
            </p>
          </motion.div>
        )}

        {/* Budget cards */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : budgets.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No budgets set"
            description="Set monthly spending limits for each category to stay on track"
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4" /> Set a budget
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {budgetsWithSpent.map((b, i) => (
              <BudgetCard
                key={b.id}
                budget={b}
                index={i}
                onEdit={() => setEditBudget(b)}
              />
            ))}
          </div>
        )}

        {/* Add budget button */}
        {budgets.length > 0 && (
          <Button
            variant="outline"
            className="w-full border-dashed border-border/60 text-muted-foreground"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add budget category
          </Button>
        )}
      </div>

      <SetBudgetSheet
        open={addOpen || !!editBudget}
        onOpenChange={open => { if (!open) { setAddOpen(false); setEditBudget(null) } }}
        budget={editBudget}
        categories={categories.filter(c => !budgets.some(b => b.category_id === c.id) || editBudget?.category_id === c.id)}
        onSave={async (categoryId, amount) => {
          await upsert(categoryId, amount)
          setAddOpen(false)
          setEditBudget(null)
        }}
        onDelete={editBudget ? async () => { await remove(editBudget.id); setEditBudget(null) } : undefined}
      />
    </div>
  )
}

function BudgetCard({
  budget,
  index,
  onEdit,
}: {
  budget: Budget & { spent: number; pct: number }
  index: number
  onEdit: () => void
}) {
  const remaining = budget.amount - budget.spent
  const isOver = budget.pct > 100
  const isWarning = budget.pct >= 80 && !isOver

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${budget.category?.color}22` }}
          >
            {budget.category?.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{budget.category?.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className={`text-sm font-bold font-mono-numbers ${
              isOver ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-muted-foreground'
            }`}>
              {isOver ? `+${formatCurrency(budget.spent - budget.amount)}` : formatCurrency(remaining)}
            </p>
            <p className="text-xs text-muted-foreground/60">{isOver ? 'over' : 'left'}</p>
          </div>
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Progress
            value={Math.min(budget.pct, 100)}
            className="flex-1 h-2"
            indicatorClassName={
              isOver ? 'from-red-500 to-red-400' :
              isWarning ? 'from-yellow-500 to-yellow-400' :
              undefined
            }
          />
          <span className={`text-xs font-semibold ml-3 min-w-[36px] text-right ${
            isOver ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-muted-foreground'
          }`}>
            {Math.round(budget.pct)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}
