import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetoxSession, Milestone, UserMilestone } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface MilestonesCardProps {
  milestones: Milestone[]
  achieved: UserMilestone[]
  session: DetoxSession
}

export function MilestonesCard({ milestones, achieved, session }: MilestonesCardProps) {
  const achievedIds = new Set(achieved.map(a => a.milestone_id))
  const startTime = new Date(session.started_at).getTime()
  const hoursElapsed = Math.floor((Date.now() - startTime) / (1000 * 60 * 60))

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-xl">Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 md:space-y-3">
          {milestones.map((milestone) => {
            const isAchieved = achievedIds.has(milestone.id) || hoursElapsed >= milestone.hour_threshold
            const milestoneIndex = milestones.findIndex(m => m.id === milestone.id)
            const isCurrent = !isAchieved && hoursElapsed < milestone.hour_threshold &&
              (milestoneIndex === 0 ||
               hoursElapsed >= milestones[milestoneIndex - 1].hour_threshold)

            return (
              <li
                key={milestone.id}
                className={cn(
                  'flex items-center gap-3 p-3 md:p-3 rounded-lg transition-colors min-h-[60px]',
                  isAchieved && 'bg-green-50 text-green-900',
                  isCurrent && 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200',
                  !isAchieved && !isCurrent && 'text-slate-400'
                )}
              >
                <span className="text-2xl md:text-xl shrink-0">{isAchieved ? '✅' : milestone.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base md:text-base">{milestone.name}</div>
                  <div className="text-sm md:text-sm opacity-70">{milestone.description}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

