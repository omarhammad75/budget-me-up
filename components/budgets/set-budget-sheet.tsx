'use client'

import { useState, useEffect } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Budget, Category } from '@/lib/types'

interface SetBudgetSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: Budget | null
  categories: Category[]
  onSave: (categoryId: string, amount: number) => Promise<void>
  onDelete?: () => Promise<void>
}

export function SetBudgetSheet({ open, onOpenChange, budget, categories, onSave, onDelete }: SetBudgetSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (budget) {
      setSelectedCategory(budget.category_id)
      setAmount(String(budget.amount))
    } else {
      setSelectedCategory('')
      setAmount('')
    }
  }, [budget, open])

  const handleSave = async () => {
    if (!selectedCategory || !amount) return
    setSaving(true)
    await onSave(selectedCategory, parseFloat(amount))
    setSaving(false)
  }

  const allCategories = budget?.category
    ? [budget.category, ...categories.filter(c => c.id !== budget.category_id)]
    : categories

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-0">
        <SheetHeader className="px-6 pb-4">
          <SheetTitle>{budget ? 'Edit Budget' : 'Set Budget'}</SheetTitle>
        </SheetHeader>

        <div className="px-6 space-y-4 pb-safe-bottom pb-6">
          {!budget && (
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto hide-scrollbar">
                {allCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                      selectedCategory === cat.id
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {budget && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted">
              <span className="text-2xl">{budget.category?.icon}</span>
              <div>
                <p className="font-semibold text-foreground">{budget.category?.name}</p>
                <p className="text-xs text-muted-foreground">Monthly budget</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Monthly limit</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-8 text-lg font-semibold"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!selectedCategory && !budget || !amount || saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Budget'}
            </Button>
            {budget && onDelete && (
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={async () => { await onDelete() }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
