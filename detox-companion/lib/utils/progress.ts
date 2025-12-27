import { DetoxSession, Milestone } from '@/lib/types/database'

export function calculateProgress(session: DetoxSession, milestones: Milestone[]) {
  const startTime = new Date(session.started_at).getTime()
  const now = Date.now()
  const hoursElapsed = Math.floor((now - startTime) / (1000 * 60 * 60))
  const daysElapsed = Math.floor(hoursElapsed / 24)
  
  // Find next milestone
  const nextMilestone = milestones.find(m => m.hour_threshold > hoursElapsed) || null
  
  // Calculate percent to next milestone (or 100% if all complete)
  const prevMilestone = [...milestones].reverse().find(m => m.hour_threshold <= hoursElapsed)
  const prevHour = prevMilestone?.hour_threshold || 0
  const nextHour = nextMilestone?.hour_threshold || 168 // Default to 1 week
  const percentToNext = Math.min(100, Math.round(((hoursElapsed - prevHour) / (nextHour - prevHour)) * 100))
  
  return {
    currentHour: hoursElapsed,
    currentDay: daysElapsed + 1,
    percentToNext,
    nextMilestone,
  }
}

export function formatHoursAndMinutes(session: DetoxSession): string {
  const startTime = new Date(session.started_at).getTime()
  const now = Date.now()
  const totalMinutes = Math.floor((now - startTime) / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`
}

