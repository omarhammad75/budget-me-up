export type TransactionType = 'expense' | 'income'
export type RecurringInterval = 'daily' | 'weekly' | 'monthly' | 'yearly'

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
