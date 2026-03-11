'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sun, Moon, Sparkles, Bell } from 'lucide-react'

interface Briefing {
  id: string
  type: 'morning' | 'afternoon' | 'evening' | 'alert' | 'insight'
  title: string
  message: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
}

export function MorningBriefing() {
  const [briefings, setBriefings] = useState<Briefing[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Generate contextual briefings
  useEffect(() => {
    const hour = currentTime.getHours()
    const greetings = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    }

    let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning'
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17) timeOfDay = 'evening'

    // Generate morning briefing
    const morningBriefing: Briefing = {
      id: 'morning-' + Date.now(),
      type: timeOfDay,
      title: `${greetings[timeOfDay]}!`,
      message: `You have 3 unprocessed captures and 2 actions in your queue. Your alignment score is at 72%.`,
      timestamp: new Date(),
      priority: 'medium',
    }

    // Add AI insight
    const aiInsight: Briefing = {
      id: 'insight-' + Date.now(),
      type: 'insight',
      title: '🤖 AI Insight',
      message: `I've noticed you've been capturing more about "trading patterns" lately. Would you like me to help you structure this into a project?`,
      timestamp: new Date(),
      priority: 'low',
    }

    setBriefings([morningBriefing, aiInsight])

    // Auto-hide after 30 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 30000)

    return () => clearTimeout(hideTimer)
  }, [currentTime])

  const dismissBriefing = (id: string) => {
    setBriefings(prev => prev.filter(b => b.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'morning':
        return <Sun className="w-5 h-5 text-amber-400" />
      case 'afternoon':
        return <Sun className="w-5 h-5 text-yellow-400" />
      case 'evening':
        return <Moon className="w-5 h-5 text-blue-400" />
      case 'alert':
        return <Bell className="w-5 h-5 text-red-400" />
      case 'insight':
        return <Sparkles className="w-5 h-5 text-purple-400" />
      default:
        return <Sun className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-amber-500'
      case 'low':
        return 'border-l-blue-500'
      default:
        return 'border-l-gray-500'
    }
  }

  if (!isVisible || briefings.length === 0) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all"
      >
        <Bell className="w-4 h-4 inline mr-2" />
        Show Briefing
      </button>
    )
  }

  return (
    <div className="briefing-center">
      <AnimatePresence mode="popLayout">
        {briefings.map((briefing) => (
          <motion.div
            key={briefing.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`briefing-card mb-3 border-l-4 ${getPriorityColor(briefing.priority)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getIcon(briefing.type)}</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{briefing.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{briefing.message}</p>
                  <div className="mt-3 flex gap-2">
                    {briefing.type === 'insight' && (
                      <>
                        <button
                          onClick={() => dismissBriefing(briefing.id)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                        >
                          Yes, help me
                        </button>
                        <button
                          onClick={() => dismissBriefing(briefing.id)}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                        >
                          Not now
                        </button>
                      </>
                    )}
                    {briefing.type !== 'insight' && (
                      <button
                        onClick={() => dismissBriefing(briefing.id)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                      >
                        Got it
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => dismissBriefing(briefing.id)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
