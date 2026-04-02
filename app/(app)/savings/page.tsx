'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Target } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import { Header } from '@/components/layout/header'
import { AddGoalSheet } from '@/components/savings/add-goal-sheet'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSavings } from '@/lib/hooks/use-savings'
import { useProfile } from '@/lib/hooks/use-profile'
import { formatCurrency } from '@/lib/utils/format'
import type { SavingsGoal } from '@/lib/types'

export default function SavingsPage() {
  const { goals, loading, add, update, remove } = useSavings()
  const { profile } = useProfile()
  const [addOpen, setAddOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null)

  const totalSaving = goals.reduce((s, g) => s + g.current_amount, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)

  return (
    <div className="pb-6">
      <Header title="Savings Goals" />

      <div className="px-5 space-y-4">
        {/* Summary */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 100%)',
              borderColor: 'rgba(16,185,129,0.2)',
            }}
          >
            <p className="text-xs text-muted-foreground mb-1">Total saved across all goals</p>
            <p className="text-4xl font-bold text-green-400 font-mono-numbers">
              {formatCurrency(totalSaving)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              of {formatCurrency(totalTarget)} target
            </p>
          </motion.div>
        )}

        {/* Goals */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="No savings goals"
            description="Set a goal and track your progress toward things that matter"
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4" /> Create a goal
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {goals.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={i}
                monthlyIncome={profile?.monthly_income ?? 0}
                onEdit={() => setEditGoal(goal)}
                onAddFunds={(amount) => update(goal.id, { current_amount: goal.current_amount + amount })}
              />
            ))}
          </div>
        )}

        {goals.length > 0 && (
          <Button
            variant="outline"
            className="w-full border-dashed border-border/60 text-muted-foreground"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add another goal
          </Button>
        )}
      </div>

      <AddGoalSheet
        open={addOpen || !!editGoal}
        onOpenChange={open => { if (!open) { setAddOpen(false); setEditGoal(null) } }}
        goal={editGoal}
        onSave={async (data) => {
          if (editGoal) {
            await update(editGoal.id, data)
          } else {
            await add(data)
          }
          setAddOpen(false)
          setEditGoal(null)
        }}
        onDelete={editGoal ? async () => { await remove(editGoal.id); setEditGoal(null) } : undefined}
      />
    </div>
  )
}

function GoalCard({
  goal,
  index,
  monthlyIncome,
  onEdit,
  onAddFunds,
}: {
  goal: SavingsGoal
  index: number
  monthlyIncome: number
  onEdit: () => void
  onAddFunds: (amount: number) => void
}) {
  const [addFundsAmount, setAddFundsAmount] = useState('')
  const [showAddFunds, setShowAddFunds] = useState(false)

  const pct = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const remaining = goal.target_amount - goal.current_amount
  const daysLeft = goal.deadline ? differenceInDays(parseISO(goal.deadline), new Date()) : null

  const monthlySuggestion = (() => {
    if (!goal.deadline || remaining <= 0) return null
    const months = Math.max(daysLeft! / 30, 1)
    return remaining / months
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border bg-card p-4"
      style={{ borderColor: `${goal.color}33` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
            style={{ backgroundColor: `${goal.color}18`, border: `1px solid ${goal.color}22` }}
          >
            {goal.icon}
          </div>
          <div>
            <p className="font-semibold text-foreground">{goal.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(goal.current_amount)} of {formatCurrency(goal.target_amount)}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="h-3 rounded-full bg-muted overflow-hidden mb-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 + index * 0.06 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}CC)` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(pct)}% complete</span>
          <span>{formatCurrency(remaining)} to go</span>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-3 mb-3">
        {daysLeft !== null && daysLeft > 0 && (
          <div className="flex-1 bg-muted rounded-xl px-3 py-2">
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="text-sm font-semibold text-foreground">{daysLeft}d left</p>
          </div>
        )}
        {monthlySuggestion && (
          <div className="flex-1 bg-muted rounded-xl px-3 py-2">
            <p className="text-xs text-muted-foreground">Monthly need</p>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(monthlySuggestion)}</p>
          </div>
        )}
      </div>

      {/* Add funds */}
      {!showAddFunds ? (
        <button
          onClick={() => setShowAddFunds(true)}
          className="w-full py-2 rounded-xl bg-muted text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          style={{ borderColor: `${goal.color}22` }}
        >
          + Add funds
        </button>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={addFundsAmount}
              onChange={e => setAddFundsAmount(e.target.value)}
              className="w-full h-10 pl-7 pr-3 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              inputMode="decimal"
            />
          </div>
          <button
            onClick={() => {
              if (addFundsAmount) onAddFunds(parseFloat(addFundsAmount))
              setAddFundsAmount('')
              setShowAddFunds(false)
            }}
            className="px-4 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: goal.color }}
          >
            Add
          </button>
          <button
            onClick={() => { setShowAddFunds(false); setAddFundsAmount('') }}
            className="px-3 rounded-xl bg-muted text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  )
}
