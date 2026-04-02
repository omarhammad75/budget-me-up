import type { Transaction, Budget, Category, MonthlyInsight, SpendingByCategory } from '@/lib/types'
import { formatCurrency } from './format'

export function generateInsights(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[],
  totalIncome: number
): MonthlyInsight[] {
  const insights: MonthlyInsight[] = []
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const monthProgress = dayOfMonth / daysInMonth

  const expenses = transactions.filter(t => t.type === 'expense')
  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0)

  // Budget overspending alerts
  for (const budget of budgets) {
    const spent = expenses
      .filter(t => t.category_id === budget.category_id)
      .reduce((sum, t) => sum + t.amount, 0)
    const pct = spent / budget.amount

    if (pct >= 1) {
      const cat = categories.find(c => c.id === budget.category_id)
      insights.push({
        type: 'warning',
        title: `${cat?.name ?? 'Category'} budget exceeded`,
        message: `You've spent ${formatCurrency(spent)} of your ${formatCurrency(budget.amount)} budget.`,
        icon: '⚠️',
      })
    } else if (pct >= 0.8) {
      const cat = categories.find(c => c.id === budget.category_id)
      insights.push({
        type: 'warning',
        title: `${cat?.name ?? 'Category'} budget almost full`,
        message: `${Math.round(pct * 100)}% used — ${formatCurrency(budget.amount - spent)} remaining.`,
        icon: '🔔',
      })
    }
  }

  // Spending pace check
  if (totalIncome > 0) {
    const projectedSpend = totalSpent / monthProgress
    if (projectedSpend > totalIncome * 0.9 && monthProgress < 0.7) {
      insights.push({
        type: 'warning',
        title: 'Spending faster than usual',
        message: `At this pace you'll spend ${formatCurrency(projectedSpend)} this month.`,
        icon: '📈',
      })
    }
  }

  // Large single transaction
  const largeThreshold = totalIncome > 0 ? totalIncome * 0.1 : 500
  const largeTransactions = expenses.filter(t => t.amount > largeThreshold)
  if (largeTransactions.length > 0) {
    const biggest = largeTransactions.sort((a, b) => b.amount - a.amount)[0]
    insights.push({
      type: 'info',
      title: 'Large transaction this month',
      message: `${biggest.description}: ${formatCurrency(biggest.amount)}`,
      icon: '💸',
    })
  }

  // Savings encouragement
  if (totalIncome > 0 && totalSpent < totalIncome * 0.7) {
    const saved = totalIncome - totalSpent
    insights.push({
      type: 'success',
      title: "You're spending well!",
      message: `${formatCurrency(saved)} available to save or invest this month.`,
      icon: '✨',
    })
  }

  // No transactions yet
  if (transactions.length === 0) {
    insights.push({
      type: 'info',
      title: 'Start tracking',
      message: 'Add your first transaction to see spending insights.',
      icon: '👋',
    })
  }

  return insights.slice(0, 3)
}

export function getSpendingByCategory(
  transactions: Transaction[],
  categories: Category[],
  budgets: Budget[]
): SpendingByCategory[] {
  const expenses = transactions.filter(t => t.type === 'expense')
  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0)

  const categoryMap = new Map<string, number>()
  for (const t of expenses) {
    if (t.category_id) {
      categoryMap.set(t.category_id, (categoryMap.get(t.category_id) ?? 0) + t.amount)
    }
  }

  const result: SpendingByCategory[] = []
  for (const [catId, amount] of categoryMap) {
    const category = categories.find(c => c.id === catId)
    if (!category) continue
    const budget = budgets.find(b => b.category_id === catId)
    result.push({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
      budget: budget?.amount,
    })
  }

  return result.sort((a, b) => b.amount - a.amount)
}
