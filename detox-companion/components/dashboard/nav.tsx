'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Progress', icon: '📊' },
  { href: '/dashboard/chat', label: 'Chat', icon: '💬' },
  { href: '/dashboard/motivations', label: 'My Why', icon: '💪' },
]

interface NavProps {
  mobile?: boolean
}

export function Nav({ mobile = false }: NavProps) {
  const pathname = usePathname()

  if (mobile) {
    // Mobile bottom navigation
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50 safe-area-inset-bottom">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center h-16 min-h-[44px] text-slate-600 transition-colors',
                  pathname === item.href && 'text-indigo-600 bg-indigo-50'
                )}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  // Desktop sidebar
  return (
    <nav className="hidden md:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px]',
                pathname === item.href && 'bg-slate-100 text-slate-900 font-medium'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

