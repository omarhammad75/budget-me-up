'use client'

import { motion } from 'framer-motion'
import { Repeat } from 'lucide-react'
import { CategoryIcon } from '@/components/shared/category-icon'
import { TagBadge } from '@/components/transactions/tag-transaction-sheet'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { Transaction } from '@/lib/types'

interface TransactionItemProps {
  transaction: Transaction
  index?: number
  onClick?: () => void
}

export function TransactionItem({ transaction, index = 0, onClick }: TransactionItemProps) {
  const isExpense = transaction.type === 'expense'

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease: 'easeOut' }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 active:bg-white/5 transition-colors duration-150 text-left"
      style={{ minHeight: 52 }}
    >
      {/* Category icon — compact */}
      <CategoryIcon category={transaction.category} size="xs" />

      {/* Description + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-[13px] font-medium text-foreground truncate leading-snug">
            {transaction.description}
          </p>
          {transaction.is_recurring && (
            <Repeat className="w-2.5 h-2.5 text-indigo-400/70 flex-shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5 truncate">
          {transaction.category?.name ?? 'Uncategorized'}
          <span className="mx-1 text-muted-foreground/25">·</span>
          {formatDate(transaction.date)}
        </p>
        {transaction.tag_type && (
          <div className="mt-1">
            <TagBadge transaction={transaction} />
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p
          className="text-[13px] font-semibold font-mono-numbers tabular-nums"
          style={{ color: isExpense ? '#F87171' : '#4ADE80' }}
        >
          {isExpense ? '−' : '+'}
          {formatCurrency(transaction.amount)}
        </p>
        {transaction.notes && (
          <p className="text-[10px] text-muted-foreground/35 truncate max-w-[68px] mt-0.5">
            {transaction.notes}
          </p>
        )}
      </div>
    </motion.button>
  )
}
