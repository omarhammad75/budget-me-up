'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Transaction } from '@/lib/types'
import { getCurrentMonth } from '@/lib/utils/format'

export function useTransactions(limitToCurrentMonth = false) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (limitToCurrentMonth) {
      const { month, year } = getCurrentMonth()
      const start = `${year}-${String(month).padStart(2, '0')}-01`
      const end = new Date(year, month, 0).toISOString().split('T')[0]
      query = query.gte('date', start).lte('date', end)
    }

    const { data } = await query.limit(200)
    setTransactions((data as Transaction[]) ?? [])
    setLoading(false)
  }, [limitToCurrentMonth])

  useEffect(() => { fetch() }, [fetch])

  const add = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'category'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select('*, category:categories(*)')
      .single()

    if (!error && data) {
      setTransactions(prev => [data as Transaction, ...prev])
      return data as Transaction
    }
    return null
  }

  const update = async (id: string, updates: Partial<Transaction>) => {
    const { error } = await supabase.from('transactions').update(updates).eq('id', id)
    if (!error) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  return { transactions, loading, add, update, remove, refetch: fetch }
}
