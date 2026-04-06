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
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150"
      style={{ minHeight: 56 }}
      whileTap={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* Category icon */}
      <CategoryIcon category={transaction.category} size="xs" />

      {/* Description + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-medium text-foreground/90 truncate leading-snug">
            {transaction.description}
          </p>
          {transaction.is_recurring && (
            <Repeat className="w-2.5 h-2.5 text-indigo-400/50 flex-shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/40 mt-0.5 truncate leading-none">
          {transaction.category?.name ?? 'Uncategorized'}
          <span className="mx-1 opacity-40">·</span>
          {formatDate(transaction.date)}
        </p>
        {transaction.tag_type && (
          <div className="mt-1.5">
            <TagBadge transaction={transaction} />
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0 pl-2">
        <p
          className="text-[13px] font-semibold font-mono-numbers tabular-nums leading-none"
          style={{ color: isExpense ? '#F87171' : '#4ADE80' }}
        >
          {isExpense ? '−' : '+'}
          {formatCurrency(transaction.amount)}
        </p>
        {transaction.notes && (
          <p className="text-[10px] text-muted-foreground/30 truncate max-w-[72px] mt-1">
            {transaction.notes}
          </p>
        )}
      </div>
    </motion.button>
  )
}
