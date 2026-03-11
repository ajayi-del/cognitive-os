// Focus Engine Schema
export interface FocusSession {
  id: string
  mode: 'deep_work' | 'pomodoro' | 'companion'
  title: string
  linked_action_id?: string
  linked_project_id?: string
  duration_minutes: number
  break_minutes: number
  status: 'idle' | 'running' | 'paused' | 'break' | 'completed' | 'cancelled'
  started_at?: Date
  ended_at?: Date
  completed_cycles: number
  notes?: string
  result?: 'completed' | 'made_progress' | 'got_distracted'
}

export interface ActionQueueItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  created_at: Date
  linked_project_id?: string
  focus_sessions?: FocusSession[]
}

export interface FocusStatistics {
  total_sessions: number
  total_minutes: number
  completed_sessions: number
  current_streak: number
  today_minutes: number
  today_sessions: number
  average_session_length: number
}

export interface FocusTimerState {
  mode: 'deep_work' | 'pomodoro' | 'companion'
  duration_minutes: number
  break_minutes: number
  is_running: boolean
  is_paused: boolean
  is_break: boolean
  time_remaining: number
  current_cycle: number
  total_cycles: number
  session_id?: string
  action_id?: string
}
