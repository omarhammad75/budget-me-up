'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SavingsGoal } from '@/lib/types'

export function useSavings() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false })

    setGoals((data as SavingsGoal[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setGoals(prev => [data as SavingsGoal, ...prev])
      return data as SavingsGoal
    }
    return null
  }

  const update = async (id: string, updates: Partial<SavingsGoal>) => {
    const { error } = await supabase.from('savings_goals').update(updates).eq('id', id)
    if (!error) setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)
    if (!error) setGoals(prev => prev.filter(g => g.id !== id))
  }

  return { goals, loading, add, update, remove, refetch: fetch }
}
