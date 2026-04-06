/**
 * Manual transaction provider
 *
 * Placeholder implementation for the TransactionProvider interface.
 * Manual transactions are entered directly by the user and stored in Supabase
 * with source_type = 'manual'. This provider doesn't need to "fetch" anything —
 * it's here to satisfy the abstraction layer and enable future provider switching.
 */

import type { TransactionProvider, ImportedTransaction } from '@/lib/providers'

export const manualProvider: TransactionProvider = {
  name: 'Manual',

  async fetchTransactions(_providerAccountId, _since): Promise<ImportedTransaction[]> {
    // Manual transactions are entered by the user, not fetched from an external source.
    return []
  },
}
