'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FocusSession, ActionQueueItem } from '@/lib/focus-engine'
import FocusEngine from '@/components/FocusEngine'
import { GamificationPanel, AlignmentIndicator, MotivationalBanner } from '@/components/Gamification'
import { UnifiedCapture } from '@/components/UnifiedCapture'
import { ParticleBackground } from '@/components/ParticleBackground'
import { AICompanion } from '@/components/AICompanion'
import LivingAICompanion from '@/components/LivingAICompanion'
import EvolutionEngine from '@/components/EvolutionEngine'
import ConversationalAI from '@/components/ConversationalAI'
import ImageAnalysisAI from '@/components/ImageAnalysisAI'
import { MiniMap } from '@/components/MiniMap'
import { MorningBriefing } from '@/components/MorningBriefing'
import { TimePerception } from '@/components/TimePerception'
import { AIProviderSelector, AIMetadata } from '@/components/AIProviderUI'
import { AutonomousControlPanel } from '@/components/AutonomousControlPanel'
import type { AIProvider, TaskType } from '@/lib/ai-router'
import { providerRouter } from '@/lib/ai-router'
import { biologicalOrchestrator } from '@/lib/biological-coherence'
import { Brain, Target, Zap, MessageSquare, FileText, Briefcase, TrendingUp, ArrowRight, AlertTriangle, CheckCircle, Send, Plus, Search, Settings, X, RefreshCw, Compass, Archive, Link, Mic, Upload, Camera, Save, Inbox, Tag, Filter, ChevronRight, Layout, Clock, Play, Flame, Flower2 } from 'lucide-react'

interface DashboardStats {
  totalNotes: number
  activeProjects: number
  todayPriorities: number
  unfinishedLoops: number
  weeklyCaptureRate: number
  aiResponseAccuracy: number
}

interface CurrentFocus {
  project: string
  nextAction: string
  momentum: number
  status: string
}

interface Signal {
  title: string
  description: string
  signalStrength: number
  confidence: number
  noteCount: number
  lastUpdated: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  // AI Routing Metadata (NEW)
  aiMetadata?: {
    provider: AIProvider
    model: string
    reason: string
    taskType?: TaskType
    confidence?: number
    fallback?: boolean
    biological?: {
      coherence: number
      energyATP: number
      health: number
    }
  }
}

interface Goal {
  id: string
  name: string
  isPrimary: boolean
}

interface ActivityTheme {
  name: string
  count: number
  strength: number
}

interface DriftAnalysis {
  primaryGoal: string
  recentFocus: string
  alignmentScore: number
  driftDirection: 'aligned' | 'mild' | 'strong'
  explanation: string
  activities: ActivityTheme[]
}

// Capture System Interfaces
interface CaptureItem {
  id: string
  source_type: 'text_note' | 'voice_note' | 'pasted_link' | 'screenshot' | 'chat_saved' | 'file_upload'
  raw_content: string
  created_at: Date
  processed_status: 'unprocessed' | 'classified' | 'routed' | 'archived'
  suggested_route: 'idea_bucket' | 'project' | 'action_queue' | 'memory_library' | 'research_queue' | 'archived'
  // Biological Layer: Metabolic Routing
  energy_level: number // 0-100, like ATP in cells
  lifecycle_stage: 'seed' | 'sprout' | 'growth' | 'harvest' | 'decay' // Circadian rhythm
  resilience_score: number // 0-100, tenacity training
  last_fed: Date // When energy last added
  related_captures: string[] // Mycelial network connections
}

interface SystemState {
  primary_goal: string
  goal_weight: number
  recent_topics: string[]
  alignment_score: number
  drift_level: 'aligned' | 'mild_drift' | 'moderate_drift' | 'strong_drift'
}

// Core Events
type CoreEvent = 'CAPTURE_THOUGHT' | 'SET_PRIMARY_GOAL' | 'EXECUTE_ACTION'

// Deterministic State Engine
const calculateDriftLevel = (alignmentScore: number): 'aligned' | 'mild_drift' | 'moderate_drift' | 'strong_drift' => {
  if (alignmentScore >= 80) return 'aligned'
  if (alignmentScore >= 60) return 'mild_drift'
  if (alignmentScore >= 40) return 'moderate_drift'
  return 'strong_drift'
}

const calculateAlignmentScore = (primaryGoalTopics: string[], recentNoteTopics: string[]): number => {
  const overlap = primaryGoalTopics.filter(topic => 
    recentNoteTopics.some(recentTopic => 
      recentTopic.toLowerCase().includes(topic.toLowerCase())
    )
  ).length
  
  const maxPossible = Math.max(primaryGoalTopics.length, recentNoteTopics.length)
  return maxPossible > 0 ? Math.round((overlap / maxPossible) * 100) : 0
}

export default function Dashboard() {
  // System State
  const [systemState, setSystemState] = useState<SystemState>({
    primary_goal: 'Systematic Trading',
    goal_weight: 0.85,
    recent_topics: ['Dashboard UI', 'React Components', 'Trading Architecture', 'Pattern Detection'],
    alignment_score: 62,
    drift_level: 'mild_drift'
  })

  // Navigation state - fixes broken <a href> links
  const [activeView, setActiveView] = useState<'dashboard' | 'capture' | 'idea_buckets' | 'action_queue' | 'projects' | 'face_engine' | 'future_self' | 'garden' | 'notes' | 'chat' | 'settings' | 'autonomous'>('dashboard')

  // Capture System State
  const [captureInbox, setCaptureInbox] = useState<CaptureItem[]>([
    {
      id: '1',
      source_type: 'text_note',
      raw_content: 'Need to improve pattern detection algorithm for trading system',
      created_at: new Date(Date.now() - 1000 * 60 * 5),
      processed_status: 'unprocessed',
      suggested_route: 'project',
      // Biological defaults
      energy_level: 65,
      lifecycle_stage: 'growth',
      resilience_score: 45,
      last_fed: new Date(),
      related_captures: ['2']
    },
    {
      id: '2',
      source_type: 'voice_note',
      raw_content: 'Voice memo about market volatility patterns',
      created_at: new Date(Date.now() - 1000 * 60 * 15),
      processed_status: 'classified',
      suggested_route: 'research_queue',
      energy_level: 40,
      lifecycle_stage: 'sprout',
      resilience_score: 30,
      last_fed: new Date(Date.now() - 1000 * 60 * 30),
      related_captures: ['1']
    },
    {
      id: '3',
      source_type: 'pasted_link',
      raw_content: 'https://example.com/trading-algorithms',
      created_at: new Date(Date.now() - 1000 * 60 * 30),
      processed_status: 'routed',
      suggested_route: 'idea_bucket',
      energy_level: 20,
      lifecycle_stage: 'seed',
      resilience_score: 15,
      last_fed: new Date(Date.now() - 1000 * 60 * 60),
      related_captures: []
    }
  ])

  // Focus Engine State
const [activeFocusSession, setActiveFocusSession] = useState<FocusSession | null>(null)
const [showFocusModal, setShowFocusModal] = useState(false)
const [selectedActionForFocus, setSelectedActionForFocus] = useState<ActionQueueItem | null>(null)

// Action Queue State
const [actionQueue, setActionQueue] = useState<ActionQueueItem[]>([
  {
    id: '1',
    title: 'Build Capture Inbox',
    description: 'Implement the capture system with routing and classification',
    priority: 'high',
    status: 'pending',
    created_at: new Date()
  },
  {
    id: '2',
    title: 'Design Focus Engine',
    description: 'Create timer system with Action Queue integration',
    priority: 'medium',
    status: 'pending',
    created_at: new Date()
  },
  {
    id: '3',
    title: 'Review Architecture Diagram',
    description: 'Validate system flow and module connections',
    priority: 'low',
    status: 'pending',
    created_at: new Date()
  }
])

// Curiosity Engine - Behavioral Signal Tracking (Living Organism Pattern)
interface CuriositySignal {
  topic: string
  frequency: number
  lastEngaged: Date
  intensity: number // 0-100, increases with repeated engagement
  source: 'click' | 'capture' | 'search' | 'focus'
}

const [curiosityMap, setCuriosityMap] = useState<CuriositySignal[]>([
  { topic: 'System Design', frequency: 5, lastEngaged: new Date(), intensity: 75, source: 'capture' },
  { topic: 'AI Integration', frequency: 3, lastEngaged: new Date(), intensity: 45, source: 'click' },
  { topic: 'Focus Methods', frequency: 2, lastEngaged: new Date(), intensity: 30, source: 'focus' }
])

// Emergence Detection - Auto-pattern recognition
const detectEmergingPatterns = (captures: CaptureItem[], curiosity: CuriositySignal[]) => {
  const topicFrequency: Record<string, number> = {}
  
  // Extract topics from captures
  captures.forEach(capture => {
    const words = capture.raw_content.toLowerCase().split(/\s+/)
    words.forEach(word => {
      if (word.length > 4) { // Filter meaningful words
        topicFrequency[word] = (topicFrequency[word] || 0) + 1
      }
    })
  })
  
  // Combine with curiosity signals
  curiosity.forEach(signal => {
    topicFrequency[signal.topic.toLowerCase()] = 
      (topicFrequency[signal.topic.toLowerCase()] || 0) + signal.frequency
  })
  
  // Return top emerging patterns (frequency > 2)
  return Object.entries(topicFrequency)
    .filter(([, freq]) => freq > 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic, freq]) => ({ topic, frequency: freq }))
}

// Track Curiosity - Behavioral logging
const trackCuriosity = (topic: string, source: 'click' | 'capture' | 'search' | 'focus') => {
  setCuriosityMap(prev => {
    const existing = prev.find(c => c.topic.toLowerCase() === topic.toLowerCase())
    
    if (existing) {
      // Intensity increases with repeated engagement (living organism)
      const newIntensity = Math.min(100, existing.intensity + 10)
      return prev.map(c => 
        c.topic.toLowerCase() === topic.toLowerCase()
          ? { ...c, frequency: c.frequency + 1, lastEngaged: new Date(), intensity: newIntensity, source }
          : c
      )
    }
    
    // New curiosity signal born
    return [...prev, { topic, frequency: 1, lastEngaged: new Date(), intensity: 20, source }]
  })
}

// Focus Engine Handlers
const handleFocusSessionStart = (session: FocusSession) => {
  setActiveFocusSession(session)
  
  // Update action item status
  if (session.linked_action_id) {
    setActionQueue(prev => prev.map(action => 
      action.id === session.linked_action_id 
        ? { ...action, status: 'in_progress' }
        : action
    ))
  }
  
  // Add AI message
  const aiResponse: ChatMessage = {
    id: Date.now().toString(),
    role: 'ai',
    content: `Focus session started: "${session.title}" in ${session.mode} mode. Tracking progress and alignment.`,
    timestamp: new Date()
  }
  setMessages(prev => [...prev, aiResponse])
}

const handleFocusSessionComplete = (session: FocusSession, result: 'completed' | 'made_progress' | 'got_distracted') => {
  setActiveFocusSession(null)
  
  // Update action item based on result
  if (session.linked_action_id) {
    setActionQueue(prev => prev.map(action => {
      if (action.id === session.linked_action_id) {
        if (result === 'completed') {
          return { ...action, status: 'completed' }
        } else if (result === 'got_distracted') {
          // Increase drift slightly when distracted
          setSystemState(prevState => ({
            ...prevState,
            alignment_score: Math.max(0, prevState.alignment_score - 5)
          }))
        }
        return { ...action, status: 'pending' } // Reset to pending for retry
      }
      return action
    }))
  }
  
  // Update system state based on result
  if (result === 'completed') {
    setSystemState(prev => ({
      ...prev,
      alignment_score: Math.min(100, prev.alignment_score + 3)
    }))
  }
  
  // Add AI message
  const aiResponse: ChatMessage = {
    id: Date.now().toString(),
    role: 'ai',
    content: `Focus session ${result}: "${session.title}". ${result === 'completed' ? 'Great job! Alignment improved.' : result === 'made_progress' ? 'Good progress made.' : 'Distraction detected. Consider refocusing.'}`,
    timestamp: new Date()
  }
  setMessages(prev => [...prev, aiResponse])
}

const startFocusSession = (actionItem: ActionQueueItem) => {
  setSelectedActionForFocus(actionItem)
  setShowFocusModal(true)
}

  const [quickCaptureText, setQuickCaptureText] = useState('')
  const [showQuickCapture, setShowQuickCapture] = useState(false)

  // Interactive UI State
  const [streak, setStreak] = useState(5)
  const [level, setLevel] = useState(7)
  const [capturesToday, setCapturesToday] = useState(3)
  const [dailyGoal, setDailyGoal] = useState(10)

  // Memory persistence state
  const [userPreferences, setUserPreferences] = useState({
    welcomeMessage: true,
    autoSave: true,
    theme: 'dark'
  })

  // Goal alignment state
  const [goalAlignment, setGoalAlignment] = useState({
    deepFocus: 85,
    districts: ['Trading', 'AI Development', 'Learning', 'Health', 'Projects'],
    recentAchievements: [
      'Completed trading pattern analysis',
      'Fixed UI interactivity issues',
      'Implemented neural network responses'
    ],
    weeklyProgress: 78,
    monthlyProgress: 65
  })

  // Diary state
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: '1',
      date: new Date().toISOString(),
      content: 'Today I made significant progress on the cognitive OS. Fixed all the button interactions and implemented neural network responses.',
      mood: 'productive',
      tags: ['development', 'ui', 'neural-network']
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      content: 'Working on the trading pattern analysis. The AI is learning to recognize market signals better.',
      mood: 'focused',
      tags: ['trading', 'ai', 'patterns']
    }
  ])

  const [newDiaryEntry, setNewDiaryEntry] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalNotes: 156,
    activeProjects: 8,
    todayPriorities: 5,
    unfinishedLoops: 3,
    weeklyCaptureRate: 4.2,
    aiResponseAccuracy: 0.87
  })
  
  const [currentFocus, setCurrentFocus] = useState<CurrentFocus>({
    project: "Trading System Architecture",
    nextAction: "Design pattern detection algorithm",
    momentum: 0.78,
    status: "Focus Mode"
  })
  
  const [topSignal, setTopSignal] = useState<Signal>({
    title: "Trading System Architecture",
    description: "Recurring interest in systematic trading approaches with pattern recognition",
    signalStrength: 0.87,
    confidence: 0.92,
    noteCount: 12,
    lastUpdated: "2 hours ago"
  })
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: 'System Analysis: Recent notes focus on UI design. This differs from primary goal of trading research. Suggestion: Reconnect to core goal.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      role: 'user',
      content: 'Help me understand my current focus patterns',
      timestamp: new Date(Date.now() - 1000 * 60 * 3)
    },
    {
      id: '3',
      role: 'ai',
      content: 'Analysis: 62% alignment with primary goal. Recent activity shows dashboard UI development (85% strength) vs trading architecture (25% strength).',
      timestamp: new Date(Date.now() - 1000 * 60 * 2)
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  
  // AI Provider Selection State (NEW)
  const [selectedAIProvider, setSelectedAIProvider] = useState<AIProvider>('auto')
  const [availableProviders] = useState<AIProvider[]>(['auto', 'ollama', 'gemini'])

  // Goals State
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: 'Systematic Trading', isPrimary: true },
    { id: '2', name: 'AI Systems Development', isPrimary: false },
    { id: '3', name: 'German Learning', isPrimary: false }
  ])
  
  const [newGoal, setNewGoal] = useState('')

  // Deterministic State Engine
  const processCoreEvent = (event: CoreEvent, data?: any) => {
    switch (event) {
      case 'CAPTURE_THOUGHT':
        const newCapture: CaptureItem = {
          id: Date.now().toString(),
          source_type: 'text_note',
          raw_content: data.content,
          created_at: new Date(),
          processed_status: 'unprocessed',
          suggested_route: 'idea_bucket',
          energy_level: 50,
          lifecycle_stage: 'seed',
          resilience_score: 10,
          last_fed: new Date(),
          related_captures: []
        }
        setCaptureInbox(prev => [newCapture, ...prev])
        
        // Update system state
        setSystemState(prev => ({
          ...prev,
          recent_topics: [data.content.slice(0, 20), ...prev.recent_topics.slice(0, 3)]
        }))
        break

      case 'SET_PRIMARY_GOAL':
        setSystemState(prev => ({
          ...prev,
          primary_goal: data.goalName,
          alignment_score: calculateAlignmentScore([data.goalName], prev.recent_topics)
        }))
        break

      case 'EXECUTE_ACTION':
        if (data.action === 'reconnect') {
          setSystemState(prev => ({
            ...prev,
            alignment_score: Math.min(95, prev.alignment_score + 15)
          }))
        }
        break
    }
  }

  // ==========================================
  // L3 AI INTELLIGENCE - PREDICTIVE SYSTEM
  // ==========================================

  // Feature 1: Auto-Routing Suggestions
  // Analyzes past routing behavior to predict where new captures should go
  const getAutoRoutingSuggestion = (content: string): 'project' | 'idea_bucket' | 'action_queue' | 'archived' | null => {
    if (captureInbox.length < 5) return null // Need data to learn
    
    // Extract keywords from content
    const words = content.toLowerCase().split(/\s+/)
    const keywords = words.filter(w => w.length > 4)
    
    // Find similar past captures and see where they were routed
    const routingPatterns: Record<string, number> = { project: 0, idea_bucket: 0, action_queue: 0, archived: 0 }
    
    captureInbox.forEach(capture => {
      const captureWords = capture.raw_content.toLowerCase().split(/\s+/)
      const overlap = keywords.filter(k => captureWords.includes(k)).length
      
      if (overlap > 0 && capture.processed_status === 'routed') {
        routingPatterns[capture.suggested_route] += overlap
      }
    })
    
    // Return highest scoring route if confidence > 50%
    const total = Object.values(routingPatterns).reduce((a, b) => a + b, 0)
    if (total === 0) return null
    
    const [bestRoute, score] = Object.entries(routingPatterns).sort((a, b) => b[1] - a[1])[0]
    return score / total > 0.5 ? (bestRoute as any) : null
  }

  // Feature 2: Cross-Idea Connection Detection (Mycelial Network)
  // Automatically detects related captures and suggests connections
  const detectConnections = (captureId: string): { relatedId: string; strength: number; reason: string }[] => {
    const capture = captureInbox.find(c => c.id === captureId)
    if (!capture) return []
    
    const connections: { relatedId: string; strength: number; reason: string }[] = []
    const words = capture.raw_content.toLowerCase().split(/\s+/).filter(w => w.length > 4)
    
    captureInbox.forEach(other => {
      if (other.id === captureId) return
      
      const otherWords = other.raw_content.toLowerCase().split(/\s+/)
      const sharedWords = words.filter(w => otherWords.includes(w))
      
      if (sharedWords.length >= 2) {
        const strength = Math.min(100, sharedWords.length * 20)
        connections.push({
          relatedId: other.id,
          strength,
          reason: `Shared: ${sharedWords.slice(0, 3).join(', ')}`
        })
      }
    })
    
    return connections.sort((a, b) => b.strength - a.strength).slice(0, 5)
  }

  // Feature 3: Predictive Drift Warnings
  // Forecasts when you'll drift based on patterns
  const predictDrift = (): { risk: 'low' | 'medium' | 'high'; reason: string; timeEstimate: string } => {
    const recentCaptures = captureInbox.filter(c => 
      new Date().getTime() - new Date(c.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    )
    
    const recentCuriosity = curiosityMap.filter(c =>
      new Date().getTime() - new Date(c.lastEngaged).getTime() < 7 * 24 * 60 * 60 * 1000
    )
    
    // Low activity = high drift risk
    if (recentCaptures.length < 3) {
      return {
        risk: 'high',
        reason: 'Low capture activity - under 3 captures this week',
        timeEstimate: 'Drift likely within 2 days'
      }
    }
    
    // Curiosity scattered = medium risk
    if (recentCuriosity.length > 5) {
      return {
        risk: 'medium',
        reason: 'Too many curiosity signals - focus fragmented',
        timeEstimate: 'Drift likely within 1 week'
      }
    }
    
    // Alignment dropping = medium risk
    if (systemState.alignment_score < 50) {
      return {
        risk: 'medium',
        reason: `Alignment at ${systemState.alignment_score}% - below threshold`,
        timeEstimate: 'Drift likely within 3 days'
      }
    }
    
    return {
      risk: 'low',
      reason: 'Good activity and alignment maintained',
      timeEstimate: 'Drift unlikely in next 7 days'
    }
  }

  // Feature 4: Automated Action Generation
  // Converts captures into actionable items automatically
  const generateActions = (captureId: string): { title: string; priority: 'high' | 'medium' | 'low'; reasoning: string }[] => {
    const capture = captureInbox.find(c => c.id === captureId)
    if (!capture) return []
    
    const actions: { title: string; priority: 'high' | 'medium' | 'low'; reasoning: string }[] = []
    const content = capture.raw_content.toLowerCase()
    
    // Pattern matching for action detection
    const actionPatterns = [
      { pattern: /need to|should|must|have to/i, type: 'task', priority: 'medium' as const },
      { pattern: /urgent|asap|immediately|critical/i, type: 'urgent', priority: 'high' as const },
      { pattern: /research|read|study|learn/i, type: 'research', priority: 'low' as const },
      { pattern: /build|create|make|implement/i, type: 'build', priority: 'high' as const },
      { pattern: /meeting|call|talk|discuss/i, type: 'meeting', priority: 'medium' as const },
      { pattern: /fix|bug|error|issue|problem/i, type: 'fix', priority: 'high' as const }
    ]
    
    actionPatterns.forEach(({ pattern, type, priority }) => {
      if (pattern.test(content)) {
        // Extract the action phrase
        const match = content.match(new RegExp(`(?:${pattern.source})\\s+(.{5,50})`, 'i'))
        const actionText = match ? match[1] : content.slice(0, 50)
        
        actions.push({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${actionText}...`,
          priority,
          reasoning: `Detected "${type}" pattern in capture`
        })
      }
    })
    
    // If capture has high energy, suggest immediate action
    if (capture.energy_level > 70 && actions.length === 0) {
      actions.push({
        title: `Review: ${capture.raw_content.slice(0, 40)}...`,
        priority: 'medium',
        reasoning: 'High energy capture needs attention'
      })
    }
    
    return actions.slice(0, 3) // Max 3 suggestions
  }

  // Update drift level when alignment score changes
  useEffect(() => {
    setSystemState(prev => ({
      ...prev,
      drift_level: calculateDriftLevel(prev.alignment_score)
    }))
  }, [systemState.alignment_score])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Load captures from localStorage on mount
  useEffect(() => {
    const savedCaptures = localStorage.getItem('cognitive_os_captures')
    if (savedCaptures) {
      try {
        const parsed = JSON.parse(savedCaptures)
        const capturesWithDates = parsed.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at)
        }))
        setCaptureInbox(capturesWithDates)
      } catch (e) {
        console.error('Failed to load captures from localStorage:', e)
      }
    }
    
    // Load user preferences for persistence
    const savedPreferences = localStorage.getItem('cognitive_os_preferences')
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setUserPreferences(parsed)
      } catch (e) {
        console.error('Failed to load preferences from localStorage:', e)
      }
    }

    // Load streak and progress data
    const savedStreak = localStorage.getItem('cognitive_os_streak')
    if (savedStreak) {
      try {
        const parsed = JSON.parse(savedStreak)
        setStreak(parsed.streak || 5)
        setLevel(parsed.level || 7)
        setCapturesToday(parsed.capturesToday || 3)
      } catch (e) {
        console.error('Failed to load streak data from localStorage:', e)
      }
    }

    // Load goal alignment data
    const savedGoalAlignment = localStorage.getItem('cognitive_os_goal_alignment')
    if (savedGoalAlignment) {
      try {
        const parsed = JSON.parse(savedGoalAlignment)
        setGoalAlignment(parsed)
      } catch (e) {
        console.error('Failed to load goal alignment from localStorage:', e)
      }
    }
    
    // Load curiosity map - living organism remembers
    const savedCuriosity = localStorage.getItem('cognitive_os_curiosity')
    if (savedCuriosity) {
      try {
        const parsed = JSON.parse(savedCuriosity)
        const curiosityWithDates = parsed.map((item: any) => ({
          ...item,
          lastEngaged: new Date(item.lastEngaged)
        }))
        setCuriosityMap(curiosityWithDates)
      } catch (e) {
        console.error('Failed to load curiosity from localStorage:', e)
      }
    }
  }, [])

  // Save captures to localStorage whenever they change
  useEffect(() => {
    if (captureInbox.length > 0) {
      localStorage.setItem('cognitive_os_captures', JSON.stringify(captureInbox))
    }
  }, [captureInbox])
  
  // Save curiosity map - organism remembers patterns
  useEffect(() => {
    if (curiosityMap.length > 0) {
      localStorage.setItem('cognitive_os_curiosity', JSON.stringify(curiosityMap))
    }
  }, [curiosityMap])

  // Save user preferences for persistence
  useEffect(() => {
    localStorage.setItem('cognitive_os_preferences', JSON.stringify(userPreferences))
  }, [userPreferences])

  // Save streak and progress data
  useEffect(() => {
    localStorage.setItem('cognitive_os_streak', JSON.stringify({
      streak,
      level,
      capturesToday
    }))
  }, [streak, level, capturesToday])

  // Save goal alignment data
  useEffect(() => {
    localStorage.setItem('cognitive_os_goal_alignment', JSON.stringify(goalAlignment))
  }, [goalAlignment])

  // Save diary entries
  useEffect(() => {
    localStorage.setItem('cognitive_os_diary', JSON.stringify(diaryEntries))
  }, [diaryEntries])

  // Load diary entries
  useEffect(() => {
    const savedDiary = localStorage.getItem('cognitive_os_diary')
    if (savedDiary) {
      try {
        const parsed = JSON.parse(savedDiary)
        const diaryWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }))
        setDiaryEntries(diaryWithDates)
      } catch (e) {
        console.error('Failed to load diary from localStorage:', e)
      }
    }
  }, [])

  // Welcome message functionality
  useEffect(() => {
    if (userPreferences.welcomeMessage && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'ai',
        content: `Welcome back! 🎯 Your current focus: ${currentFocus.project}. You're on a ${streak}-day streak with ${capturesToday} captures today. Ready to continue your journey?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Unified Capture Handler - connects text, voice, image to the system
  const handleUnifiedCapture = (content: string, type: 'text' | 'voice' | 'image' | 'file', metadata?: any) => {
    const sourceTypeMap = {
      'text': 'text_note' as const,
      'voice': 'voice_note' as const,
      'image': 'screenshot' as const,
      'file': 'file_upload' as const
    }
    
    const newCapture: CaptureItem = {
      id: Date.now().toString(),
      source_type: sourceTypeMap[type],
      raw_content: content,
      created_at: new Date(),
      processed_status: 'unprocessed',
      suggested_route: 'idea_bucket',
      // Biological Layer - new idea is a seed with initial energy
      energy_level: 50, // New ideas start with 50 ATP
      lifecycle_stage: 'seed', // Just planted
      resilience_score: 10, // Not tested yet
      last_fed: new Date(),
      related_captures: [] // Will be populated by mycelial network
    }
    
    setCaptureInbox(prev => [newCapture, ...prev])
    
    setSystemState(prev => {
      const updatedTopics = [content.slice(0, 30), ...prev.recent_topics.slice(0, 3)]
      const newAlignment = calculateAlignmentScore([prev.primary_goal], updatedTopics)
      
      return {
        ...prev,
        recent_topics: updatedTopics,
        alignment_score: newAlignment,
        drift_level: calculateDriftLevel(newAlignment)
      }
    })
    
    const aiResponse: ChatMessage = {
      id: Date.now().toString(),
      role: 'ai',
      content: `Captured ${type}: "${content.slice(0, 50)}${content.length > 50 ? '...' : ''}". Added to inbox for processing.`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiResponse])
    
    // Track curiosity from capture content - closed loop feedback
    const keywords = content.toLowerCase().split(/\s+/).filter((w: string) => w.length > 4)
    if (keywords.length > 0) {
      // Track the most meaningful word as curiosity signal
      trackCuriosity(keywords[0], 'capture')
    }
    
    setStats(prev => ({
      ...prev,
      totalNotes: prev.totalNotes + 1,
      weeklyCaptureRate: parseFloat(((prev.totalNotes + 1) / 7).toFixed(1))
    }))
  }

  // Route Capture - Psychology: Reduces decision fatigue, enables flow state
  // Also feeds energy (metabolic routing) and detects mycelial connections
  const routeCapture = (captureId: string, destination: 'project' | 'idea_bucket' | 'action_queue' | 'archived') => {
    setCaptureInbox(prev => prev.map(item => 
      item.id === captureId 
        ? { 
            ...item, 
            suggested_route: destination, 
            processed_status: 'routed',
            // Metabolic routing: feeding energy to routed ideas
            energy_level: Math.min(100, item.energy_level + 15),
            last_fed: new Date(),
            // Lifecycle progression: seed → sprout when routed
            lifecycle_stage: item.lifecycle_stage === 'seed' ? 'sprout' : item.lifecycle_stage
          }
        : item
    ))
    
    // Create action if routed to action_queue
    if (destination === 'action_queue') {
      const capture = captureInbox.find(item => item.id === captureId)
      if (capture) {
        const newAction: ActionQueueItem = {
          id: Date.now().toString(),
          title: capture.raw_content.slice(0, 50),
          description: capture.raw_content,
          priority: 'medium',
          status: 'pending',
          created_at: new Date(),
          linked_project_id: capture.suggested_route === 'project' ? '1' : undefined
        }
        setActionQueue(prev => [newAction, ...prev])
      }
    }
    
    // AI feedback about routing
    const destinationLabels = {
      'project': 'Project workspace',
      'idea_bucket': 'Idea bucket',
      'action_queue': 'Action queue as new task',
      'archived': 'Archive'
    }
    
    const aiResponse: ChatMessage = {
      id: Date.now().toString(),
      role: 'ai',
      content: `Routed to ${destinationLabels[destination]}. Thought organized and ready for execution. Energy +15 ATP.`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiResponse])
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      processCoreEvent('CAPTURE_THOUGHT', { content: inputMessage })
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      
      // AI ROUTING: Determine provider and task type
      const routeResult = providerRouter.route(inputMessage, selectedAIProvider)
      const { provider, taskType, reason, config } = routeResult
      
      console.log(`🤖 AI Routing: ${taskType} → ${provider} (${reason})`)
      
      // BUILD SYSTEM STATE for biological processing
      const biologicalSystemState = {
        captures: captureInbox.map(c => ({
          id: c.id,
          content: c.raw_content,
          timestamp: c.created_at,
          source: c.source_type,
          processed: c.processed_status === 'routed',
          energy: c.energy_level
        })),
        goals: goals.map(g => ({
          id: g.id,
          name: g.name,
          isPrimary: g.isPrimary,
          progress: g.isPrimary ? 75 : 50
        })),
        focus: {
          project: currentFocus?.project || 'None',
          nextAction: currentFocus?.nextAction || 'None',
          momentum: currentFocus?.momentum || 50,
          status: currentFocus?.status || 'active'
        },
        metrics: {
          totalCaptures: captureInbox.length,
          activeProjects: goals.filter(g => !g.isPrimary).length,
          focusTimeToday: 120, // minutes
          energyATP: systemState.alignment_score || 72,
          curiositySignals: curiosityMap.length
        },
        lastUpdated: new Date()
      }
      
      // BIOLOGICAL PROCESSING: Router → Specialist → Tools → State
      try {
        const biologicalResult = await biologicalOrchestrator.processBiologically(
          inputMessage,
          provider,
          taskType,
          biologicalSystemState
        )
        
        // Create AI response with biological metadata
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: biologicalResult.response,
          timestamp: new Date(),
          aiMetadata: {
            provider,
            model: config.model,
            reason,
            taskType,
            confidence: 0.92,
            biological: {
              coherence: biologicalResult.biologicalContext.coherence,
              energyATP: biologicalResult.biologicalContext.energyATP,
              health: biologicalResult.biologicalContext.organs.reduce((sum, o) => sum + o.health, 0) / biologicalResult.biologicalContext.organs.length
            }
          }
        }
        setMessages(prev => [...prev, aiResponse])
        
        // Add biological recommendations as follow-up if any
        if (biologicalResult.recommendations.length > 0) {
          setTimeout(() => {
            const recMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              role: 'ai',
              content: `🧬 Biological Recommendations:\n${biologicalResult.recommendations.map(r => `• ${r}`).join('\n')}`,
              timestamp: new Date(),
              aiMetadata: {
                provider: 'auto',
                model: 'organism',
                reason: 'System health recommendations',
                confidence: 0.95
              }
            }
            setMessages(prev => [...prev, recMessage])
          }, 1000)
        }
        
      } catch (error) {
        console.error('Biological processing error:', error)
        
        // FALLBACK: Simple AI call without biological processing
        try {
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: inputMessage,
              history: messages.slice(-5),
              userState: {
                alignment_score: biologicalSystemState.metrics.energyATP,
                primary_goal: biologicalSystemState.goals.find(g => g.isPrimary)?.name || 'None',
                recent_topics: curiosityMap.slice(0, 3).map(c => c.topic),
                drift_level: 'low',
                preferred_provider: provider,
                task_type: taskType
              },
              routing: {
                provider,
                taskType,
                reason: 'Fallback routing',
                model: config.model
              }
            })
          })

          if (!response.ok) throw new Error('AI request failed')
          
          const data = await response.json()
          
          const fallbackResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: data.response || `I received: "${inputMessage.slice(0, 50)}..."`,
            timestamp: new Date(),
            aiMetadata: {
              provider,
              model: config.model,
              reason: 'Fallback processing',
              taskType,
              fallback: true
            }
          }
          setMessages(prev => [...prev, fallbackResponse])
          
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          
          // ULTIMATE FALLBACK
          const ultimateResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: `I received your message about "${inputMessage.slice(0, 30)}...". The system is experiencing difficulties, but your thought was captured.`,
            timestamp: new Date(),
            aiMetadata: {
              provider: 'auto',
              model: 'offline',
              reason: 'System offline',
              fallback: true
            }
          }
          setMessages(prev => [...prev, ultimateResponse])
        }
      }
    }
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal,
        isPrimary: goals.length === 0
      }
      setGoals([...goals, goal])
      
      if (goals.length === 0) {
        processCoreEvent('SET_PRIMARY_GOAL', { goalName: newGoal })
      }
      
      setNewGoal('')
    }
  }

  const removeGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id)
    setGoals(updatedGoals)
    
    const removedGoal = goals.find(goal => goal.id === id)
    if (removedGoal?.isPrimary && updatedGoals.length > 0) {
      const newPrimary = updatedGoals[0]
      setGoals(updatedGoals.map(goal => ({
        ...goal,
        isPrimary: goal.id === newPrimary.id
      })))
      processCoreEvent('SET_PRIMARY_GOAL', { goalName: newPrimary.name })
    }
  }

  const setPrimaryGoal = (id: string) => {
    setGoals(goals.map(goal => ({
      ...goal,
      isPrimary: goal.id === id
    })))
    
    const newPrimary = goals.find(goal => goal.id === id)
    if (newPrimary) {
      processCoreEvent('SET_PRIMARY_GOAL', { goalName: newPrimary.name })
    }
  }

  const handleQuickCapture = () => {
    if (quickCaptureText.trim()) {
      processCoreEvent('CAPTURE_THOUGHT', { content: quickCaptureText })
      setQuickCaptureText('')
      setShowQuickCapture(false)
    }
  }

  const handleDriftAction = (action: string) => {
    processCoreEvent('EXECUTE_ACTION', { action })
    
    const actionResponses = {
      'reconnect': 'Action executed: Reconnecting to core goal. Alignment score updated.',
      'convert': 'Action executed: Converting exploration to project.',
      'archive': 'Action executed: Archiving side explorations.',
      'link': 'Action executed: Linking to primary goal.'
    }
    
    const response = actionResponses[action as keyof typeof actionResponses] || 'Action executed.'
    
    const aiResponse: ChatMessage = {
      id: Date.now().toString(),
      role: 'ai',
      content: response,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiResponse])
  }

  const handleQuickAction = (action: string) => {
    // Process through neural network
    const neuralResponse = processThroughNeuralNetwork(action);
    
    // Update system state based on action
    switch (action) {
      case 'capture':
        setShowQuickCapture(true);
        setStreak(prev => prev + 1);
        setCapturesToday(prev => prev + 1);
        break;
      case 'analyze':
        // Trigger pattern analysis
        const analysisResult = analyzePatterns(captureInbox);
        break;
      case 'promote':
        // Promote top idea to project
        if (captureInbox.length > 0) {
          const topIdea = captureInbox[0];
          const newProject: Goal = {
            id: Date.now().toString(),
            name: `Project: ${topIdea.raw_content.slice(0, 30)}...`,
            isPrimary: false
          };
          setGoals(prev => [...prev, newProject]);
        }
        break;
      case 'task':
        // Create task from recent capture
        if (captureInbox.length > 0) {
          const newTask: ActionQueueItem = {
            id: Date.now().toString(),
            title: `Task from: ${captureInbox[0].raw_content.slice(0, 30)}...`,
            description: captureInbox[0].raw_content,
            priority: 'medium',
            status: 'pending',
            created_at: new Date()
          };
          setActionQueue(prev => [newTask, ...prev]);
        }
        break;
    }
    
    // Add AI response
    const aiResponse: ChatMessage = {
      id: Date.now().toString(),
      role: 'ai',
      content: neuralResponse,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiResponse])
  }

  // Neural network processing simulation
  const processThroughNeuralNetwork = (action: string): string => {
    const responses = {
      'capture': `🧠 Neural Network: Capture node activated. Pattern recognition suggests this relates to your current focus on ${currentFocus.project}. Energy level: ${systemState.alignment_score}%.`,
      'analyze': `🔍 Pattern Analysis: Processing ${captureInbox.length} captures through neural layers. Detected ${Math.floor(Math.random() * 5) + 2} meaningful patterns. Confidence: ${Math.floor(Math.random() * 30) + 70}%.`,
      'promote': `⚡ Idea Promotion: Neural pathway strengthened. Converting idea to project strengthens mycelial network. New connections formed with ${goals.length} existing goals.`,
      'task': `🎯 Task Creation: Executive function activated. Task queued with priority based on current energy levels and goal alignment. Estimated completion: ${Math.floor(Math.random() * 3) + 1} hours.`
    }
    
    return responses[action as keyof typeof responses] || 'Neural network processing complete.'
  }

  // Pattern analysis function
  const analyzePatterns = (captures: CaptureItem[]) => {
    const patterns = captures.slice(0, 10).map(capture => ({
      id: capture.id,
      pattern: capture.raw_content.slice(0, 50),
      strength: Math.floor(Math.random() * 100),
      timestamp: new Date()
    }));
    
    return patterns;
  }

  const getDriftColor = (score: number) => {
    if (score >= 80) return '#22C55E'
    if (score >= 60) return '#F59E0B'
    return '#EF4444'
  }

  const getDriftClass = (direction: string) => {
    switch (direction) {
      case 'aligned': return 'drift-aligned'
      case 'mild': return 'drift-mild'
      case 'strong': return 'drift-strong'
      default: return 'drift-mild'
    }
  }

  const getDirectionClass = (direction: string) => {
    switch (direction) {
      case 'aligned': return 'drift-direction-aligned'
      case 'mild': return 'drift-direction-mild'
      case 'strong': return 'drift-direction-strong'
      default: return 'drift-direction-mild'
    }
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'text_note': return <FileText className="w-4 h-4" />
      case 'voice_note': return <Mic className="w-4 h-4" />
      case 'pasted_link': return <Link className="w-4 h-4" />
      case 'screenshot': return <Camera className="w-4 h-4" />
      case 'file_upload': return <Upload className="w-4 h-4" />
      case 'chat_saved': return <MessageSquare className="w-4 h-4" />
      default: return <Inbox className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unprocessed': return 'text-yellow-500'
      case 'classified': return 'text-blue-500'
      case 'routed': return 'text-green-500'
      case 'archived': return 'text-gray-500'
      default: return 'text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0F1C' }}>
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-indigo-500 animate-pulse" />
          <span style={{ color: '#FFFFFF' }}>Loading Cognitive OS...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Background Layer */}
      <div className="background-layer"></div>
      
      {/* Sidebar Navigation */}
      <div className="sidebar-nav glass-card">
        <div className="flex items-center space-x-3 mb-8">
          <Brain className="w-8 h-8 neon-glow" style={{ color: '#4F46E5' }} />
          <span className="display-md font-display text-white">Cognitive OS</span>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={activeView === 'dashboard' ? 'nav-item-active' : 'nav-item'}
          >
            <Target className="w-4 h-4 mr-3" />
            Dashboard
          </button>
          
          <div className="pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-500 px-2">COGNITION</span>
          </div>
          
          <button 
            onClick={() => setActiveView('capture')}
            className={activeView === 'capture' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Zap className="w-4 h-4 mr-3" />
            Capture
          </button>
          <button 
            onClick={() => setActiveView('idea_buckets')}
            className={activeView === 'idea_buckets' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Brain className="w-4 h-4 mr-3" />
            Idea Buckets
          </button>
          <button 
            onClick={() => setActiveView('action_queue')}
            className={activeView === 'action_queue' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Layout className="w-4 h-4 mr-3" />
            Action Queue
          </button>
          
          <div className="pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-500 px-2">INTELLIGENCE</span>
          </div>
          
          <button 
            onClick={() => setActiveView('projects')}
            className={activeView === 'projects' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Briefcase className="w-4 h-4 mr-3" />
            Projects
          </button>
          <button 
            onClick={() => setActiveView('face_engine')}
            className={activeView === 'face_engine' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Flame className="w-4 h-4 mr-3" />
            Face Engine
          </button>
          <button 
            onClick={() => setActiveView('future_self')}
            className={activeView === 'future_self' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Compass className="w-4 h-4 mr-3" />
            Future Self
          </button>
          <button 
            onClick={() => setActiveView('garden')}
            className={activeView === 'garden' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Flower2 className="w-4 h-4 mr-3" />
            Garden
          </button>
          
          <div className="pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-500 px-2">CONNECT</span>
          </div>
          
          <button 
            onClick={() => setActiveView('notes')}
            className={activeView === 'notes' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <FileText className="w-4 h-4 mr-3" />
            Notes
          </button>
          <button 
            onClick={() => setActiveView('chat')}
            className={activeView === 'chat' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Chat
          </button>
          <button 
            onClick={() => setActiveView('autonomous')}
            className={activeView === 'autonomous' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Brain className="w-4 h-4 mr-3" />
            Autonomous
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={activeView === 'settings' ? 'premium-nav-item-active' : 'premium-nav-item'}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area - Unified Layout */}
      <div className="main-content">
        {/* Morning Briefing - AI Notifications */}
        <MorningBriefing />

        {/* Motivational Banner - Interactive Visual Feedback */}
        <div className="glass-card p-6 mb-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => {
          setStreak(streak + 1);
          setCapturesToday(capturesToday + 1);
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white mb-2">{streak} Day Streak</div>
              <div className="text-lg text-white/80">Level {level}</div>
              <div className="text-sm text-white/60">{capturesToday} captures today</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60 mb-1">Daily Goal</div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500" style={{ width: `${(capturesToday / dailyGoal) * 100}%` }}></div>
              </div>
              <div className="text-xs text-white/60 mt-1">{capturesToday}/{dailyGoal}</div>
            </div>
          </div>
        </div>

        {/* Goal Alignment Section - Comprehensive Overview */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">Goal Alignment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Deep Focus */}
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{goalAlignment.deepFocus}%</div>
              <div className="text-sm text-white/60">Deep Focus</div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: `${goalAlignment.deepFocus}%` }}></div>
              </div>
            </div>

            {/* Five Districts */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{goalAlignment.districts.length}</div>
              <div className="text-sm text-white/60">Focus Districts</div>
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {goalAlignment.districts.map((district, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                    {district.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{goalAlignment.weeklyProgress}%</div>
              <div className="text-sm text-white/60">Weekly Progress</div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${goalAlignment.weeklyProgress}%` }}></div>
              </div>
            </div>

            {/* Monthly Progress */}
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{goalAlignment.monthlyProgress}%</div>
              <div className="text-sm text-white/60">Monthly Progress</div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600" style={{ width: `${goalAlignment.monthlyProgress}%` }}></div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Recent Achievements</h4>
            <div className="space-y-2">
              {goalAlignment.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-white/80">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diary Section - Personal Journal */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">Diary</h3>
          
          {/* Add new entry */}
          <div className="mb-6">
            <textarea
              value={newDiaryEntry}
              onChange={(e) => setNewDiaryEntry(e.target.value)}
              placeholder="How was your day? What did you learn?"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
            <button
              onClick={() => {
                if (newDiaryEntry.trim()) {
                  const entry = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    content: newDiaryEntry,
                    mood: 'neutral',
                    tags: []
                  }
                  setDiaryEntries([entry, ...diaryEntries])
                  setNewDiaryEntry('')
                }
              }}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Add Entry
            </button>
          </div>

          {/* Recent entries */}
          <div className="space-y-4">
            {diaryEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                    {entry.mood}
                  </span>
                </div>
                <p className="text-white/80 mb-2">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-2">
                    {entry.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature 3: Predictive Drift Warning - L3 Intelligence */}
        {(() => {
          const driftPrediction = predictDrift()
          return driftPrediction.risk !== 'low' ? (
            <div className={`drift-warning-banner risk-${driftPrediction.risk}`}>
              <div className="drift-warning-content">
                <span className="drift-icon">
                  {driftPrediction.risk === 'high' ? '🔴' : '🟡'}
                </span>
                <div className="drift-text">
                  <span className="drift-title">
                    {driftPrediction.risk === 'high' ? 'High Drift Risk Detected' : 'Drift Warning'}
                  </span>
                  <span className="drift-reason">{driftPrediction.reason}</span>
                  <span className="drift-estimate">{driftPrediction.timeEstimate}</span>
                </div>
              </div>
            </div>
          ) : null
        })()}

        {/* VIEW SWITCHING - Renders different content based on navigation */}
        {activeView === 'dashboard' && (
          <>
        {/* Curiosity Heatmap - Living Organism Pattern Recognition */}
        <div className="curiosity-heatmap glass-card gradient-overlay">
          <div className="heatmap-header">
            <Zap className="w-5 h-5 text-amber-400 neon-glow" />
            <span className="font-alternate ui-text text-amber-200">Curiosity Signals</span>
            <span className="text-xs text-gray-500 ml-auto">{curiosityMap.length} active patterns</span>
          </div>
          <div className="heatmap-bars">
            {curiosityMap.sort((a, b) => b.intensity - a.intensity).slice(0, 5).map(signal => (
              <div key={signal.topic} className="heatmap-item">
                <div className="heatmap-label">
                  <span className="text-sm text-gray-300">{signal.topic}</span>
                  <span className="text-xs text-gray-500">{signal.frequency}×</span>
                </div>
                <div className="heatmap-bar-bg">
                  <div 
                    className="heatmap-bar-fill"
                    style={{ 
                      width: `${signal.intensity}%`,
                      backgroundColor: signal.intensity > 70 ? '#F59E0B' : signal.intensity > 40 ? '#8B5CF6' : '#6B7280'
                    }}
                  />
                </div>
                {signal.intensity > 70 && (
                  <button 
                    className="emergence-btn"
                    onClick={() => {
                      // Auto-create project from high-intensity curiosity
                      const newGoal: Goal = {
                        id: Date.now().toString(),
                        name: signal.topic,
                        isPrimary: goals.length === 0
                      }
                      setGoals(prev => [...prev, newGoal])
                      trackCuriosity(signal.topic, 'click')
                    }}
                  >
                    Create Project
                  </button>
                )}
              </div>
            ))}
          </div>
          {curiosityMap.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Engage with captures to awaken curiosity signals...
            </div>
          )}
        </div>

        {/* Homeostatic System Vitals - Self-Regulation */}
        <div className="system-vitals glass-card">
          <div className="vitals-header">
            <Brain className="w-5 h-5 text-emerald-400 neon-glow" />
            <span className="font-alternate ui-text text-emerald-200">System Vitals</span>
            <span className="text-xs text-gray-500 ml-auto">
              {captureInbox.length > 10 ? '⚠️ Digestion needed' : captureInbox.filter(c => c.energy_level > 70).length > 3 ? '🔥 High energy state' : '✅ Homeostasis'}
            </span>
          </div>
          <div className="vitals-grid">
            <div className="vital-stat">
              <span className="vital-label">Captures</span>
              <span className="vital-value">{captureInbox.length}</span>
              <span className="vital-threshold">{captureInbox.length > 10 ? 'Overload' : 'Normal'}</span>
            </div>
            <div className="vital-stat">
              <span className="vital-label">Avg Energy</span>
              <span className={`vital-value ${captureInbox.length > 0 && (captureInbox.reduce((acc, c) => acc + c.energy_level, 0) / captureInbox.length) > 60 ? 'text-amber-400' : ''}`}>
                {captureInbox.length > 0 ? Math.round(captureInbox.reduce((acc, c) => acc + c.energy_level, 0) / captureInbox.length) : 0}
              </span>
              <span className="vital-threshold">ATP</span>
            </div>
            <div className="vital-stat">
              <span className="vital-label">Growth Stage</span>
              <span className="vital-value">{captureInbox.filter(c => c.lifecycle_stage === 'growth').length}</span>
              <span className="vital-threshold">Ready</span>
            </div>
            <div className="vital-stat">
              <span className="vital-label">Battle-Tested</span>
              <span className="vital-value">{captureInbox.filter(c => c.resilience_score > 50).length}</span>
              <span className="vital-threshold">Tenacious</span>
            </div>
          </div>
          {/* Auto-Intervention Messages */}
          {captureInbox.length > 10 && (
            <div className="intervention-message warning">
              System load high. Consider routing {captureInbox.filter(c => c.processed_status === 'unprocessed').length} unprocessed captures.
            </div>
          )}
          {captureInbox.filter(c => c.lifecycle_stage === 'decay').length > 2 && (
            <div className="intervention-message info">
              {captureInbox.filter(c => c.lifecycle_stage === 'decay').length} ideas in decay stage. Archive or re-energize?
            </div>
          )}
        </div>

        {/* CONTROL MODULE - System Control */}
        <div className="control-module">
          <h3 className="heading-xl">System Control</h3>
          <div className="flex gap-6">
            <div>
              <span className="text-muted">Primary Goal</span>
              <div className="text-body font-medium">{systemState.primary_goal}</div>
            </div>
            <div>
              <span className="text-muted">Current Phase</span>
              <div className="status-badge status-healthy">{currentFocus.status}</div>
            </div>
            <div>
              <span className="text-muted">Alignment Score</span>
              <div className="text-body font-medium" style={{ color: getDriftColor(systemState.alignment_score) }}>
                {systemState.alignment_score}%
              </div>
            </div>
            <div>
              <span className="text-muted">Current Focus</span>
              <div className="text-body font-medium">{currentFocus.project}</div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* INTELLIGENCE MODULE - System Intelligence */}
            <div className="intelligence-module">
              <h3 className="heading-xl">System Intelligence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Strongest Signal */}
                <div className="ai-card">
                  <h4 className="heading-lg">Strongest Signal</h4>
                  <div className="signal-card">
                    <div className="signal-title">{topSignal.title}</div>
                    <div className="signal-description">{topSignal.description}</div>
                    <div className="signal-confidence">
                      <span className="text-muted">Confidence:</span>
                      <div className="confidence-bar">
                        <div className="confidence-fill" style={{ width: `${topSignal.confidence * 100}%` }}></div>
                      </div>
                      <span className="text-body font-medium">{Math.round(topSignal.confidence * 100)}%</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Trend: Increasing</div>
                  </div>
                </div>

                {/* Drift Detection */}
                <div className="ai-card ai-card-danger">
                  <h4 className="heading-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    Drift Detection
                  </h4>
                  <div className="text-body">Drift Level: {systemState.drift_level}</div>
                  <div className="text-body">Alignment: {systemState.alignment_score}%</div>
                  <button 
                    className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${systemState.alignment_score >= 95 ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => {
                      if (systemState.alignment_score < 95) {
                        handleDriftAction('reconnect')
                        // Add visual feedback
                        const btn = document.activeElement as HTMLButtonElement
                        if (btn) {
                          btn.textContent = 'Corrected! +15%'
                          setTimeout(() => {
                            btn.textContent = 'Correct Course'
                          }, 1500)
                        }
                      }
                    }}
                    disabled={systemState.alignment_score >= 95}
                  >
                    {systemState.alignment_score >= 95 ? 'Fully Aligned' : 'Correct Course'}
                  </button>
                </div>

                {/* Pattern Trends */}
                <div className="ai-card">
                  <h4 className="heading-lg">Pattern Trends</h4>
                  <div className="space-y-2">
                    {systemState.recent_topics.slice(0, 3).map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-body">{topic}</span>
                        <span className="text-muted">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Unified Capture - Voice, Image, Text */}
            <UnifiedCapture onCapture={handleUnifiedCapture} />

            {/* Capture Queue */}
            <div className="capture-queue">
              <h3 className="heading-xl">Capture Queue</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-body">{captureInbox.filter(item => item.processed_status === 'unprocessed').length} unprocessed items</span>
              </div>
              
              {/* Capture Items - Living Organisms */}
              <div className="space-y-3">
                {captureInbox.slice(0, 5).map(item => (
                  <div 
                    key={item.id} 
                    className={`living-card ${item.lifecycle_stage} ${item.energy_level > 70 ? 'high-energy' : ''}`}
                  >
                    {/* Energy Orb Background */}
                    <div className="energy-orb" style={{ top: '10px', right: '10px' }}></div>
                    
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(item.source_type)}
                        <span className="text-body text-sm">{item.raw_content.slice(0, 50)}...</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${getStatusColor(item.processed_status)}`}>{item.processed_status}</span>
                      </div>
                    </div>
                    {/* Biological Indicators - Living Organism Pattern */}
                    <div className="capture-bio-indicators">
                      {/* Energy Level - Metabolic Routing */}
                      <span className={`bio-badge ${item.energy_level > 70 ? 'energy-high' : item.energy_level > 40 ? 'energy-medium' : 'energy-low'}`}>
                        ⚡ {item.energy_level} ATP
                      </span>
                      
                      {/* Lifecycle Stage - Circadian Rhythm */}
                      <span className={`bio-badge lifecycle-${item.lifecycle_stage}`}>
                        {item.lifecycle_stage === 'seed' ? '🌱' : item.lifecycle_stage === 'sprout' ? '🌿' : item.lifecycle_stage === 'growth' ? '🌳' : item.lifecycle_stage === 'harvest' ? '🍎' : '🍂'} {item.lifecycle_stage}
                      </span>
                      
                      {/* Resilience Score - Tenacity Training */}
                      {item.resilience_score > 0 && (
                        <span className="bio-badge resilience">
                          🛡️ {item.resilience_score}
                        </span>
                      )}
                      
                      {/* Mycelial Connections */}
                      {item.related_captures.length > 0 && (
                        <span className="bio-badge" style={{background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                          🔗 {item.related_captures.length} links
                        </span>
                      )}
                    </div>
                    
                    {/* AI Intelligence Layer - L3 Features */}
                    {item.processed_status === 'unprocessed' && (
                      <div className="ai-intelligence-layer">
                        {/* Feature 1: Auto-Routing Suggestion */}
                        {(() => {
                          const suggestion = getAutoRoutingSuggestion(item.raw_content)
                          return suggestion ? (
                            <div className="ai-suggestion-badge">
                              <span className="ai-label">🤖 AI Suggests:</span>
                              <button 
                                onClick={() => routeCapture(item.id, suggestion)}
                                className="ai-route-btn"
                              >
                                Route to {suggestion.replace('_', ' ')}
                              </button>
                            </div>
                          ) : null
                        })()}
                        
                        {/* Feature 4: Auto-Generated Actions */}
                        {(() => {
                          const actions = generateActions(item.id)
                          return actions.length > 0 ? (
                            <div className="ai-actions-panel">
                              <span className="ai-label">⚡ Suggested Actions:</span>
                              {actions.map((action, idx) => (
                                <div key={idx} className={`ai-action-item priority-${action.priority}`}>
                                  <span className="action-title">{action.title}</span>
                                  <span className="action-reason">{action.reasoning}</span>
                                  <button 
                                    onClick={() => {
                                      routeCapture(item.id, 'action_queue')
                                      // Add to action queue with priority
                                      const newAction: ActionQueueItem = {
                                        id: Date.now().toString(),
                                        title: action.title,
                                        description: item.raw_content,
                                        priority: action.priority,
                                        status: 'pending',
                                        created_at: new Date(),
                                        linked_project_id: item.suggested_route === 'project' ? '1' : undefined
                                      }
                                      setActionQueue(prev => [newAction, ...prev])
                                    }}
                                    className="create-action-btn"
                                  >
                                    Create {action.priority} priority action
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null
                        })()}
                        
                        {/* Feature 2: Cross-Idea Connections */}
                        {(() => {
                          const connections = detectConnections(item.id)
                          return connections.length > 0 ? (
                            <div className="ai-connections-panel">
                              <span className="ai-label">🔗 Connected Ideas:</span>
                              {connections.slice(0, 2).map((conn, idx) => {
                                const relatedCapture = captureInbox.find(c => c.id === conn.relatedId)
                                return relatedCapture ? (
                                  <div key={idx} className="ai-connection-item">
                                    <span className="connection-strength">{conn.strength}% match</span>
                                    <span className="connection-reason">{conn.reason}</span>
                                    <span className="connection-preview">{relatedCapture.raw_content.slice(0, 30)}...</span>
                                  </div>
                                ) : null
                              })}
                            </div>
                          ) : null
                        })()}
                      </div>
                    )}
                    
                    {/* Routing Buttons - Psychology: Reduce decision fatigue with clear paths */}
                    {item.processed_status === 'unprocessed' && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700">
                        <button
                          onClick={() => routeCapture(item.id, 'project')}
                          className="px-2 py-1 text-xs rounded liquid-button text-white"
                        >
                          Project
                        </button>
                        <button
                          onClick={() => routeCapture(item.id, 'idea_bucket')}
                          className="px-2 py-1 text-xs rounded liquid-button text-white"
                          style={{ background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' }}
                        >
                          Idea
                        </button>
                        <button
                          onClick={() => routeCapture(item.id, 'action_queue')}
                          className="px-2 py-1 text-xs rounded liquid-button text-white"
                          style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                        >
                          Action
                        </button>
                        <button
                          onClick={() => routeCapture(item.id, 'archived')}
                          className="px-2 py-1 text-xs rounded glass-morphism text-gray-300"
                        >
                          Archive
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="chat-container glass-card">
              <div className="chat-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="display-lg font-display">AI Assistant</h3>
                    <div className="diary-text">System Analysis & Explanation</div>
                  </div>
                  {/* AI Provider Selector (NEW) */}
                  <AIProviderSelector
                    selected={selectedAIProvider}
                    onSelect={setSelectedAIProvider}
                    availableProviders={availableProviders}
                  />
                </div>
              </div>
              
              <div className="chat-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message-${message.role} animate-fade-in`}>
                    <div className="text-body">{message.content}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {/* AI Metadata Display (NEW) */}
                    {message.role === 'ai' && message.aiMetadata && (
                      <AIMetadata
                        provider={message.aiMetadata.provider}
                        model={message.aiMetadata.model}
                        reason={message.aiMetadata.reason}
                        taskType={message.aiMetadata.taskType}
                        confidence={message.aiMetadata.confidence}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="chat-input">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your patterns, state, or next actions..."
                    className="flex-1 px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#D1D5DB'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: '#4F46E5',
                      color: '#FFFFFF'
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Gamification Panel - Visual Feedback */}
            <GamificationPanel
              streak={{
                currentStreak: 5,
                longestStreak: 12,
                todayCompleted: true,
                weekProgress: [1, 1, 1, 1, 1, 0, 1]
              }}
              stats={{
                focusMinutes: 124,
                capturesToday: 3,
                alignmentScore: systemState.alignment_score,
                level: 7,
                xp: 340,
                maxXp: 500
              }}
              achievements={[
                {
                  id: '1',
                  title: 'First Capture',
                  description: 'Capture your first thought',
                  icon: <CheckCircle className="w-5 h-5" />,
                  unlocked: true,
                  progress: 1,
                  maxProgress: 1
                },
                {
                  id: '2',
                  title: '5-Day Streak',
                  description: 'Use the app for 5 days straight',
                  icon: <Flame className="w-5 h-5" />,
                  unlocked: true,
                  progress: 5,
                  maxProgress: 5
                },
                {
                  id: '3',
                  title: 'Deep Focus',
                  description: 'Complete 10 focus sessions',
                  icon: <Zap className="w-5 h-5" />,
                  unlocked: false,
                  progress: 7,
                  maxProgress: 10
                }
              ]}
            />

            {/* Alignment Indicator */}
            <div className="ai-card">
              <h4 className="heading-lg">Goal Alignment</h4>
              <AlignmentIndicator score={systemState.alignment_score} />
            </div>

            {/* Goal Management */}
            <div className="goal-management">
              <h4 className="heading-lg">Primary Goals</h4>
              <div className="goal-input-group">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  placeholder="Add a new goal..."
                  className="goal-input"
                />
                <button onClick={addGoal} className="goal-add-button">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="goal-list">
                {goals.map(goal => (
                  <div 
                    key={goal.id} 
                    className={`goal-tag ${goal.isPrimary ? 'goal-tag-primary' : ''}`}
                    onClick={() => !goal.isPrimary && setPrimaryGoal(goal.id)}
                    style={{ cursor: !goal.isPrimary ? 'pointer' : 'default' }}
                  >
                    <span>{goal.name}</span>
                    {goal.isPrimary && <span style={{ fontSize: '0.75rem' }}>PRIMARY</span>}
                    <X 
                      className="w-3 h-3 goal-remove" 
                      onClick={(e) => {
                        e.stopPropagation()
                        removeGoal(goal.id)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Queue */}
            <div className="action-queue">
              <h4 className="heading-lg">Action Queue</h4>
              <div className="space-y-3">
                {actionQueue.map(action => (
                  <div 
                    key={action.id} 
                    className="action-item"
                    style={{ 
                      borderLeft: action.status === 'in_progress' ? '4px solid #4F46E5' : '4px solid #6B7280'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold" style={{ color: '#F3F4F6' }}>{action.title}</h5>
                        {/* Project Badge - Polymathy: Contextual coherence across domains */}
                        {action.linked_project_id && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-900 text-purple-200 border border-purple-700">
                            {goals.find((g: Goal) => g.id === action.linked_project_id)?.name || 'Project'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          action.priority === 'high' ? 'bg-red-600 text-white' :
                          action.priority === 'medium' ? 'bg-yellow-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {action.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          action.status === 'completed' ? 'bg-green-600 text-white' :
                          action.status === 'in_progress' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {action.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#9CA3AF' }}>{action.description}</p>
                    
                    {action.status !== 'completed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startFocusSession(action)}
                          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Play className="w-3 h-3" />
                          Start Focus
                        </button>
                        <button
                          onClick={() => startFocusSession(action)}
                          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Clock className="w-3 h-3" />
                          Pomodoro
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* System Metrics */}
            <div className="ai-card">
              <h3 className="heading-xl">System Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-body">Total Notes</span>
                  <span className="text-body font-medium">{stats.totalNotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body">Active Projects</span>
                  <span className="text-body font-medium">{stats.activeProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body">AI Accuracy</span>
                  <span className="text-body font-medium">{Math.round(stats.aiResponseAccuracy * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body">Weekly Rate</span>
                  <span className="text-body font-medium">{stats.weeklyCaptureRate}/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXECUTION MODULE - Action Center */}
        <div className="execution-module">
          <h3 className="heading-xl">Action Center</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="action-card" onClick={(event) => {
              handleQuickAction('capture');
              // Add visual feedback
              if (event?.currentTarget) {
                const card = event.currentTarget as HTMLElement;
                card.classList.add('scale-95');
                setTimeout(() => card.classList.remove('scale-95'), 200);
              }
            }}>
              <div className="action-card-header">
                <Plus className="w-5 h-5" style={{ color: '#4F46E5' }} />
                <div className="action-card-title">Capture Thought</div>
              </div>
              <div className="action-card-description">Quickly store a new idea or observation.</div>
              <button className="premium-button-secondary w-full hover:from-blue-600 hover:to-purple-600 transition-all">
                Quick Capture
              </button>
            </div>
            
            <div className="action-card" onClick={(event) => {
              handleQuickAction('analyze');
              // Add visual feedback
              if (event?.currentTarget) {
                const card = event.currentTarget as HTMLElement;
                card.classList.add('scale-95');
                setTimeout(() => card.classList.remove('scale-95'), 200);
              }
            }}>
              <div className="action-card-header">
                <Search className="w-5 h-5" style={{ color: '#4F46E5' }} />
                <div className="action-card-title">Analyze Pattern</div>
              </div>
              <div className="action-card-description">Run pattern detection on recent notes.</div>
              <button className="premium-button-secondary w-full hover:from-blue-600 hover:to-purple-600 transition-all">
                Start Analysis
              </button>
            </div>
            
            <div className="action-card" onClick={(event) => {
              handleQuickAction('promote');
              // Add visual feedback
              if (event?.currentTarget) {
                const card = event.currentTarget as HTMLElement;
                card.classList.add('scale-95');
                setTimeout(() => card.classList.remove('scale-95'), 200);
              }
            }}>
              <div className="action-card-header">
                <Target className="w-5 h-5" style={{ color: '#4F46E5' }} />
                <div className="action-card-title">Promote Idea</div>
              </div>
              <div className="action-card-description">Convert idea bucket into a project.</div>
              <button className="premium-button-secondary w-full hover:from-blue-600 hover:to-purple-600 transition-all">
                Promote to Project
              </button>
            </div>
            
            <div className="action-card" onClick={(event) => {
              handleQuickAction('task');
              // Add visual feedback
              if (event?.currentTarget) {
                const card = event.currentTarget as HTMLElement;
                card.classList.add('scale-95');
                setTimeout(() => card.classList.remove('scale-95'), 200);
              }
            }}>
              <div className="action-card-header">
                <Zap className="w-5 h-5" style={{ color: '#4F46E5' }} />
                <div className="action-card-title">Create Task</div>
              </div>
              <div className="action-card-description">Generate actionable task from insights.</div>
              <button className="premium-button-secondary w-full hover:from-blue-600 hover:to-purple-600 transition-all">
                Create Task
              </button>
            </div>
          </div>
        </div>
        </>)}

        {/* CAPTURE VIEW */}
        {activeView === 'capture' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Capture</h2>
            <UnifiedCapture onCapture={handleUnifiedCapture} />
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Recent Captures</h3>
              <div className="space-y-2">
                {captureInbox.slice(0, 10).map(item => (
                  <div key={item.id} className="p-3 bg-gray-800 rounded">
                    <span className="text-sm">{item.raw_content.slice(0, 60)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES VIEW */}
        {activeView === 'notes' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Notes</h2>
            <p className="text-gray-400">Notes view - Coming soon</p>
          </div>
        )}

        {/* CHAT VIEW */}
        {activeView === 'chat' && (
          <div className="p-6">
            <h2 className="display-xl font-display mb-6">Personal Diary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Diary Entry Section */}
              <div className="paper-texture p-8 rounded-xl">
                <h3 className="diary-title">Today's Reflections</h3>
                <div className="diary-text space-y-4">
                  <p className="quote-text">
                    "The mind is not a vessel to be filled, but a fire to be kindled."
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="ui-text">Mood:</span>
                      <div className="flex space-x-1">
                        <span className="text-2xl">🧠</span>
                        <span className="text-2xl">⚡</span>
                        <span className="text-2xl">🎯</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="ui-text">Energy:</span>
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-amber-500" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="ui-text">Focus:</span>
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <h3 className="font-alternate ui-text mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full liquid-button text-white py-3">
                      <span className="flex items-center justify-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Capture Thought</span>
                      </span>
                    </button>
                    <button className="w-full glass-morphism text-gray-300 py-3">
                      <span className="flex items-center justify-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>Brain Dump</span>
                      </span>
                    </button>
                    <button className="w-full holographic text-white py-3">
                      <span className="flex items-center justify-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Set Intention</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Recent Insights */}
                <div className="glass-card p-6">
                  <h3 className="font-alternate ui-text mb-4">Recent Insights</h3>
                  <div className="space-y-3">
                    <div className="border-l-2 border-primary pl-4">
                      <p className="diary-text text-sm">Your curiosity patterns show increased interest in systems thinking</p>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-4">
                      <p className="diary-text text-sm">Energy levels peaked during morning creative sessions</p>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <div className="border-l-2 border-green-500 pl-4">
                      <p className="diary-text text-sm">Goal alignment improved by 15% this week</p>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS VIEW */}
        {activeView === 'projects' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="space-y-3">
              {goals.map(goal => (
                <div key={goal.id} className="p-4 bg-gray-800 rounded">
                  <span className={goal.isPrimary ? 'text-amber-400 font-bold' : ''}>
                    {goal.isPrimary ? '★ ' : ''}{goal.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeView === 'settings' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-400">Settings - Coming soon</p>
          </div>
        )}

        {/* AUTONOMOUS AGENT VIEW */}
        {activeView === 'autonomous' && (
          <div className="p-6">
            <AutonomousControlPanel />
          </div>
        )}

        {/* IDEA BUCKETS VIEW */}
        {activeView === 'idea_buckets' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Idea Buckets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {captureInbox.filter(c => c.suggested_route === 'idea_bucket' || c.processed_status === 'unprocessed').map(item => (
                <div key={item.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => routeCapture(item.id, 'project')}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-purple-400">{item.source_type}</span>
                    <span className={`text-xs ${item.energy_level > 50 ? 'text-amber-400' : 'text-gray-500'}`}>⚡ {item.energy_level} ATP</span>
                  </div>
                  <p className="text-sm text-gray-300">{item.raw_content.slice(0, 100)}...</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); routeCapture(item.id, 'project'); }} 
                      className="px-2 py-1 text-xs bg-purple-600 rounded hover:bg-purple-700">Promote</button>
                    <button onClick={(e) => { e.stopPropagation(); routeCapture(item.id, 'action_queue'); }}
                      className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700">Action</button>
                  </div>
                </div>
              ))}
            </div>
            {captureInbox.filter(c => c.suggested_route === 'idea_bucket' || c.processed_status === 'unprocessed').length === 0 && (
              <p className="text-gray-400 mt-4">No ideas in buckets. Start capturing!</p>
            )}
          </div>
        )}

        {/* ACTION QUEUE VIEW */}
        {activeView === 'action_queue' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Action Queue</h2>
            <div className="space-y-3">
              {actionQueue.map(action => (
                <div key={action.id} className="p-4 bg-gray-800 rounded-lg border-l-4 border-indigo-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-gray-400">{action.description?.slice(0, 60)}...</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${action.priority === 'high' ? 'bg-red-900 text-red-300' : action.priority === 'medium' ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                          {action.priority}
                        </span>
                        <span className="text-xs text-gray-500">{action.status}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedActionForFocus(action)
                        setShowFocusModal(true)
                      }}
                      className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white text-sm"
                    >
                      Start Focus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {actionQueue.length === 0 && (
              <p className="text-gray-400 mt-4">No actions in queue. Route captures to Action!</p>
            )}
          </div>
        )}

        {/* FACE ENGINE VIEW */}
        {activeView === 'face_engine' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Face Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border border-orange-500/30">
                <h3 className="text-lg font-semibold text-orange-300 mb-2">🔥 Current Streak</h3>
                <p className="text-4xl font-bold text-white">5 days</p>
                <p className="text-sm text-gray-400 mt-2">Keep capturing to maintain your streak!</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">⚡ Energy Level</h3>
                <p className="text-4xl font-bold text-white">{Math.round(captureInbox.reduce((acc, c) => acc + c.energy_level, 0) / (captureInbox.length || 1))} ATP</p>
                <p className="text-sm text-gray-400 mt-2">Average across all captures</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/30">
                <h3 className="text-lg font-semibold text-green-300 mb-2">✅ Completed Actions</h3>
                <p className="text-4xl font-bold text-white">{actionQueue.filter(a => a.status === 'completed').length}</p>
                <p className="text-sm text-gray-400 mt-2">Total actions completed</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/30">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">🎯 Focus Sessions</h3>
                <p className="text-4xl font-bold text-white">12</p>
                <p className="text-sm text-gray-400 mt-2">Total focus sessions completed</p>
              </div>
            </div>
          </div>
        )}

        {/* FUTURE SELF VIEW */}
        {activeView === 'future_self' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Future Self</h2>
            <div className="space-y-6">
              <div className="p-6 bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">🎯 Primary Goal</h3>
                <p className="text-2xl text-white">{systemState.primary_goal}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Goal Alignment</span>
                    <span>{systemState.alignment_score}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${systemState.alignment_score}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">🔮 Predicted Path</h3>
                {(() => {
                  const prediction = predictDrift()
                  return (
                    <div className={`p-4 rounded-lg ${prediction.risk === 'high' ? 'bg-red-900/30 border border-red-500/30' : prediction.risk === 'medium' ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-green-900/30 border border-green-500/30'}`}>
                      <p className="font-semibold text-white">{prediction.risk === 'low' ? '✅ On Track' : prediction.risk === 'medium' ? '⚠️ Adjust Needed' : '🔴 Drift Risk'}</p>
                      <p className="text-sm text-gray-300 mt-1">{prediction.reason}</p>
                      <p className="text-xs text-gray-500 mt-2">{prediction.timeEstimate}</p>
                    </div>
                  )
                })()}
              </div>
              
              <div className="p-6 bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">📈 Growth Trajectory</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Captures</span>
                    <span className="text-white font-semibold">{captureInbox.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Projects</span>
                    <span className="text-white font-semibold">{goals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Curiosity Signals</span>
                    <span className="text-white font-semibold">{curiosityMap.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GARDEN VIEW - 3D Terrarium */}
        {activeView === 'garden' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Cognitive Garden</h2>
            <p className="text-gray-400 mb-4">Explore your ideas as living organisms in 3D space</p>
            {typeof window !== 'undefined' && (
              <div className="garden-canvas">
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Flower2 className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <p>3D Garden View</p>
                    <p className="text-sm text-gray-600 mt-2">{captureInbox.length} idea organisms growing</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Focus Modal */}
        {showFocusModal && selectedActionForFocus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <div className="p-6 rounded-2xl" style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: '#F3F4F6' }}>Focus Session</h3>
                  <button
                    onClick={() => setShowFocusModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" style={{ color: '#6B7280' }} />
                  </button>
                </div>
                
                <FocusEngine
                  actionItem={selectedActionForFocus}
                  onSessionStart={handleFocusSessionStart}
                  onSessionComplete={handleFocusSessionComplete}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Companion - Floating Assistant */}
        <AICompanion />
        
        {/* Living AI Companion - Tiny Responsive AI */}
        <LivingAICompanion />
        
        {/* Conversational AI - Voice & Text Interaction */}
        <ConversationalAI />
        
        {/* Image Analysis AI - Pattern Recognition */}
        <ImageAnalysisAI />
        
        {/* Evolution Engine - Self-Improving System */}
        <EvolutionEngine />

        {/* Mini Map - Only show on dashboard */}
        {activeView === 'dashboard' && (
          <MiniMap 
            captures={captureInbox.map(c => ({ 
              id: c.id, 
              content: c.raw_content.slice(0, 30),
              energy_level: c.energy_level,
              lifecycle_stage: c.lifecycle_stage
            }))}
            connections={captureInbox.flatMap(c => 
              c.related_captures.map(relatedId => [c.id, relatedId] as [string, string])
            )}
          />
        )}
      </div>

      {/* Particle Background - Ambient Life */}
      <ParticleBackground />
    </div>
  )
}
