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
    <Card>
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
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
                  'flex items-center gap-3 p-3 rounded-lg transition-colors',
                  isAchieved && 'bg-green-50 text-green-900',
                  isCurrent && 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200',
                  !isAchieved && !isCurrent && 'text-slate-400'
                )}
              >
                <span className="text-xl">{isAchieved ? '✅' : milestone.icon}</span>
                <div>
                  <div className="font-medium">{milestone.name}</div>
                  <div className="text-sm opacity-70">{milestone.description}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

