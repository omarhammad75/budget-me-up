'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { TransactionItem } from '@/components/transactions/transaction-item'
import { EditTransactionSheet } from '@/components/transactions/edit-transaction-sheet'
import { EmptyState } from '@/components/shared/empty-state'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactions } from '@/lib/hooks/use-transactions'
import { useCategories } from '@/lib/hooks/use-categories'
import { formatCurrency } from '@/lib/utils/format'
import type { Transaction } from '@/lib/types'

type FilterType = 'all' | 'expense' | 'income'

export default function TransactionsPage() {
  const { transactions, loading, remove } = useTransactions()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false
      if (filterCategory && t.category_id !== filterCategory) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          t.description.toLowerCase().includes(q) ||
          t.category?.name.toLowerCase().includes(q) ||
          t.notes?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [transactions, filterType, filterCategory, search])

  const totalShown = filtered.reduce((s, t) => {
    return t.type === 'expense' ? s - t.amount : s + t.amount
  }, 0)

  return (
    <div className="pb-6">
      <Header title="Transactions" />

      <div className="px-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(['all', 'expense', 'income'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filterType === f
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f}
            </button>
          ))}

          <div className="w-px bg-border mx-1 flex-shrink-0" />

          {categories.slice(0, 6).map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(prev => prev === cat.id ? '' : cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filterCategory === cat.id
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border bg-muted text-muted-foreground'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Summary */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
            <span className={`font-semibold font-mono-numbers ${totalShown >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalShown >= 0 ? '+' : ''}{formatCurrency(totalShown)}
            </span>
          </div>
        )}
      </div>

      {/* List */}
      <div className="px-5 mt-3">
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={search || filterType !== 'all' || filterCategory ? 'No matches' : 'No transactions yet'}
            description={search ? 'Try a different search term' : 'Tap the + button to add your first transaction'}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border/50">
            {filtered.map((tx, i) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                index={i}
                onClick={() => setEditTx(tx)}
              />
            ))}
          </div>
        )}
      </div>

      {editTx && (
        <EditTransactionSheet
          transaction={editTx}
          open={!!editTx}
          onOpenChange={open => !open && setEditTx(null)}
          onDelete={() => { remove(editTx.id); setEditTx(null) }}
        />
      )}
    </div>
  )
}
