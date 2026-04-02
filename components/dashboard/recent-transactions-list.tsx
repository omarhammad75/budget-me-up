'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TransactionItem } from '@/components/transactions/transaction-item'
import type { Transaction } from '@/lib/types'

interface RecentTransactionsListProps {
  transactions: Transaction[]
}

function getDateGroup(dateStr: string): string {
  const today = new Date()
  const txDate = new Date(dateStr)
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const txMidnight = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate())
  const diffDays = Math.round((todayMidnight.getTime() - txMidnight.getTime()) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return 'Earlier this month'
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  // Group transactions by date label
  const groups: { label: string; items: Transaction[] }[] = []
  for (const tx of transactions) {
    const label = getDateGroup(tx.date)
    const existing = groups.find(g => g.label === label)
    if (existing) {
      existing.items.push(tx)
    } else {
      groups.push({ label, items: [tx] })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mx-5 mt-4 mb-2"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div
          className="rounded-2xl border border-border p-8 text-center"
          style={{ background: '#111827' }}
        >
          <p className="text-3xl mb-3">💸</p>
          <p className="text-sm font-medium text-foreground mb-1">No transactions yet</p>
          <p className="text-xs text-muted-foreground">Add your first transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ label, items }) => (
            <div key={label}>
              {/* Date group label */}
              <div className="flex items-center gap-3 mb-2 px-1">
                <span className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
                  {label}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Transactions */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: '#111827',
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
              >
                {items.map((tx, i) => (
                  <div key={tx.id} className={i > 0 ? 'border-t border-white/4' : ''}>
                    <TransactionItem transaction={tx} index={i} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
