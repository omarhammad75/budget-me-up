'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category, TransactionType } from '@/lib/types'

export function useCategories(type?: TransactionType) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (type) query = query.eq('type', type)

    const { data } = await query
    setCategories((data as Category[]) ?? [])
    setLoading(false)
  }, [type])

  useEffect(() => { fetch() }, [fetch])

  const add = async (category: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setCategories(prev => [...prev, data as Category].sort((a, b) => a.name.localeCompare(b.name)))
      return data as Category
    }
    return null
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, loading, add, remove, refetch: fetch }
}
