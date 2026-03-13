'use client'

import { useState } from 'react'
import { Brain, Target, Zap, MessageSquare, FileText, Briefcase, TrendingUp, Settings, Archive, Compass, Flower2, Activity } from 'lucide-react'

interface NavigationFixProps {
  activeView: string
  setActiveView: (view: string | any) => void
}

export default function NavigationFix({ activeView, setActiveView }: NavigationFixProps) {
  const [isNavigating, setIsNavigating] = useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Brain className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'capture', label: 'Capture', icon: <Target className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'idea_buckets', label: 'Idea Buckets', icon: <Archive className="w-4 h-4" />, color: 'text-amber-400' },
    { id: 'action_queue', label: 'Action Queue', icon: <Activity className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" />, color: 'text-indigo-400' },
    { id: 'face_engine', label: 'Focus Engine', icon: <Zap className="w-4 h-4" />, color: 'text-orange-400' },
    { id: 'future_self', label: 'Future Self', icon: <Compass className="w-4 h-4" />, color: 'text-pink-400' },
    { id: 'garden', label: 'Garden', icon: <Flower2 className="w-4 h-4" />, color: 'text-emerald-400' },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, color: 'text-gray-400' },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" />, color: 'text-cyan-400' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, color: 'text-red-400' },
    { id: 'autonomous', label: 'Autonomous', icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' }
  ]

  const handleNavigation = (viewId: string) => {
    setIsNavigating(true)
    console.log(`🧭 Navigating to: ${viewId}`)
    
    // Add error boundary for navigation
    try {
      setActiveView(viewId)
      
      // Log successful navigation
      console.log(`✅ Successfully navigated to: ${viewId}`)
      
      // Brief visual feedback
      setTimeout(() => setIsNavigating(false), 300)
    } catch (error) {
      console.error(`❌ Navigation failed to: ${viewId}`, error)
      setIsNavigating(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 max-h-64 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-purple-500/30 shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Navigation Fix</h3>
        {isNavigating && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`p-3 rounded-lg border transition-all ${
              activeView === item.id
                ? 'bg-purple-900/30 border-purple-500/50'
                : 'bg-gray-800 border-gray-700 hover:border-purple-500/30 hover:bg-purple-900/20'
            } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isNavigating}
          >
            <div className={`flex flex-col items-center space-y-1 ${item.color}`}>
              {item.icon}
              <span className="text-xs text-gray-300">{item.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500 border-t border-gray-700 pt-2">
        Current: <span className="text-purple-400 capitalize">{activeView.replace('_', ' ')}</span>
      </div>
    </div>
  )
}
