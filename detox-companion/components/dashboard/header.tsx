'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-slate-900">Detox Companion</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline text-sm text-slate-600 text-right max-w-[200px] truncate">
            {user.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="min-h-[44px] px-3 md:px-4 text-sm md:text-base"
          >
            <span className="hidden md:inline">Sign Out</span>
            <span className="md:hidden">Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

