'use client'

import { Bell, User, LogOut, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  title?: string
  greeting?: string
  name?: string
}

export function Header({ title, greeting, name }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 px-5 pt-safe-top bg-background/80 backdrop-blur-md border-b border-white/4">
      <div className="flex items-center justify-between h-14">
        <div>
          {greeting && name ? (
            <div>
              <p className="text-xs text-muted-foreground/60 font-medium">{greeting}</p>
              <h1 className="text-base font-bold text-foreground leading-tight">{name} 👋</h1>
            </div>
          ) : (
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bell */}
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/6 transition-all duration-150"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150 hover:border-indigo-500/40"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  borderColor: 'rgba(99,102,241,0.2)',
                }}
                aria-label="Account menu"
              >
                <User className="w-4 h-4 text-indigo-400" strokeWidth={1.75} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => router.push('/settings')}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
