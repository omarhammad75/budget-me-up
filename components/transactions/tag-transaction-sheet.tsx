'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, RefreshCw, Tv, CreditCard, X, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTransactions } from '@/lib/hooks/use-transactions'
import { formatCurrency } from '@/lib/utils/format'
import type { Transaction, TagType, TagFrequency } from '@/lib/types'

// ── Constants ────────────────────────────────────────────────────────────────

const SUBSCRIPTION_PRESETS = [
  'Netflix', 'Spotify', 'Apple Music', 'Hulu', 'Disney+', 'HBO Max',
  'YouTube Premium', 'Amazon Prime', 'iCloud', 'Adobe CC', 'Gym / Fitness',
]

const PAYMENT_PLAN_PROVIDERS = [
  'Klarna', 'Afterpay', 'Affirm', 'PayPal Pay Later', 'Apple Pay Later', 'Sezzle',
]

const FREQUENCY_OPTIONS: { value: TagFrequency; label: string }[] = [
  { value: 'weekly',   label: 'Weekly'    },
  { value: 'biweekly', label: 'Biweekly'  },
  { value: 'monthly',  label: 'Monthly'   },
]

const TAG_TYPES: { value: TagType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'recurring',    label: 'Recurring',    icon: RefreshCw,   desc: 'Repeats on a schedule'        },
  { value: 'subscription', label: 'Subscription', icon: Tv,          desc: 'Ongoing service or membership' },
  { value: 'payment_plan', label: 'Pay Later',    icon: CreditCard,  desc: 'Instalment or BNPL plan'       },
]

// ── Component ────────────────────────────────────────────────────────────────

interface TagTransactionSheetProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TagTransactionSheet({ transaction, open, onOpenChange }: TagTransactionSheetProps) {
  const { update } = useTransactions()

  const [tagType, setTagType]       = useState<TagType | null>(transaction.tag_type ?? null)
  const [frequency, setFrequency]   = useState<TagFrequency | null>(transaction.tag_frequency ?? null)
  const [label, setLabel]           = useState(transaction.tag_label ?? '')
  const [totalPay, setTotalPay]     = useState(String(transaction.tag_total_payments ?? ''))
  const [remaining, setRemaining]   = useState(String(transaction.tag_remaining_payments ?? ''))
  const [nextDate, setNextDate]     = useState(transaction.tag_next_date ?? '')
  const [saving, setSaving]         = useState(false)

  const canSave = tagType !== null && frequency !== null

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    await update(transaction.id, {
      tag_type:               tagType,
      tag_frequency:          frequency,
      tag_label:              label || null,
      tag_total_payments:     totalPay    ? parseInt(totalPay)    : null,
      tag_remaining_payments: remaining   ? parseInt(remaining)   : null,
      tag_next_date:          nextDate    || null,
      // Keep legacy is_recurring flag in sync
      is_recurring: true,
      recurring_interval: frequency === 'monthly' ? 'monthly' : frequency === 'weekly' ? 'weekly' : 'weekly',
    })
    setSaving(false)
    onOpenChange(false)
  }

  const handleRemoveTag = async () => {
    setSaving(true)
    await update(transaction.id, {
      tag_type: null, tag_frequency: null, tag_label: null,
      tag_total_payments: null, tag_remaining_payments: null, tag_next_date: null,
      is_recurring: false, recurring_interval: null,
    })
    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-0 max-h-[92dvh] overflow-y-auto">
        <SheetHeader className="px-5 pb-4 border-b border-white/6">
          <SheetTitle className="text-base">Classify Transaction</SheetTitle>
          <p className="text-sm text-muted-foreground truncate">
            {transaction.description}
            <span className="ml-2 font-semibold font-mono-numbers"
              style={{ color: transaction.type === 'expense' ? '#F87171' : '#4ADE80' }}>
              {transaction.type === 'expense' ? '−' : '+'}{formatCurrency(transaction.amount)}
            </span>
          </p>
        </SheetHeader>

        <div className="px-5 pt-5 pb-8 space-y-6">
          {/* ── Tag type selector ─────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {TAG_TYPES.map(({ value, label: lbl, icon: Icon, desc }) => {
                const active = tagType === value
                return (
                  <button
                    key={value}
                    onClick={() => setTagType(active ? null : value)}
                    className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border transition-all duration-200 text-center"
                    style={{
                      background:   active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                      borderColor:  active ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)',
                      boxShadow:    active ? '0 0 16px rgba(99,102,241,0.15)' : 'none',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5"
                        style={{ color: active ? '#818CF8' : '#6B7280' }}
                        strokeWidth={1.75}
                      />
                    </div>
                    <span
                      className="text-[11px] font-semibold leading-tight"
                      style={{ color: active ? '#818CF8' : '#9CA3AF' }}
                    >
                      {lbl}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Contextual fields ────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {tagType && (
              <motion.div
                key={tagType}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Subscription: service name ──────────────────────────── */}
                {tagType === 'subscription' && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Service
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {SUBSCRIPTION_PRESETS.map(name => (
                        <button
                          key={name}
                          onClick={() => setLabel(label === name ? '' : name)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150"
                          style={{
                            background:  label === name ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                            borderColor: label === name ? 'rgba(99,102,241,0.4)'  : 'rgba(255,255,255,0.08)',
                            color:       label === name ? '#818CF8' : '#9CA3AF',
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="Or type a custom name…"
                      value={SUBSCRIPTION_PRESETS.includes(label) ? '' : label}
                      onChange={e => setLabel(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {/* Payment plan: provider ──────────────────────────────── */}
                {tagType === 'payment_plan' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Provider
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {PAYMENT_PLAN_PROVIDERS.map(p => (
                          <button
                            key={p}
                            onClick={() => setLabel(label === p ? '' : p)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150"
                            style={{
                              background:  label === p ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                              borderColor: label === p ? 'rgba(99,102,241,0.4)'  : 'rgba(255,255,255,0.08)',
                              color:       label === p ? '#818CF8' : '#9CA3AF',
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <Input
                        placeholder="Or enter provider name…"
                        value={PAYMENT_PLAN_PROVIDERS.includes(label) ? '' : label}
                        onChange={e => setLabel(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Total payments</Label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="e.g. 4"
                          value={totalPay}
                          onChange={e => setTotalPay(e.target.value)}
                          min={1}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Remaining</Label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="e.g. 3"
                          value={remaining}
                          onChange={e => setRemaining(e.target.value)}
                          min={0}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Frequency selector — all types ─────────────────────── */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Frequency
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FREQUENCY_OPTIONS.map(({ value, label: lbl }) => {
                      const active = frequency === value
                      return (
                        <button
                          key={value}
                          onClick={() => setFrequency(active ? null : value)}
                          className="py-2.5 rounded-xl text-sm font-medium border transition-all duration-150"
                          style={{
                            background:  active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                            borderColor: active ? 'rgba(99,102,241,0.4)'  : 'rgba(255,255,255,0.08)',
                            color:       active ? '#818CF8' : '#9CA3AF',
                          }}
                        >
                          {lbl}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Next date — optional for all types ─────────────────── */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Next payment date
                    <span className="ml-1 normal-case font-normal opacity-50">(optional)</span>
                  </Label>
                  <Input
                    type="date"
                    value={nextDate}
                    onChange={e => setNextDate(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="flex-1 h-12 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                boxShadow: canSave ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
              }}
            >
              {saving
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : 'Save Classification'}
            </button>

            {transaction.tag_type && (
              <button
                onClick={handleRemoveTag}
                disabled={saving}
                className="h-12 px-4 rounded-2xl border border-white/8 text-muted-foreground text-sm font-medium hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {!tagType && (
            <p className="text-center text-xs text-muted-foreground/40 -mt-2">
              Select a type above to classify this transaction
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Tag badge (used in transaction lists) ────────────────────────────────────

interface TagBadgeProps {
  transaction: Pick<Transaction, 'tag_type' | 'tag_frequency' | 'tag_label' | 'tag_remaining_payments'>
}

const TAG_ICONS: Record<TagType, string> = {
  recurring:    '🔄',
  subscription: '📱',
  payment_plan: '💳',
}

export function TagBadge({ transaction }: TagBadgeProps) {
  const { tag_type, tag_frequency, tag_label, tag_remaining_payments } = transaction
  if (!tag_type) return null

  const icon  = TAG_ICONS[tag_type]
  const parts: string[] = []

  if (tag_label) parts.push(tag_label)
  else if (tag_type === 'recurring')    parts.push('Recurring')
  else if (tag_type === 'subscription') parts.push('Subscription')

  if (tag_frequency) parts.push(tag_frequency.charAt(0).toUpperCase() + tag_frequency.slice(1))
  if (tag_type === 'payment_plan' && tag_remaining_payments != null) {
    parts.push(`${tag_remaining_payments} left`)
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md"
      style={{
        background:  'rgba(99,102,241,0.1)',
        color:       '#818CF8',
        border:      '1px solid rgba(99,102,241,0.15)',
      }}
    >
      <span className="text-[9px]">{icon}</span>
      {parts.join(' · ')}
    </span>
  )
}
