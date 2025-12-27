import { createClient } from '@/lib/supabase/server'
import { MotivationForm } from '@/components/motivations/motivation-form'
import { MotivationList } from '@/components/motivations/motivation-list'

export default async function MotivationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: motivations } = await supabase
    .from('motivations')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Why</h1>
        <p className="text-slate-600 mt-1">
          Remind yourself why you're doing this. These will be shown on your dashboard
          and referenced by your companion during tough moments.
        </p>
      </div>

      <MotivationForm userId={user!.id} />
      <MotivationList motivations={motivations || []} />
    </div>
  )
}

