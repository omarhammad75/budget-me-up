'use client'

import { motion } from 'framer-motion'
import { Repeat } from 'lucide-react'
import { CategoryIcon } from '@/components/shared/category-icon'
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-accent/50 active:bg-accent transition-colors duration-150 text-left"
    >
      <CategoryIcon category={transaction.category} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-muted-foreground">
            {transaction.category?.name ?? 'Uncategorized'}
          </p>
          <span className="text-muted-foreground/40 text-xs">·</span>
          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
          {transaction.is_recurring && (
            <Repeat className="w-3 h-3 text-primary ml-0.5" />
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold font-mono-numbers ${
          isExpense ? 'text-red-400' : 'text-green-400'
        }`}>
          {isExpense ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </p>
        {transaction.notes && (
          <p className="text-xs text-muted-foreground/60 truncate max-w-[80px]">{transaction.notes}</p>
        )}
      </div>
    </motion.button>
  )
}
