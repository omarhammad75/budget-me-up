'use client'

import { useState, useEffect } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SavingsGoal } from '@/lib/types'

const GOAL_ICONS = ['🎯', '🚗', '🏠', '✈️', '💍', '🎓', '💻', '📱', '🏖️', '🛥️', '🎸', '💊', '🐶', '👶', '🎮', '📸']
const GOAL_COLORS = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#3B82F6']

interface AddGoalSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: SavingsGoal | null
  onSave: (data: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  onDelete?: () => Promise<void>
}

export function AddGoalSheet({ open, onOpenChange, goal, onSave, onDelete }: AddGoalSheetProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [color, setColor] = useState('#7C3AED')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (goal) {
      setName(goal.name)
      setTargetAmount(String(goal.target_amount))
      setCurrentAmount(String(goal.current_amount))
      setDeadline(goal.deadline ?? '')
      setIcon(goal.icon)
      setColor(goal.color)
    } else {
      setName('')
      setTargetAmount('')
      setCurrentAmount('')
      setDeadline('')
      setIcon('🎯')
      setColor('#7C3AED')
    }
  }, [goal, open])

  const handleSave = async () => {
    if (!name || !targetAmount) return
    setSaving(true)
    await onSave({
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount || '0'),
      deadline: deadline || null,
      icon,
      color,
    })
    setSaving(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-0 max-h-[90vh]">
        <SheetHeader className="px-6 pb-4">
          <SheetTitle>{goal ? 'Edit Goal' : 'New Savings Goal'}</SheetTitle>
        </SheetHeader>

        <div className="px-6 space-y-4 pb-6 overflow-y-auto">
          {/* Icon picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICONS.map(i => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${
                    icon === i ? 'bg-primary/20 border border-primary/50 scale-110' : 'bg-muted hover:bg-accent'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {GOAL_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white/30' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Goal name</Label>
            <Input placeholder="e.g. New MacBook, Emergency fund..." value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Target amount</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  className="pl-7"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Already saved</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={e => setCurrentAmount(e.target.value)}
                  className="pl-7"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Target date (optional)</Label>
            <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleSave} disabled={!name || !targetAmount || saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : goal ? 'Save Changes' : 'Create Goal'}
            </Button>
            {goal && onDelete && (
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
