'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TransactionItem } from '@/components/transactions/transaction-item'
import type { Transaction } from '@/lib/types'

interface RecentTransactionsListProps {
  transactions: Transaction[]
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mx-5 mt-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-2xl mb-2">💸</p>
          <p className="text-sm text-muted-foreground">No transactions yet this month</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border/50">
          {transactions.map((tx, i) => (
            <TransactionItem key={tx.id} transaction={tx} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
