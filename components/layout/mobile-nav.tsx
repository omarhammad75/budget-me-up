'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Target, Wallet, Settings, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/budgets', icon: Wallet, label: 'Budgets' },
  { href: '/savings', icon: Target, label: 'Goals' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

interface MobileNavProps {
  onAddClick: () => void
}

export function MobileNav({ onAddClick }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.slice(0, 2).map(item => (
          <NavItem key={item.href} item={item} active={pathname === item.href} />
        ))}

        {/* FAB — Add transaction */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={onAddClick}
            whileTap={{ scale: 0.92 }}
            className="w-14 h-14 -mt-6 rounded-2xl bg-primary shadow-glow flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              boxShadow: '0 0 24px rgba(99,102,241,0.5), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.button>
        </div>

        {navItems.slice(2).map(item => (
          <NavItem key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ item, active }: { item: typeof navItems[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px]',
        active ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      <div className="relative">
        <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
        {active && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
          />
        )}
      </div>
      <span className={cn(
        'text-[10px] font-medium transition-colors',
        active ? 'text-primary' : 'text-muted-foreground/60'
      )}>
        {item.label}
      </span>
    </Link>
  )
}
