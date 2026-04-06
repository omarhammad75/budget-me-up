/**
 * Provider abstraction layer
 *
 * All transaction data sources implement TransactionProvider.
 * This allows the app to swap between manual entry and bank-sync
 * (e.g. Plaid) without touching the core transaction logic.
 *
 * Current providers:
 *   - manual  → user-entered transactions (default, always available)
 *   - plaid   → bank-synced transactions (future, requires linked_accounts)
 */

import type { Transaction } from '@/lib/types'

export interface ImportedTransaction {
  external_id:          string
  provider_account_id:  string
  amount:               number
  type:                 'expense' | 'income'
  description:          string
  date:                 string
  category_hint?:       string   // provider's category label for auto-mapping
}

export interface TransactionProvider {
  /** Human-readable provider name, e.g. "Plaid", "Manual" */
  name: string

  /**
   * Fetch new transactions for the given account since `since` (ISO date).
   * Returns raw imported records — caller is responsible for dedup via external_id.
   */
  fetchTransactions(
    providerAccountId: string,
    since: string,
  ): Promise<ImportedTransaction[]>
}
