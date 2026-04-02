'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Budget } from '@/lib/types'
import { getCurrentMonth } from '@/lib/utils/format'

export function useBudgets(month?: number, year?: number) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const { month: currentMonth, year: currentYear } = getCurrentMonth()
  const m = month ?? currentMonth
  const y = year ?? currentYear

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('budgets')
      .select('*, category:categories(*)')
      .eq('month', m)
      .eq('year', y)
      .order('created_at', { ascending: true })

    setBudgets((data as Budget[]) ?? [])
    setLoading(false)
  }, [m, y])

  useEffect(() => { fetch() }, [fetch])

  const upsert = async (categoryId: string, amount: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: user.id, category_id: categoryId, amount, month: m, year: y },
        { onConflict: 'user_id,category_id,month,year' }
      )
      .select('*, category:categories(*)')
      .single()

    if (!error && data) {
      setBudgets(prev => {
        const exists = prev.findIndex(b => b.category_id === categoryId)
        if (exists >= 0) {
          const next = [...prev]
          next[exists] = data as Budget
          return next
        }
        return [...prev, data as Budget]
      })
    }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (!error) setBudgets(prev => prev.filter(b => b.id !== id))
  }

  return { budgets, loading, upsert, remove, refetch: fetch }
}
