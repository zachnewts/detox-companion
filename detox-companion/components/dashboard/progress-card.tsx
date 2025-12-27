'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetoxSession, Milestone } from '@/lib/types/database'
import { calculateProgress, formatHoursAndMinutes } from '@/lib/utils/progress'

interface ProgressCardProps {
  session: DetoxSession
  milestones: Milestone[]
}

export function ProgressCard({ session, milestones }: ProgressCardProps) {
  const [progress, setProgress] = useState(() => calculateProgress(session, milestones))
  const [timeString, setTimeString] = useState(() => formatHoursAndMinutes(session))

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(calculateProgress(session, milestones))
      setTimeString(formatHoursAndMinutes(session))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [session, milestones])

  return (
    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="text-white/90">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">
            Hour {progress.currentHour}
          </div>
          <div className="text-xl text-white/80 mb-4">
            Day {progress.currentDay}
          </div>
          <div className="text-sm text-white/70 mb-6">
            {timeString} clean
          </div>
          
          {progress.nextMilestone && (
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70 mb-2">Next milestone</div>
              <div className="flex items-center justify-center gap-2 text-lg font-medium">
                <span>{progress.nextMilestone.icon}</span>
                <span>{progress.nextMilestone.name}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progress.percentToNext}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

