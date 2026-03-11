'use client'

import { useState, useEffect } from 'react'
import { Clock, Calendar, Sun, Moon, Sunrise, Sunset } from 'lucide-react'

interface TimeInfo {
  time: string
  date: string
  dayOfWeek: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  greeting: string
}

export function TimePerception() {
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      
      let timeOfDay: TimeInfo['timeOfDay'] = 'morning'
      let greeting = 'Good morning'
      
      if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon'
        greeting = 'Good afternoon'
      } else if (hour >= 17 && hour < 21) {
        timeOfDay = 'evening'
        greeting = 'Good evening'
      } else if (hour >= 21 || hour < 5) {
        timeOfDay = 'night'
        greeting = 'Good night'
      }
      
      setTimeInfo({
        time: now.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        date: now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        timeOfDay,
        greeting
      })
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted || !timeInfo) {
    return <div className="h-16" /> // Placeholder to prevent layout shift
  }

  const getTimeIcon = () => {
    switch (timeInfo.timeOfDay) {
      case 'morning':
        return <Sunrise className="w-5 h-5 text-amber-400" />
      case 'afternoon':
        return <Sun className="w-5 h-5 text-yellow-400" />
      case 'evening':
        return <Sunset className="w-5 h-5 text-orange-400" />
      case 'night':
        return <Moon className="w-5 h-5 text-blue-400" />
    }
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      {/* Time Display */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-xl font-mono font-semibold text-white tracking-wider">
          {timeInfo.time}
        </span>
      </div>
      
      {/* Date Display */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>{timeInfo.date}</span>
      </div>
      
      {/* Time of Day Indicator */}
      <div className="flex items-center gap-2 ml-auto">
        {getTimeIcon()}
        <span className="text-sm text-gray-300 capitalize">
          {timeInfo.greeting}
        </span>
      </div>
    </div>
  )
}

// Hook for time-based features
export function useTimePerception() {
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      
      let timeOfDay: TimeInfo['timeOfDay'] = 'morning'
      let greeting = 'Good morning'
      
      if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon'
        greeting = 'Good afternoon'
      } else if (hour >= 17 && hour < 21) {
        timeOfDay = 'evening'
        greeting = 'Good evening'
      } else if (hour >= 21 || hour < 5) {
        timeOfDay = 'night'
        greeting = 'Good night'
      }
      
      setTimeInfo({
        time: now.toLocaleTimeString('en-US', { hour12: false }),
        date: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        timeOfDay,
        greeting
      })
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  return timeInfo
}

// Session timer component
export function SessionTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive) return
    
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Clock className="w-4 h-4" />
      <span>Session: {formatTime(seconds)}</span>
    </div>
  )
}
