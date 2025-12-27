export interface Profile {
  id: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface DetoxSession {
  id: string
  user_id: string
  started_at: string
  ended_at: string | null
  status: 'active' | 'completed' | 'paused'
  created_at: string
}

export interface Motivation {
  id: string
  user_id: string
  content: string
  type: 'why' | 'goal' | 'reminder'
  created_at: string
}

export interface Milestone {
  id: string
  name: string
  description: string | null
  hour_threshold: number
  icon: string | null
  created_at: string
}

export interface UserMilestone {
  id: string
  user_id: string
  session_id: string
  milestone_id: string
  achieved_at: string
  milestone?: Milestone
}

export interface Message {
  id: string
  user_id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  session_id: string
  hour_number: number
  message_sent: string
  sent_at: string
}

// Utility type for calculating detox progress
export interface DetoxProgress {
  currentHour: number
  currentDay: number
  percentComplete: number
  nextMilestone: Milestone | null
  achievedMilestones: UserMilestone[]
}

