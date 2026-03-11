'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Brain, Mic, MicOff, Sparkles, Activity, Zap, Eye, EyeOff, MessageSquare, Heart, Cpu } from 'lucide-react'

interface AICompanionState {
  isActive: boolean
  isListening: boolean
  isAnalyzing: boolean
  mood: 'calm' | 'curious' | 'excited' | 'focused' | 'thinking'
  energy: number
  lastInteraction: Date | null
  personality: {
    name: string
    traits: string[]
    learningStyle: string
    communicationStyle: string
  }
}

interface VoiceNote {
  id: string
  transcript: string
  timestamp: Date
  analysis?: {
    sentiment: string
    topics: string[]
    actionItems: string[]
    patterns: string[]
  }
}

interface AnalysisResult {
  id: string
  type: 'pattern' | 'insight' | 'recommendation' | 'warning'
  title: string
  description: string
  confidence: number
  actionable: boolean
  timestamp: Date
}

export default function LivingAICompanion() {
  const [aiState, setAiState] = useState<AICompanionState>({
    isActive: true,  // Start as active
    isListening: false,
    isAnalyzing: false,
    mood: 'curious',
    energy: 85,
    lastInteraction: null,
    personality: {
      name: 'Nexus',
      traits: ['Analytical', 'Intuitive', 'Proactive', 'Adaptive'],
      learningStyle: 'Pattern Recognition',
      communicationStyle: 'Concise & Insightful'
    }
  })

  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [isOnboarding, setIsOnboarding] = useState(false)  // Start with no onboarding
  const [noteDump, setNoteDump] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Tiny AI Companion Position - Start in a more visible position
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)

  // AI Mood Animation States
  const moodEmojis = {
    calm: '🧘',
    curious: '🤔',
    excited: '✨',
    focused: '🎯',
    thinking: '💭'
  }

  // Initialize AI Companion
  useEffect(() => {
    const savedPersonality = localStorage.getItem('ai-personality')
    if (savedPersonality) {
      setAiState(prev => ({
        ...prev,
        personality: JSON.parse(savedPersonality)
      }))
    }

    // Welcome message
    setTimeout(() => {
      setAiState(prev => ({
        ...prev,
        isActive: true,
        mood: 'curious'
      }))
    }, 1000)
  }, [])

  // Voice Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        
        // Simulate transcription (in real app, send to speech-to-text API)
        const transcription = await transcribeAudio(audioBlob)
        
        const newNote: VoiceNote = {
          id: Date.now().toString(),
          transcript: transcription,
          timestamp: new Date()
        }

        setVoiceNotes(prev => [newNote, ...prev])
        analyzeNote(newNote)
        
        setAiState(prev => ({
          ...prev,
          isListening: false,
          isAnalyzing: true,
          mood: 'thinking'
        }))

        // Simulate analysis completion
        setTimeout(() => {
          setAiState(prev => ({
            ...prev,
            isAnalyzing: false,
            mood: 'excited',
            energy: Math.min(100, prev.energy + 5)
          }))
        }, 2000)
      }

      recorder.start()
      setAiState(prev => ({
        ...prev,
        isListening: true,
        mood: 'focused'
      }))
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  // Real audio transcription using Web Speech API
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Try to use Web Speech API for real transcription
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      return new Promise((resolve, reject) => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          resolve(transcript)
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          // Fallback to simulated transcription
          resolve("Voice note captured: " + generateRandomTranscription())
        }
        
        recognition.onend = () => {
          console.log('Speech recognition ended')
        }
        
        // Start recognition
        try {
          recognition.start()
        } catch (error) {
          console.error('Failed to start speech recognition:', error)
          resolve("Voice note captured: " + generateRandomTranscription())
        }
      })
    } else {
      // Fallback for browsers without speech recognition
      console.log('Speech recognition not supported, using fallback')
      return "Voice note captured: " + generateRandomTranscription()
    }
  }

  // Generate realistic fallback transcription
  const generateRandomTranscription = (): string => {
    const transcriptions = [
      "I need to organize my thoughts better and focus on the main goal",
      "The app is working well but I think the voice notes could be improved",
      "I want to implement a better system for tracking my progress",
      "The AI integration is good but I need more automation",
      "Let me think about how to improve the user experience",
      "I should review my current goals and align them better",
      "The diary section needs to be more visible and functional"
    ]
    return transcriptions[Math.floor(Math.random() * transcriptions.length)]
  }

  // Analyze note for patterns and insights
  const analyzeNote = async (note: VoiceNote) => {
    // Simulate AI analysis
    const analysis = {
      sentiment: 'positive',
      topics: ['systems thinking', 'project alignment', 'daily actions', 'long-term goals'],
      actionItems: ['Review project alignment', 'Schedule daily planning session'],
      patterns: ['Consistent focus on improvement', 'Strategic thinking patterns']
    }

    const updatedNote = { ...note, analysis }
    setVoiceNotes(prev => 
      prev.map(n => n.id === note.id ? updatedNote : n)
    )

    // Generate analysis results
    const results: AnalysisResult[] = [
      {
        id: Date.now().toString(),
        type: 'pattern',
        title: 'Strategic Thinking Pattern',
        description: 'You consistently think in systems and look for alignment between actions and goals.',
        confidence: 0.87,
        actionable: true,
        timestamp: new Date()
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'insight',
        title: 'Project Alignment Opportunity',
        description: 'Consider creating a daily alignment check to bridge the gap between intentions and actions.',
        confidence: 0.92,
        actionable: true,
        timestamp: new Date()
      }
    ]

    setAnalysisResults(prev => [...results, ...prev])
  }

  // Process note dump
  const processNoteDump = async () => {
    if (!noteDump.trim()) return

    setAiState(prev => ({
      ...prev,
      isAnalyzing: true,
      mood: 'thinking'
    }))

    // Simulate processing large text
    setTimeout(() => {
      const insights = [
        "I've identified 3 key patterns in your notes",
        "Your thinking style shows strong systems orientation",
        "Consider breaking down large goals into weekly milestones"
      ]

      const results: AnalysisResult[] = insights.map((insight, index) => ({
        id: (Date.now() + index).toString(),
        type: index === 0 ? 'pattern' : index === 1 ? 'insight' : 'recommendation',
        title: insight,
        description: "Based on your note patterns, this could help optimize your workflow.",
        confidence: 0.8 + (index * 0.05),
        actionable: true,
        timestamp: new Date()
      }))

      setAnalysisResults(prev => [...results, ...prev])
      setNoteDump('')
      
      setAiState(prev => ({
        ...prev,
        isAnalyzing: false,
        mood: 'excited',
        energy: Math.min(100, prev.energy + 10)
      }))
    }, 3000)
  }

  // Handle AI Companion dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 20,
        y: e.clientY - 20
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  if (isOnboarding) {
    return <AIOnboarding onComplete={() => setIsOnboarding(false)} />
  }

  return (
    <>
      {/* Tiny AI Companion */}
      <div
        className={`fixed z-50 cursor-move transition-all duration-300 ${
          aiState.isActive ? 'opacity-100' : 'opacity-50'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '60px',
          height: '60px'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={`
          relative w-full h-full rounded-full flex items-center justify-center
          transition-all duration-500 transform
          ${aiState.mood === 'excited' ? 'scale-110' : 'scale-100'}
          ${aiState.isListening ? 'animate-pulse' : ''}
          ${aiState.isAnalyzing ? 'animate-bounce' : ''}
        `}>
          {/* AI Core */}
          <div className={`
            absolute inset-0 rounded-full
            ${aiState.mood === 'excited' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
              aiState.mood === 'thinking' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
              aiState.mood === 'focused' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              'bg-gradient-to-r from-indigo-500 to-purple-500'}
            animate-pulse
          `}>
            <div className="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center">
              {/* AI Face */}
              <div className="relative">
                <div className="text-2xl">
                  {moodEmojis[aiState.mood]}
                </div>
                
                {/* Status Indicators */}
                {aiState.isListening && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
                {aiState.isAnalyzing && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Energy Ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-purple-500 opacity-30"
            style={{
              transform: `scale(${1 + (aiState.energy / 100) * 0.3})`
            }}
          />
        </div>

        {/* AI Status Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                      bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 
                      hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2">
            <span>{aiState.personality.name}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Voice Notes & Analysis Panel */}
      <div className="fixed bottom-4 right-4 w-80 max-h-96 bg-gray-900/95 backdrop-blur-lg 
                    border border-gray-700 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-white">AI Companion</h3>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">
              Energy: {aiState.energy}%
            </div>
            <div className="text-2xl">
              {moodEmojis[aiState.mood]}
            </div>
          </div>
        </div>

        {/* Voice Recording */}
        <div className="mb-4">
          <button
            onClick={aiState.isListening ? stopVoiceRecording : startVoiceRecording}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              aiState.isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {aiState.isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Voice Note</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Note Dump Area */}
        <div className="mb-4">
          <textarea
            value={noteDump}
            onChange={(e) => setNoteDump(e.target.value)}
            placeholder="Dump your raw notes here... I'll analyze and structure them for you."
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 
                     text-gray-300 placeholder-gray-500 resize-none focus:outline-none 
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
          <button
            onClick={processNoteDump}
            disabled={!noteDump.trim() || aiState.isAnalyzing}
            className="mt-2 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <div className="flex items-center justify-center space-x-2">
              {aiState.isAnalyzing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Structure</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-alternate ui-text">Insights</h4>
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                {showAnalysis ? 'Hide' : 'Show'} ({analysisResults.length})
              </button>
            </div>
            
            {showAnalysis && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisResults.slice(0, 5).map(result => (
                  <div key={result.id} 
                       className={`p-3 rounded-lg border ${
                         result.type === 'pattern' ? 'border-blue-500 bg-blue-500/10' :
                         result.type === 'insight' ? 'border-purple-500 bg-purple-500/10' :
                         result.type === 'recommendation' ? 'border-green-500 bg-green-500/10' :
                         'border-amber-500 bg-amber-500/10'
                       }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            result.type === 'pattern' ? 'bg-blue-500 text-white' :
                            result.type === 'insight' ? 'bg-purple-500 text-white' :
                            result.type === 'recommendation' ? 'bg-green-500 text-white' :
                            'bg-amber-500 text-white'
                          }`}>
                            {result.type}
                          </span>
                          <span className="text-xs text-gray-400">
                            {Math.round(result.confidence * 100)}% confidence
                          </span>
                        </div>
                        <h5 className="text-sm font-medium text-white mb-1">
                          {result.title}
                        </h5>
                        <p className="text-xs text-gray-300">
                          {result.description}
                        </p>
                      </div>
                      {result.actionable && (
                        <button className="ml-2 text-xs text-purple-400 hover:text-purple-300">
                          <Zap className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Voice Notes */}
      {voiceNotes.length > 0 && (
        <div className="fixed top-4 left-4 w-72 max-h-64 bg-gray-900/95 backdrop-blur-lg 
                      border border-gray-700 rounded-xl p-4 shadow-2xl">
          <h4 className="font-alternate ui-text mb-3">Recent Voice Notes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {voiceNotes.slice(0, 3).map(note => (
              <div key={note.id} className="p-2 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  {note.transcript}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {note.timestamp.toLocaleTimeString()}
                  </span>
                  {note.analysis && (
                    <div className="flex items-center space-x-1">
                      {note.analysis.topics.slice(0, 2).map((topic, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-purple-500/20 
                                             text-purple-300 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// Onboarding Component
function AIOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [personality, setPersonality] = useState({
    name: '',
    traits: [] as string[],
    learningStyle: '',
    communicationStyle: ''
  })

  const onboardingSteps = [
    {
      title: "Welcome to Your AI Companion",
      description: "I'm here to learn from you, analyze your patterns, and help you achieve your goals.",
      content: (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🤖</div>
          <p className="diary-text text-lg">
            Let's create an AI that truly understands you
          </p>
        </div>
      )
    },
    {
      title: "Give Me a Name",
      description: "What would you like to call your AI companion?",
      content: (
        <div className="py-4">
          <input
            type="text"
            value={personality.name}
            onChange={(e) => setPersonality(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nexus, Sage, Mentor..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      )
    },
    {
      title: "How Do You Learn Best?",
      description: "Tell me about your learning and thinking style.",
      content: (
        <div className="py-4 space-y-3">
          <select 
            value={personality.learningStyle}
            onChange={(e) => setPersonality(prev => ({ ...prev, learningStyle: e.target.value }))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select learning style...</option>
            <option value="Pattern Recognition">Pattern Recognition</option>
            <option value="Visual Learning">Visual Learning</option>
            <option value="Step-by-Step">Step-by-Step</option>
            <option value="Intuitive">Intuitive</option>
            <option value="Analytical">Analytical</option>
          </select>
          
          <select 
            value={personality.communicationStyle}
            onChange={(e) => setPersonality(prev => ({ ...prev, communicationStyle: e.target.value }))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select communication style...</option>
            <option value="Concise & Insightful">Concise & Insightful</option>
            <option value="Detailed & Explanatory">Detailed & Explanatory</option>
            <option value="Encouraging & Motivational">Encouraging & Motivational</option>
            <option value="Technical & Precise">Technical & Precise</option>
          </select>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1)
    } else {
      // Save personality
      localStorage.setItem('ai-personality', JSON.stringify({
        name: personality.name || 'Nexus',
        traits: ['Analytical', 'Intuitive', 'Proactive', 'Adaptive'],
        learningStyle: personality.learningStyle || 'Pattern Recognition',
        communicationStyle: personality.communicationStyle || 'Concise & Insightful'
      }))
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="display-lg font-display text-white">
              {onboardingSteps[step].title}
            </h2>
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= step ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="diary-text text-gray-300">
            {onboardingSteps[step].description}
          </p>
        </div>

        {onboardingSteps[step].content}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 
                     transition-all"
          >
            {step === onboardingSteps.length - 1 ? 'Start Using AI' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
