'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

interface HeroCardProps {
  safeToSpend: number
  totalBudget: number
  budgetUsedPercent: number
  totalIncome: number
  totalSpent: number
  month: string
}

export function HeroCard({
  safeToSpend,
  totalBudget,
  budgetUsedPercent,
  totalIncome,
  totalSpent,
  month,
}: HeroCardProps) {
  const pct = Math.min(budgetUsedPercent, 100)
  const isOverBudget = budgetUsedPercent > 100

  const getStatusColor = () => {
    if (pct >= 100) return '#EF4444'
    if (pct >= 80) return '#F59E0B'
    return '#10B981'
  }

  const statusColor = getStatusColor()

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-5 mt-3 rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1E0A3C 0%, #0A1628 50%, #0D0D1A 100%)',
        boxShadow: '0 8px 32px rgba(124,58,237,0.25), 0 2px 8px rgba(0,0,0,0.4)',
        border: '1px solid rgba(124,58,237,0.2)',
      }}
    >
      {/* Background glow orbs */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />

      <div className="relative p-6">
        {/* Month label */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{month}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOverBudget
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : pct >= 80
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {isOverBudget ? 'Over budget' : `${Math.round(pct)}% used`}
          </span>
        </div>

        {/* Safe to spend amount */}
        <div className="mb-5">
          <p className="text-xs text-white/50 mb-1">Safe to spend</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="text-5xl font-bold text-white tracking-tight font-mono-numbers"
            style={{ textShadow: '0 0 32px rgba(167,139,250,0.4)' }}
          >
            {formatCurrency(Math.max(safeToSpend, 0))}
          </motion.p>
          {totalBudget > 0 && (
            <p className="text-sm text-white/40 mt-1">
              of {formatCurrency(totalBudget)} budget
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, #7C3AED, ${statusColor})` }}
            />
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-white/50">Income</span>
            </div>
            <p className="text-base font-bold text-white font-mono-numbers">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-white/50">Spent</span>
            </div>
            <p className="text-base font-bold text-white font-mono-numbers">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
