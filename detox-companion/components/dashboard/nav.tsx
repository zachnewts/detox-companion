'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Progress', icon: '📊' },
  { href: '/dashboard/chat', label: 'Chat', icon: '💬' },
  { href: '/dashboard/motivations', label: 'My Why', icon: '💪' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors',
                pathname === item.href && 'bg-slate-100 text-slate-900 font-medium'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

