'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square, RotateCcw, Clock, Target, Brain, Coffee } from 'lucide-react'
import { FocusSession, FocusTimerState, ActionQueueItem } from '@/lib/focus-engine'

interface FocusEngineProps {
  actionItem?: ActionQueueItem
  onSessionComplete?: (session: FocusSession, result: 'completed' | 'made_progress' | 'got_distracted') => void
  onSessionStart?: (session: FocusSession) => void
}

const TIMER_MODES = {
  deep_work: { work: 50, break: 10, label: 'Deep Work' },
  pomodoro: { work: 25, break: 5, label: 'Pomodoro' },
  companion: { work: 90, break: 15, label: 'Companion' }
} as const

export default function FocusEngine({ actionItem, onSessionComplete, onSessionStart }: FocusEngineProps) {
  const [timerState, setTimerState] = useState<FocusTimerState>({
    mode: 'deep_work',
    duration_minutes: TIMER_MODES.deep_work.work,
    break_minutes: TIMER_MODES.deep_work.break,
    is_running: false,
    is_paused: false,
    is_break: false,
    time_remaining: TIMER_MODES.deep_work.work * 60,
    current_cycle: 1,
    total_cycles: 1
  })

  const [showResultModal, setShowResultModal] = useState(false)
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerState.is_running && !timerState.is_paused && timerState.time_remaining > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          time_remaining: prev.time_remaining - 1
        }))
      }, 1000)
    } else if (timerState.time_remaining === 0 && timerState.is_running) {
      // Timer completed
      if (!timerState.is_break) {
        // Work session completed
        if (timerState.mode === 'pomodoro' && timerState.current_cycle < 4) {
          // Start break
          setTimerState(prev => ({
            ...prev,
            is_break: true,
            time_remaining: prev.break_minutes * 60
          }))
        } else {
          // Session completed
          handleSessionComplete()
        }
      } else {
        // Break completed
        if (timerState.mode === 'pomodoro' && timerState.current_cycle < 4) {
          // Start next work cycle
          setTimerState(prev => ({
            ...prev,
            is_break: false,
            time_remaining: prev.duration_minutes * 60,
            current_cycle: prev.current_cycle + 1
          }))
        } else {
          // All cycles completed
          handleSessionComplete()
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerState.is_running, timerState.is_paused, timerState.time_remaining, timerState.is_break])

  const handleSessionComplete = useCallback(() => {
    setTimerState(prev => ({ ...prev, is_running: false }))
    setShowResultModal(true)
  }, [])

  const startSession = useCallback(() => {
    const session: FocusSession = {
      id: Date.now().toString(),
      mode: timerState.mode,
      title: actionItem?.title || 'Focus Session',
      linked_action_id: actionItem?.id,
      duration_minutes: timerState.duration_minutes,
      break_minutes: timerState.break_minutes,
      status: 'running',
      started_at: new Date(),
      completed_cycles: 0
    }

    setCurrentSession(session)
    setTimerState(prev => ({
      ...prev,
      is_running: true,
      is_paused: false,
      session_id: session.id,
      action_id: actionItem?.id
    }))

    onSessionStart?.(session)
  }, [timerState.mode, timerState.duration_minutes, timerState.break_minutes, actionItem, onSessionStart])

  const pauseSession = useCallback(() => {
    setTimerState(prev => ({ ...prev, is_paused: true }))
  }, [])

  const resumeSession = useCallback(() => {
    setTimerState(prev => ({ ...prev, is_paused: false }))
  }, [])

  const cancelSession = useCallback(() => {
    setTimerState(prev => ({ ...prev, is_running: false, is_paused: false, time_remaining: prev.duration_minutes * 60 }))
    setCurrentSession(null)
  }, [timerState.duration_minutes])

  const resetSession = useCallback(() => {
    setTimerState(prev => ({ 
      ...prev, 
      is_running: false, 
      is_paused: false, 
      time_remaining: prev.duration_minutes * 60,
      current_cycle: 1
    }))
    setCurrentSession(null)
  }, [timerState.duration_minutes])

  const changeMode = useCallback((mode: keyof typeof TIMER_MODES) => {
    const config = TIMER_MODES[mode]
    setTimerState(prev => ({
      ...prev,
      mode,
      duration_minutes: config.work,
      break_minutes: config.break,
      time_remaining: config.work * 60,
      is_running: false,
      is_paused: false,
      current_cycle: 1,
      total_cycles: mode === 'pomodoro' ? 4 : 1
    }))
  }, [])

  const handleResult = useCallback((result: 'completed' | 'made_progress' | 'got_distracted') => {
    if (currentSession) {
      const completedSession: FocusSession = {
        ...currentSession,
        status: 'completed',
        ended_at: new Date(),
        completed_cycles: timerState.current_cycle,
        result
      }

      onSessionComplete?.(completedSession, result)
      setShowResultModal(false)
      resetSession()
    }
  }, [currentSession, timerState.current_cycle, onSessionComplete, resetSession])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const getProgressPercentage = useCallback(() => {
    const totalTime = timerState.is_break ? timerState.break_minutes * 60 : timerState.duration_minutes * 60
    return ((totalTime - timerState.time_remaining) / totalTime) * 100
  }, [timerState])

  const getModeIcon = useCallback((mode: keyof typeof TIMER_MODES) => {
    switch (mode) {
      case 'deep_work': return <Brain className="w-5 h-5" />
      case 'pomodoro': return <Clock className="w-5 h-5" />
      case 'companion': return <Coffee className="w-5 h-5" />
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}>
        {Object.entries(TIMER_MODES).map(([mode, config]) => (
          <button
            key={mode}
            onClick={() => changeMode(mode as keyof typeof TIMER_MODES)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              timerState.mode === mode 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {getModeIcon(mode as keyof typeof TIMER_MODES)}
            <span>{config.label}</span>
          </button>
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}>
        {/* Action Item */}
        {actionItem && (
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Focused on:</div>
            <div className="text-lg font-semibold text-white">{actionItem.title}</div>
          </div>
        )}

        {/* Timer */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'monospace' }}>
            {formatTime(timerState.time_remaining)}
          </div>
          <div className="text-sm text-gray-400">
            {timerState.is_break ? 'Break Time' : 'Focus Time'} 
            {timerState.mode === 'pomodoro' && ` • Cycle ${timerState.current_cycle}/4`}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          {!timerState.is_running ? (
            <button
              onClick={startSession}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Focus
            </button>
          ) : (
            <>
              {!timerState.is_paused ? (
                <button
                  onClick={pauseSession}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeSession}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Resume
                </button>
              )}
              <button
                onClick={cancelSession}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Square className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}
          <button
            onClick={resetSession}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl max-w-md w-full"
            style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Session Complete!</h3>
            <p className="text-gray-300 mb-6">How did your focus session go?</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleResult('completed')}
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                ✓ Completed - Finished the task
              </button>
              <button
                onClick={() => handleResult('made_progress')}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                → Made Progress - Partial completion
              </button>
              <button
                onClick={() => handleResult('got_distracted')}
                className="w-full p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                ! Got Distracted - Lost focus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
