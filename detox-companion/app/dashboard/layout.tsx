import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Nav } from '@/components/dashboard/nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar - hidden on mobile */}
        <Nav />
        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6 min-h-0">
          {children}
        </main>
      </div>
      {/* Mobile bottom navigation - visible on mobile only */}
      <Nav mobile />
    </div>
  )
}

