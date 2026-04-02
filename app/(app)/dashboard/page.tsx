'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { HeroCard } from '@/components/dashboard/hero-card'
import { SpendingChart } from '@/components/dashboard/spending-chart'
import { InsightsCard } from '@/components/dashboard/insights-card'
import { RecentTransactionsList } from '@/components/dashboard/recent-transactions-list'
import { BudgetOverviewStrip } from '@/components/dashboard/budget-overview-strip'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactions } from '@/lib/hooks/use-transactions'
import { useBudgets } from '@/lib/hooks/use-budgets'
import { useSavings } from '@/lib/hooks/use-savings'
import { useCategories } from '@/lib/hooks/use-categories'
import { useProfile } from '@/lib/hooks/use-profile'
import { generateInsights, getSpendingByCategory } from '@/lib/utils/insights'
import { formatMonth, getCurrentMonth, getGreeting } from '@/lib/utils/format'

export default function DashboardPage() {
  const { month, year } = getCurrentMonth()
  const { transactions, loading: txLoading } = useTransactions(true)
  const { budgets, loading: budgetLoading } = useBudgets(month, year)
  const { goals } = useSavings()
  const { categories } = useCategories()
  const { profile } = useProfile()

  const loading = txLoading || budgetLoading

  const dashboardData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const income = transactions.filter(t => t.type === 'income')
    const totalSpent = expenses.reduce((s, t) => s + t.amount, 0)
    const totalIncomeFromTx = income.reduce((s, t) => s + t.amount, 0)
    const monthlyIncome = profile?.monthly_income ?? 0
    const totalIncome = Math.max(totalIncomeFromTx, monthlyIncome)
    const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)
    const safeToSpend = totalBudget > 0 ? totalBudget - totalSpent : totalIncome - totalSpent
    const budgetUsedPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    const spendingByCategory = getSpendingByCategory(transactions, categories, budgets)
    const insights = generateInsights(transactions, budgets, categories, totalIncome)

    return {
      totalSpent,
      totalIncome,
      totalBudget,
      safeToSpend,
      budgetUsedPercent,
      spendingByCategory,
      insights,
      recentTransactions: transactions.slice(0, 5),
    }
  }, [transactions, budgets, categories, profile])

  const greeting = getGreeting()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="pb-6">
      <Header greeting={greeting} name={firstName} />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <HeroCard
            safeToSpend={dashboardData.safeToSpend}
            totalBudget={dashboardData.totalBudget}
            budgetUsedPercent={dashboardData.budgetUsedPercent}
            totalIncome={dashboardData.totalIncome}
            totalSpent={dashboardData.totalSpent}
            month={formatMonth(month, year)}
          />

          {dashboardData.spendingByCategory.length > 0 && (
            <SpendingChart data={dashboardData.spendingByCategory} />
          )}

          {budgets.length > 0 && (
            <BudgetOverviewStrip
              budgets={budgets}
              transactions={transactions}
            />
          )}

          <InsightsCard insights={dashboardData.insights} />

          <RecentTransactionsList transactions={dashboardData.recentTransactions} />
        </>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 px-5 mt-3">
      <Skeleton className="h-52 rounded-3xl" />
      <Skeleton className="h-44 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  )
}
