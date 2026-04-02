'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, User, DollarSign, Tag, LogOut, ChevronRight, Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useProfile } from '@/lib/hooks/use-profile'
import { useCategories } from '@/lib/hooks/use-categories'
import { usePush } from '@/lib/hooks/use-push'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils/format'
import type { Category } from '@/lib/types'

const CATEGORY_ICONS = ['🍔', '🚗', '🛍️', '🎮', '💊', '⚡', '🏠', '✈️', '📚', '💆', '📱', '💰', '🎵', '🏋️', '🍕', '☕']
const CATEGORY_COLORS = ['#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F97316', '#6366F1', '#06B6D4', '#84CC16', '#F43F5E', '#A78BFA', '#64748B']

export default function SettingsPage() {
  const { profile, update: updateProfile } = useProfile()
  const { categories, add: addCategory, remove: removeCategory } = useCategories()
  const { permission, isSupported, loading: pushLoading, subscribe, unsubscribe } = usePush()
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [monthlyIncome, setMonthlyIncome] = useState(String(profile?.monthly_income ?? ''))
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('💰')
  const [newCatColor, setNewCatColor] = useState('#64748B')
  const [showAddCat, setShowAddCat] = useState(false)

  const handleSaveProfile = async () => {
    setProfileSaving(true)
    await updateProfile({
      full_name: fullName || null,
      monthly_income: parseFloat(monthlyIncome || '0'),
    })
    setProfileSaving(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleNotificationToggle = async () => {
    if (permission === 'granted') {
      await unsubscribe()
    } else {
      await subscribe()
    }
  }

  const handleAddCategory = async () => {
    if (!newCatName) return
    await addCategory({
      name: newCatName,
      icon: newCatIcon,
      color: newCatColor,
      type: 'expense',
      is_default: false,
    })
    setNewCatName('')
    setShowAddCat(false)
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <div className="pb-6">
      <Header title="Settings" />

      <div className="px-5 space-y-6">
        {/* Profile section */}
        <SettingsSection title="Profile" icon={<User className="w-4 h-4" />}>
          <div className="space-y-3 p-4">
            <div className="space-y-1.5">
              <Label>Your name</Label>
              <Input
                placeholder="Your name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Monthly income</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={monthlyIncome}
                  onChange={e => setMonthlyIncome(e.target.value)}
                  className="pl-7"
                  inputMode="decimal"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used to calculate safe-to-spend amount</p>
            </div>
            <Button onClick={handleSaveProfile} disabled={profileSaving} className="w-full">
              {profileSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : profileSaved ? (
                <><Check className="w-4 h-4" /> Saved</>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </SettingsSection>

        {/* Notifications */}
        {isSupported && (
          <SettingsSection title="Notifications" icon={<Bell className="w-4 h-4" />}>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Push notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {permission === 'granted' ? 'Notifications are enabled' :
                     permission === 'denied' ? 'Blocked — enable in browser settings' :
                     'Get alerts for budgets and spending'}
                  </p>
                </div>
                <Switch
                  checked={permission === 'granted'}
                  onCheckedChange={handleNotificationToggle}
                  disabled={pushLoading || permission === 'denied'}
                />
              </div>

              {permission === 'granted' && (
                <>
                  <Separator />
                  <p className="text-xs text-muted-foreground">You will receive alerts for:</p>
                  <div className="space-y-2">
                    {[
                      '📊 Budget threshold warnings (80% and 100%)',
                      '💰 Large expense alerts',
                      '📅 Recurring bill reminders',
                    ].map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        {item}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </SettingsSection>
        )}

        {/* Categories */}
        <SettingsSection title="Expense Categories" icon={<Tag className="w-4 h-4" />}>
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {expenseCategories.map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-xl text-xs font-medium border"
                  style={{ borderColor: `${cat.color}33`, backgroundColor: `${cat.color}11` }}
                >
                  <span>{cat.icon}</span>
                  <span className="text-foreground">{cat.name}</span>
                  {!cat.is_default && (
                    <button
                      onClick={() => removeCategory(cat.id)}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors w-4 h-4 flex items-center justify-center rounded"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {showAddCat ? (
              <div className="space-y-3 p-3 rounded-xl bg-muted">
                <Input
                  placeholder="Category name"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="h-9"
                />
                <div className="flex gap-1 flex-wrap">
                  {CATEGORY_ICONS.map(ic => (
                    <button
                      key={ic}
                      onClick={() => setNewCatIcon(ic)}
                      className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                        newCatIcon === ic ? 'bg-primary/20 ring-1 ring-primary/50' : 'bg-background hover:bg-accent'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {CATEGORY_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewCatColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${newCatColor === c ? 'scale-125 ring-2 ring-white/30' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCategory} disabled={!newCatName} className="flex-1">Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddCat(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCat(true)}
                className="w-full py-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                + Add custom category
              </button>
            )}
          </div>
        </SettingsSection>

        {/* Sign out */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>

        <p className="text-center text-xs text-muted-foreground/40 pb-4">
          BudgetMeUp v0.1.0
        </p>
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}
