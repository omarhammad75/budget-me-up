export type TransactionType = 'expense' | 'income'
export type RecurringInterval = 'daily' | 'weekly' | 'monthly' | 'yearly'

// ── Transaction tagging ──────────────────────────────────────────────────────
// tag_type classifies the nature of an obligation.
// This system is designed to be enriched by future Plaid-imported data.
export type TagType = 'recurring' | 'subscription' | 'payment_plan'
export type TagFrequency = 'weekly' | 'biweekly' | 'monthly'

// source_type distinguishes manually entered transactions from future
// bank-sync imported transactions (e.g. via Plaid). Never remove 'manual'
// as the default — all current data uses it.
export type TransactionSource = 'manual' | 'imported'

export interface Profile {
  id: string
  full_name: string | null
  monthly_income: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: TransactionType
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category_id: string | null
  category?: Category
  description: string
  notes: string | null
  date: string
  is_recurring: boolean
  recurring_interval: RecurringInterval | null
  created_at: string

  // ── Tagging fields (added via migration 002_transaction_tags) ──
  // All nullable for backward compatibility with existing rows.
  tag_type: TagType | null
  tag_frequency: TagFrequency | null
  tag_label: string | null        // Subscription name (e.g. "Netflix") or custom label
  tag_total_payments: number | null   // Payment plans: original number of instalments
  tag_remaining_payments: number | null // Payment plans: how many are left
  tag_next_date: string | null     // ISO date of next expected charge

  // ── Source tracking (Plaid-ready) ──
  // 'manual' = user-entered. 'imported' = bank-sync (future).
  // Future: also store external_id and provider_account_id for dedup.
  source_type: TransactionSource
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  category?: Category
  amount: number
  month: number
  year: number
  created_at: string
  spent?: number
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
  created_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}

export interface SpendingByCategory {
  category: Category
  amount: number
  percentage: number
  budget?: number
}

export interface MonthlyInsight {
  type: 'warning' | 'success' | 'info'
  title: string
  message: string
  icon: string
}

export interface DashboardData {
  totalSpentThisMonth: number
  totalIncomeThisMonth: number
  safeToSpend: number
  totalBudget: number
  budgetUsedPercent: number
  spendingByCategory: SpendingByCategory[]
  recentTransactions: Transaction[]
  insights: MonthlyInsight[]
  savingsGoals: SavingsGoal[]
}

// ── Affordability check result ───────────────────────────────────────────────
export type AffordabilityStatus = 'safe' | 'caution' | 'risky'

export interface AffordabilityResult {
  status: AffordabilityStatus
  remaining: number
  percentUsed: number
  canAfford: boolean
}
