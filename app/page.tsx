'use client'

import { useState, useEffect } from 'react'
import { Brain, Target, Zap, MessageSquare, FileText, Briefcase, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalNotes: number
  activeProjects: number
  todayPriorities: number
  unfinishedLoops: number
  weeklyCaptureRate: number
  aiResponseAccuracy: number
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  variant: 'primary' | 'secondary'
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNotes: 0,
    activeProjects: 0,
    todayPriorities: 0,
    unfinishedLoops: 0,
    weeklyCaptureRate: 0,
    aiResponseAccuracy: 0
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Mock data for now - will be replaced with API call
      setTimeout(() => {
        setStats({
          totalNotes: 47,
          activeProjects: 3,
          todayPriorities: 5,
          unfinishedLoops: 2,
          weeklyCaptureRate: 8.3,
          aiResponseAccuracy: 0.87
        })
        setIsLoading(false)
      }, 1000)
    }

    loadDashboardData()
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: 'quick-note',
      label: 'Quick Capture',
      icon: <FileText className="w-4 h-4" />,
      action: () => window.location.href = '/notes',
      variant: 'primary'
    },
    {
      id: 'chat',
      label: 'Chat with AI',
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => window.location.href = '/chat',
      variant: 'secondary'
    },
    {
      id: 'projects',
      label: 'View Projects',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => window.location.href = '/projects',
      variant: 'secondary'
    },
    {
      id: 'briefing',
      label: 'Daily Briefing',
      icon: <Target className="w-4 h-4" />,
      action: () => window.location.href = '/briefing',
      variant: 'secondary'
    }
  ]

  const StatCard = ({ icon, label, value, trend }: {
    icon: React.ReactNode
    label: string
    value: string | number
    trend?: string
  }) => (
    <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="cognitive-accent">{icon}</div>
        {trend && (
          <span className="text-xs px-2 py-1 rounded-full bg-cognitive-accent/20 text-cognitive-accent">
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm cognitive-text-muted">{label}</div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen cognitive-bg flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 cognitive-accent animate-pulse-subtle" />
          <span className="text-white">Loading Cognitive OS...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cognitive-bg">
      {/* Header */}
      <div className="cognitive-elevated border-b border-cognitive-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 cognitive-accent" />
              <div>
                <h1 className="text-xl font-bold text-white">Cognitive OS</h1>
                <p className="text-xs cognitive-text-muted">Personal Thinking Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm cognitive-text hover:text-white transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back to your Cognitive OS
          </h2>
          <p className="cognitive-text-muted">
            Your personal AI operating system for structured thinking and execution
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Total Notes"
            value={stats.totalNotes}
            trend="+12 this week"
          />
          <StatCard
            icon={<Briefcase className="w-5 h-5" />}
            label="Active Projects"
            value={stats.activeProjects}
            trend="2 high priority"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Today's Priorities"
            value={stats.todayPriorities}
            trend="3 in progress"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Unfinished Loops"
            value={stats.unfinishedLoops}
            trend="↓ 1 from yesterday"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Weekly Capture Rate"
            value={`${stats.weeklyCaptureRate}/day`}
            trend="Above average"
          />
          <StatCard
            icon={<Brain className="w-5 h-5" />}
            label="AI Accuracy"
            value={`${Math.round(stats.aiResponseAccuracy * 100)}%`}
            trend="Improving"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`p-4 rounded-lg border border-cognitive-border transition-all hover:border-cognitive-accent hover:shadow-lg ${
                  action.variant === 'primary' 
                    ? 'cognitive-accent/10 bg-cognitive-accent/20' 
                    : 'cognitive-surface'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={action.variant === 'primary' ? 'cognitive-accent' : 'cognitive-text-muted'}>
                    {action.icon}
                  </div>
                  <span className="font-medium text-white">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Notes */}
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Notes</h3>
            <div className="space-y-3">
              {[
                { title: 'Trading System Architecture', time: '2 hours ago', tags: ['trading', 'coding'] },
                { title: 'Pattern Recognition Insights', time: '5 hours ago', tags: ['research', 'analysis'] },
                { title: 'Productivity System Design', time: '1 day ago', tags: ['systems', 'personal'] },
              ].map((note, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded border border-cognitive-border hover:border-cognitive-accent/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="font-medium text-white">{note.title}</div>
                    <div className="text-sm cognitive-text-muted">{note.time}</div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs px-2 py-1 rounded bg-cognitive-accent/20 text-cognitive-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
            <div className="space-y-4">
              <div className="p-3 rounded border-l-4 border-cognitive-accent bg-cognitive-accent/10">
                <div className="font-medium text-white mb-1">Recurring Pattern Detected</div>
                <div className="text-sm cognitive-text-muted">
                  You've returned to "trading system architecture" 8 times this month. This suggests it's becoming a concrete project direction.
                </div>
              </div>
              <div className="p-3 rounded border-l-4 border-cognitive-success bg-cognitive-success/10">
                <div className="font-medium text-white mb-1">Strategic Opportunity</div>
                <div className="text-sm cognitive-text-muted">
                  Your recent notes show alignment between market analysis and systematic thinking. Consider building a unified framework.
                </div>
              </div>
              <div className="p-3 rounded border-l-4 border-cognitive-warning bg-cognitive-warning/10">
                <div className="font-medium text-white mb-1">Attention Pattern</div>
                <div className="text-sm cognitive-text-muted">
                  Your focus shifts between 3 main domains. Consider dedicating specific days to each domain for deeper work.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
