'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

interface HeroCardProps {
  safeToSpend: number
  totalBudget: number
  budgetUsedPercent: number
  totalIncome: number
  totalSpent: number
  month: string
}

function getMoodMessage(pct: number, safeToSpend: number): { text: string; color: string } {
  if (safeToSpend < 0) return { text: 'Over budget — time to pause spending', color: '#EF4444' }
  if (pct >= 90) return { text: 'Almost at your limit — spend carefully', color: '#F59E0B' }
  if (pct >= 75) return { text: 'Getting close — watch your spending', color: '#F59E0B' }
  if (pct >= 50) return { text: 'On track — you\'re doing well', color: '#6366F1' }
  if (pct >= 20) return { text: 'You\'re doing great this month ✦', color: '#22C55E' }
  return { text: 'Month is wide open — great start ✦', color: '#22C55E' }
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

  const getProgressColor = () => {
    if (pct >= 100) return '#EF4444'
    if (pct >= 80) return '#F59E0B'
    return '#22C55E'
  }

  const progressColor = getProgressColor()
  const mood = getMoodMessage(pct, safeToSpend)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-5 mt-3 rounded-3xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, #1e1b4b 0%, #141c2e 50%, #0f1520 100%)',
        boxShadow: '0 12px 48px rgba(99,102,241,0.2), 0 2px 8px rgba(0,0,0,0.5)',
        border: '1px solid rgba(99,102,241,0.18)',
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-0 left-0 w-56 h-56 pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 65%)' }}
      />

      <div className="relative p-6">
        {/* Month + status badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{month}</span>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              background: isOverBudget
                ? 'rgba(239,68,68,0.12)'
                : pct >= 80
                ? 'rgba(245,158,11,0.12)'
                : 'rgba(34,197,94,0.12)',
              borderColor: isOverBudget
                ? 'rgba(239,68,68,0.25)'
                : pct >= 80
                ? 'rgba(245,158,11,0.25)'
                : 'rgba(34,197,94,0.25)',
              color: isOverBudget ? '#EF4444' : pct >= 80 ? '#F59E0B' : '#22C55E',
            }}
          >
            {isOverBudget ? '⚠ Over budget' : `${Math.round(pct)}% used`}
          </span>
        </div>

        {/* Safe to spend — dominant */}
        <div className="mb-1">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Safe to spend</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="font-bold text-white tracking-tight font-mono-numbers leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
              textShadow: '0 0 40px rgba(99,102,241,0.35)',
            }}
          >
            {formatCurrency(Math.max(safeToSpend, 0))}
          </motion.p>
          {totalBudget > 0 && (
            <p className="text-sm text-white/35 mt-1.5">
              of {formatCurrency(totalBudget)} budget
            </p>
          )}
        </div>

        {/* Mood message */}
        <div className="flex items-center gap-1.5 mb-5 mt-3">
          <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: mood.color }} />
          <p className="text-xs font-medium" style={{ color: mood.color }}>
            {mood.text}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #4F46E5, ${progressColor})`,
                boxShadow: `0 0 8px ${progressColor}60`,
              }}
            />
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-3 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center bg-green-500/15">
                <TrendingUp className="w-2.5 h-2.5 text-green-400" />
              </div>
              <span className="text-xs text-white/40">Income</span>
            </div>
            <p className="text-base font-bold text-white font-mono-numbers">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div
            className="rounded-2xl p-3 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center bg-red-500/15">
                <TrendingDown className="w-2.5 h-2.5 text-red-400" />
              </div>
              <span className="text-xs text-white/40">Spent</span>
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
