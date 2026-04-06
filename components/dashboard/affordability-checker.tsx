'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Info } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { formatCurrency } from '@/lib/utils/format'
import type { AffordabilityStatus } from '@/lib/types'

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AffordabilityStatus,
  {
    icon: React.ElementType
    label: string
    sublabel: string
    color: string
    bg: string
    border: string
    glow: string
    remaining: (r: number) => string
    impact: (pct: number) => string
  }
> = {
  safe: {
    icon:     CheckCircle2,
    label:    'You can afford this',
    sublabel: 'Comfortably within your safe-to-spend.',
    color:    '#4ADE80',
    bg:       'rgba(34,197,94,0.09)',
    border:   'rgba(34,197,94,0.22)',
    glow:     'rgba(34,197,94,0.18)',
    remaining: (r) => `You'll still have ${formatCurrency(r)} left to spend this month.`,
    impact:    (p) => `This uses ${Math.round(p)}% of your remaining budget — you're on track.`,
  },
  caution: {
    icon:     AlertTriangle,
    label:    'Cutting it close',
    sublabel: 'Consider if this is a priority right now.',
    color:    '#FBBF24',
    bg:       'rgba(251,191,36,0.09)',
    border:   'rgba(251,191,36,0.22)',
    glow:     'rgba(251,191,36,0.18)',
    remaining: (r) => `You'd have ${formatCurrency(r)} left — not much room for anything else.`,
    impact:    (p) => `This would use ${Math.round(p)}% of your remaining budget. Spend carefully.`,
  },
  risky: {
    icon:     XCircle,
    label:    'Over your budget',
    sublabel: 'This exceeds your safe-to-spend for the month.',
    color:    '#F87171',
    bg:       'rgba(248,113,113,0.09)',
    border:   'rgba(248,113,113,0.22)',
    glow:     'rgba(248,113,113,0.18)',
    remaining: (r) => `You'd be ${formatCurrency(Math.abs(r))} over your safe-to-spend.`,
    impact:    (_p) => `This would put you in the red. Consider waiting or reducing the amount.`,
  },
}

// ── Main component ────────────────────────────────────────────────────────────

interface AffordabilityCheckerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  safeToSpend: number
}

export function AffordabilityChecker({
  open,
  onOpenChange,
  safeToSpend,
}: AffordabilityCheckerProps) {
  const [raw, setRaw] = useState('')

  const amount = parseFloat(raw) || 0

  const result = useMemo(() => {
    if (amount <= 0) return null
    const remaining   = safeToSpend - amount
    const percentUsed = safeToSpend > 0 ? (amount / safeToSpend) * 100 : 100
    const canAfford   = remaining >= 0

    let status: AffordabilityStatus
    if (!canAfford)            status = 'risky'
    else if (percentUsed >= 70) status = 'caution'
    else                        status = 'safe'

    return { status, remaining, percentUsed, canAfford }
  }, [amount, safeToSpend])

  const cfg = result ? STATUS_CONFIG[result.status] : null

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) setRaw(''); onOpenChange(v) }}>
      <SheetContent side="bottom" className="px-0 max-h-[90dvh] overflow-y-auto">
        <SheetHeader className="px-5 pb-4 border-b border-white/6">
          <SheetTitle className="text-base">Can I afford this?</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
            Enter an amount to see if it fits within your budget. This uses your current
            safe-to-spend, which accounts for your income, spending, and budget limits.
          </SheetDescription>
        </SheetHeader>

        <div className="px-5 pt-5 pb-10 space-y-5">

          {/* ── Safe to spend context ─────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{
              background:  'rgba(34,197,94,0.06)',
              borderColor: 'rgba(34,197,94,0.18)',
            }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-3.5 h-3.5 text-green-400/60" />
              Safe to spend this month
            </div>
            <span className="font-bold font-mono-numbers text-green-400">
              {formatCurrency(safeToSpend)}
            </span>
          </div>

          {/* ── Amount input ──────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/50">
              How much is it?
            </p>
            <div className="relative w-full flex items-center">
              <span
                className="absolute left-5 text-2xl font-bold pointer-events-none transition-colors duration-300"
                style={{ color: cfg?.color ?? 'rgba(249,250,251,0.3)' }}
              >
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                className="w-full h-16 pl-10 pr-5 text-3xl font-bold rounded-2xl border bg-transparent focus:outline-none transition-all duration-300 text-center"
                style={{
                  borderColor:  cfg?.border ?? 'rgba(255,255,255,0.1)',
                  boxShadow:    cfg ? `0 0 28px ${cfg.glow}` : 'none',
                  color:        cfg?.color ?? '#F9FAFB',
                  caretColor:   cfg?.color ?? '#6366F1',
                }}
              />
            </div>
          </div>

          {/* ── Result card ───────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {result && cfg && (
              <motion.div
                key={result.status}
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1,    y: 0 }}
                exit={{    opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border p-5 space-y-4"
                style={{
                  background:  cfg.bg,
                  borderColor: cfg.border,
                  boxShadow:   `0 0 36px ${cfg.glow}`,
                }}
              >
                {/* Status header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}40` }}
                  >
                    <cfg.icon className="w-5 h-5" style={{ color: cfg.color }} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold text-base leading-tight" style={{ color: cfg.color }}>
                      {cfg.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                      {cfg.sublabel}
                    </p>
                  </div>
                </div>

                {/* Impact message */}
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  {cfg.remaining(result.remaining)}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-3.5"
                    style={{
                      background:  'rgba(0,0,0,0.2)',
                      border:      '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <p className="text-[11px] text-muted-foreground/55 uppercase tracking-wider mb-1.5">
                      After purchase
                    </p>
                    <p
                      className="text-lg font-bold font-mono-numbers tabular-nums"
                      style={{ color: result.canAfford ? cfg.color : '#F87171' }}
                    >
                      {result.canAfford ? '' : '−'}{formatCurrency(Math.abs(result.remaining))}
                    </p>
                    <p className="text-[10px] text-muted-foreground/35 mt-0.5">remaining</p>
                  </div>

                  <div
                    className="rounded-xl p-3.5"
                    style={{
                      background:  'rgba(0,0,0,0.2)',
                      border:      '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <p className="text-[11px] text-muted-foreground/55 uppercase tracking-wider mb-1.5">
                      Budget used
                    </p>
                    <p
                      className="text-lg font-bold font-mono-numbers tabular-nums"
                      style={{ color: cfg.color }}
                    >
                      {Math.round(Math.min(result.percentUsed, 999))}%
                    </p>
                    <p className="text-[10px] text-muted-foreground/35 mt-0.5">of safe-to-spend</p>
                  </div>
                </div>

                {/* Visual progress bar */}
                <div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    <motion.div
                      key={`bar-${result.status}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(result.percentUsed, 100)}%` }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})`,
                        boxShadow:  `0 0 10px ${cfg.glow}`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground/30">$0</span>
                    <span className="text-[10px] text-muted-foreground/30 font-mono-numbers">
                      {formatCurrency(safeToSpend)}
                    </span>
                  </div>
                </div>

                {/* Financial impact insight */}
                <div
                  className="flex items-start gap-2 rounded-xl px-3.5 py-3"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: cfg.color, opacity: 0.7 }} />
                  <p className="text-[12px] text-muted-foreground/70 leading-relaxed">
                    {cfg.impact(result.percentUsed)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Empty hint ────────────────────────────────────────────── */}
          <AnimatePresence>
            {!result && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs text-muted-foreground/30 pt-2"
              >
                Type an amount above to check instantly
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Trigger button ────────────────────────────────────────────────────────────

interface AffordabilityTriggerProps {
  onClick: () => void
}

export function AffordabilityTrigger({ onClick }: AffordabilityTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all duration-200 hover:border-indigo-500/35 active:scale-[0.99]"
      style={{
        background:  'rgba(99,102,241,0.07)',
        borderColor: 'rgba(99,102,241,0.16)',
        color:       '#818CF8',
        minHeight:   48,
      }}
    >
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
      >
        <DollarSign className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />
      </div>
      <span className="flex-1 text-left">Can I afford this?</span>
      <span className="text-[11px] text-muted-foreground/40 mr-1">Try it</span>
      <ChevronRight className="w-3.5 h-3.5 opacity-35" />
    </button>
  )
}
