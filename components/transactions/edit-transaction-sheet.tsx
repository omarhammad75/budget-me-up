'use client'

import { useState } from 'react'
import { Trash2, Loader2, Tag } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTransactions } from '@/lib/hooks/use-transactions'
import { useCategories } from '@/lib/hooks/use-categories'
import { formatCurrency } from '@/lib/utils/format'
import { TagTransactionSheet, TagBadge } from '@/components/transactions/tag-transaction-sheet'
import type { Transaction } from '@/lib/types'

interface EditTransactionSheetProps {
  transaction: Transaction
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export function EditTransactionSheet({ transaction, open, onOpenChange, onDelete }: EditTransactionSheetProps) {
  const [description, setDescription] = useState(transaction.description)
  const [notes, setNotes] = useState(transaction.notes ?? '')
  const [categoryId, setCategoryId] = useState(transaction.category_id ?? '')
  const [date, setDate] = useState(transaction.date)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [tagSheetOpen, setTagSheetOpen] = useState(false)

  const { update } = useTransactions()
  const { categories } = useCategories(transaction.type)

  const handleSave = async () => {
    setSaving(true)
    await update(transaction.id, { description, notes: notes || null, category_id: categoryId || null, date })
    setSaving(false)
    onOpenChange(false)
  }

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-0">
        <SheetHeader className="px-6 pb-4">
          <SheetTitle>Edit Transaction</SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono-numbers ${
              transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'
            }`}>
              {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
            </span>
          </div>
        </SheetHeader>

        <div className="px-6 space-y-4 pb-6">
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id === categoryId ? '' : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    categoryId === cat.id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input placeholder="Optional note..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          {/* ── Classification ──────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Classification
            </Label>
            <button
              onClick={() => setTagSheetOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-all duration-150 hover:border-indigo-500/30"
              style={{
                background:  'rgba(255,255,255,0.03)',
                borderColor: transaction.tag_type ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-muted-foreground/50" />
                {transaction.tag_type ? (
                  <TagBadge transaction={transaction} />
                ) : (
                  <span className="text-muted-foreground/50">Not classified</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground/40">
                {transaction.tag_type ? 'Edit' : 'Classify'}
              </span>
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            {confirmDelete ? (
              <>
                <Button variant="destructive" className="flex-1" onClick={onDelete}>
                  Confirm delete
                </Button>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <TagTransactionSheet
      transaction={transaction}
      open={tagSheetOpen}
      onOpenChange={setTagSheetOpen}
    />
    </>
  )
}
