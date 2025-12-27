import { createClient } from '@/lib/supabase/server'
import { ProgressCard } from '@/components/dashboard/progress-card'
import { MilestonesCard } from '@/components/dashboard/milestones-card'
import { MotivationCard } from '@/components/dashboard/motivation-card'
import { StartDetoxButton } from '@/components/dashboard/start-detox-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get active detox session
  const { data: session } = await supabase
    .from('detox_sessions')
    .select('*')
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .single()

  // Get user's motivations
  const { data: motivations } = await supabase
    .from('motivations')
    .select('*')
    .eq('user_id', user!.id)

  // Get all milestones
  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .order('hour_threshold', { ascending: true })

  // Get user's achieved milestones for active session
  const { data: achievedMilestones } = session
    ? await supabase
        .from('user_milestones')
        .select('*, milestone:milestones(*)')
        .eq('session_id', session.id)
    : { data: [] }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      {!session ? (
        <StartDetoxButton userId={user!.id} />
      ) : (
        <>
          <ProgressCard session={session} milestones={milestones || []} />
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
            <MilestonesCard
              milestones={milestones || []}
              achieved={achievedMilestones || []}
              session={session}
            />
            <MotivationCard motivations={motivations || []} />
          </div>
        </>
      )}
    </div>
  )
}

