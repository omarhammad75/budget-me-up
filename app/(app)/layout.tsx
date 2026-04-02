'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { MobileNav } from '@/components/layout/mobile-nav'
import { AddTransactionSheet } from '@/components/transactions/add-transaction-sheet'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="min-h-screen mesh-gradient">
      <main className="pb-28">
        {children}
      </main>
      <MobileNav onAddClick={() => setAddOpen(true)} />
      <AddTransactionSheet open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
