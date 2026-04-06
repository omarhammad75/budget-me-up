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
  if (safeToSpend < 0)  return { text: 'Over budget — pause spending for now', color: '#F87171' }
  if (pct >= 90)        return { text: 'Almost at your limit — spend carefully', color: '#FBBF24' }
  if (pct >= 75)        return { text: 'Getting close — watch your spending', color: '#FBBF24' }
  if (pct >= 50)        return { text: 'On track — you\'re doing well', color: '#818CF8' }
  if (pct >= 20)        return { text: 'You\'re doing great this month', color: '#4ADE80' }
  return                       { text: 'Wide open — great start to the month', color: '#4ADE80' }
}

export function HeroCard({
  safeToSpend,
  totalBudget,
  budgetUsedPercent,
  totalIncome,
  totalSpent,
  month,
}: HeroCardProps) {
  const pct           = Math.min(budgetUsedPercent, 100)
  const isOverBudget  = budgetUsedPercent > 100
  const mood          = getMoodMessage(pct, safeToSpend)

  const progressColor =
    pct >= 100 ? '#F87171' :
    pct >= 80  ? '#FBBF24' :
    '#4ADE80'

  const badgeBg      = isOverBudget ? 'rgba(248,113,113,0.12)' : pct >= 80 ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.1)'
  const badgeBorder  = isOverBudget ? 'rgba(248,113,113,0.28)' : pct >= 80 ? 'rgba(251,191,36,0.28)' : 'rgba(74,222,128,0.22)'
  const badgeColor   = isOverBudget ? '#F87171'                : pct >= 80 ? '#FBBF24'                : '#4ADE80'

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-5 mt-3 rounded-3xl overflow-hidden relative"
      style={{
        background:  'linear-gradient(145deg, #1e1b4b 0%, #141c2e 55%, #0f1520 100%)',
        boxShadow:   '0 16px 56px rgba(79,70,229,0.22), 0 2px 8px rgba(0,0,0,0.6)',
        border:      '1px solid rgba(99,102,241,0.2)',
      }}
    >
      {/* Top-left ambient glow */}
      <div
        className="absolute top-0 left-0 w-64 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.2) 0%, transparent 65%)' }}
      />
      {/* Bottom-right green accent */}
      <div
        className="absolute bottom-0 right-0 w-48 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(74,222,128,0.12) 0%, transparent 65%)' }}
      />

      <div className="relative p-6">
        {/* Month + status badge */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-medium text-white/35 uppercase tracking-widest">{month}</span>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
            style={{ background: badgeBg, borderColor: badgeBorder, color: badgeColor }}
          >
            {isOverBudget ? '⚠ Over budget' : `${Math.round(pct)}% used`}
          </span>
        </div>

        {/* ── Safe to spend — dominant focal point ── */}
        <div className="mb-4 relative">
          {/* Glow bloom behind the number */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '50%', left: 0,
              transform: 'translateY(-50%)',
              width: 200, height: 80,
              background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.28) 0%, transparent 70%)',
              filter: 'blur(16px)',
            }}
          />

          <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-2 relative">
            Safe to spend
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative font-bold text-white tracking-tight font-mono-numbers leading-none"
            style={{
              fontSize:   'clamp(2.6rem, 9vw, 3.75rem)',
              textShadow: '0 0 48px rgba(99,102,241,0.5), 0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            {formatCurrency(Math.max(safeToSpend, 0))}
          </motion.p>
          {totalBudget > 0 && (
            <p className="text-[13px] text-white/30 mt-2 relative">
              of {formatCurrency(totalBudget)} budget
            </p>
          )}
        </div>

        {/* Mood message */}
        <div className="flex items-center gap-1.5 mb-5">
          <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: mood.color }} />
          <p className="text-xs font-medium" style={{ color: mood.color }}>
            {mood.text}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #4F46E5, ${progressColor})`,
                boxShadow:  `0 0 8px ${progressColor}70`,
              }}
            />
          </div>
        </div>

        {/* Income / Spent summary */}
        <div className="grid grid-cols-2 gap-3">
          {/* Income */}
          <div
            className="rounded-2xl p-3.5 border relative overflow-hidden"
            style={{
              background:  'rgba(255,255,255,0.03)',
              borderColor: 'rgba(74,222,128,0.14)',
              borderLeft:  '2px solid rgba(74,222,128,0.45)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3 h-3 text-green-400/70" />
              <span className="text-[11px] font-medium text-white/40">Income</span>
            </div>
            <p className="text-[15px] font-bold text-white/90 font-mono-numbers tabular-nums">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          {/* Spent */}
          <div
            className="rounded-2xl p-3.5 border relative overflow-hidden"
            style={{
              background:  'rgba(255,255,255,0.03)',
              borderColor: 'rgba(248,113,113,0.14)',
              borderLeft:  '2px solid rgba(248,113,113,0.4)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingDown className="w-3 h-3 text-red-400/70" />
              <span className="text-[11px] font-medium text-white/40">Spent</span>
            </div>
            <p className="text-[15px] font-bold text-white/90 font-mono-numbers tabular-nums">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
