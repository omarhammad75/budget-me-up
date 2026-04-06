'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Check, Loader2 } from 'lucide-react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTransactions } from '@/lib/hooks/use-transactions'
import { useCategories } from '@/lib/hooks/use-categories'
import type { TransactionType } from '@/lib/types'

interface AddTransactionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const AMOUNT_PRESETS = [10, 20, 50, 100]

export function AddTransactionSheet({ open, onOpenChange, onSuccess }: AddTransactionSheetProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isRecurring, setIsRecurring] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const { add } = useTransactions()
  const { categories } = useCategories(type)

  const reset = () => {
    setAmount('')
    setDescription('')
    setCategoryId('')
    setNotes('')
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setIsRecurring(false)
    setSuccess(false)
  }

  const handleSave = async () => {
    if (!amount || !description) return
    setSaving(true)

    const result = await add({
      amount: parseFloat(amount),
      type,
      category_id: categoryId || null,
      description,
      notes: notes || null,
      date,
      is_recurring: isRecurring,
      recurring_interval: null,
      tag_type:               null,
      tag_frequency:          null,
      tag_label:              null,
      tag_total_payments:     null,
      tag_remaining_payments: null,
      tag_next_date:          null,
      source_type:            'manual',
    })

    setSaving(false)
    if (result) {
      setSuccess(true)
      setTimeout(() => {
        reset()
        onOpenChange(false)
        onSuccess?.()
      }, 800)
    }
  }

  const handleAmountKey = (key: string) => {
    if (key === 'DEL') {
      setAmount(prev => prev.slice(0, -1))
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.')
    } else {
      if (amount.includes('.') && amount.split('.')[1]?.length >= 2) return
      setAmount(prev => (prev === '0' ? key : prev + key))
    }
  }

  const displayAmount = amount ? parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: amount.includes('.') ? amount.split('.')[1].length : 0,
    maximumFractionDigits: 2,
  }) : '0'

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <SheetContent side="bottom" className="px-0 pb-safe-bottom">
        <SheetHeader className="px-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Add Transaction</SheetTitle>
            {/* Type toggle */}
            <div className="flex rounded-xl overflow-hidden border border-border p-0.5 bg-muted">
              {(['expense', 'income'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setType(t); setCategoryId('') }}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                    type === t
                      ? t === 'expense'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-muted-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Amount display */}
          <div className="text-center py-2">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold">Saved!</p>
                </motion.div>
              ) : (
                <motion.div key="amount">
                  <p className={`text-5xl font-bold tracking-tight font-mono-numbers ${
                    type === 'expense' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {type === 'expense' ? '-' : '+'}${displayAmount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {amount ? '' : 'Tap numbers below to enter amount'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2">
            {AMOUNT_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => setAmount(String(preset))}
                className="flex-1 py-1.5 rounded-xl bg-muted text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                ${preset}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input
              placeholder="What was this for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Category picker */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto hide-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id === categoryId ? '' : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    categoryId === cat.id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Add a note..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Number pad */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {['1','2','3','4','5','6','7','8','9','.','0','DEL'].map(key => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleAmountKey(key)}
                className={`h-12 rounded-xl font-semibold text-lg transition-colors ${
                  key === 'DEL'
                    ? 'bg-muted/50 text-muted-foreground text-base'
                    : 'bg-muted text-foreground hover:bg-accent active:bg-primary/10'
                }`}
              >
                {key}
              </motion.button>
            ))}
          </div>

          <Button
            className="w-full mt-3 h-13 text-base"
            onClick={handleSave}
            disabled={!amount || !description || saving || success}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Save Transaction'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
