'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Brain, Mic, MicOff, Send, MessageCircle, Power, Zap, Eye, EyeOff, Settings, Volume2, Sparkles, User, Bot } from 'lucide-react'

interface AIMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  isSpeaking?: boolean
}

interface AIIdentity {
  name: string
  personality: string
  voiceStyle: 'professional' | 'friendly' | 'mentor' | 'creative' | 'technical'
  avatar: string
  color: string
  wakeWord: string
  capabilities: string[]
}

interface ConversationContext {
  topic: string
  context: string[]
  emotions: string[]
  goals: string[]
  patterns: string[]
}

export default function ConversationalAI() {
  const [isAwake, setIsAwake] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topic: '',
    context: [],
    emotions: [],
    goals: [],
    patterns: []
  })
  const [aiIdentity, setAIIdentity] = useState<AIIdentity>({
    name: 'Nexus',
    personality: 'Analytical & Intuitive',
    voiceStyle: 'mentor',
    avatar: '🧠',
    color: '#8B5CF6',
    wakeWord: 'hey nexus',
    capabilities: ['Pattern Recognition', 'Strategic Analysis', 'Creative Problem Solving', 'Learning & Adaptation']
  })
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Wake word detection
  useEffect(() => {
    const handleWakeWord = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      if (transcript.includes(aiIdentity.wakeWord.toLowerCase())) {
        wakeAI()
      }
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = handleWakeWord
      recognition.onerror = () => console.log('Speech recognition error')
      recognition.start()
    }
  }, [aiIdentity.wakeWord])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const wakeAI = useCallback(() => {
    setIsAwake(true)
    addMessage('ai', `Hello! I'm ${aiIdentity.name}. How can I help you today?`)
    setConversationContext(prev => ({
      ...prev,
      topic: 'General conversation',
      emotions: ['alert', 'ready'],
      goals: ['assist user', 'provide insights']
    }))
  }, [aiIdentity.name])

  const sleepAI = useCallback(() => {
    setIsAwake(false)
    setIsListening(false)
    addMessage('ai', `Goodbye! ${aiIdentity.name} going to sleep mode. Say "${aiIdentity.wakeWord}" to wake me.`)
  }, [aiIdentity.name, aiIdentity.wakeWord])

  const toggleListening = async () => {
    if (!isListening) {
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
          const transcription = await transcribeAudio(audioBlob)
          
          if (transcription.trim()) {
            setVoiceTranscript(transcription)
            processUserInput(transcription)
          }
        }

        recorder.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    } else {
      stopListening()
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsListening(false)
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Simulate transcription (in real app, send to speech-to-text API)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(voiceTranscript || "I'm working on optimizing my cognitive processes and need your guidance on the next strategic direction.")
      }, 1000)
    })
  }

  const processUserInput = async (input: string) => {
    if (!input.trim()) return

    setIsProcessing(true)
    addMessage('user', input)
    
    // Update conversation context
    setConversationContext(prev => {
      const newContext = [...prev.context, input].slice(-10)
      const emotions = analyzeEmotions(input)
      const patterns = extractPatterns(input)
      
      return {
        ...prev,
        context: newContext,
        emotions: [...prev.emotions, ...emotions].slice(-5),
        patterns: [...prev.patterns, ...patterns].slice(-5)
      }
    })

    // Generate AI response
    const response = await generateAIResponse(input, conversationContext)
    addMessage('ai', response)
    
    setIsProcessing(false)
    setVoiceTranscript('')
  }

  const analyzeEmotions = (text: string): string[] => {
    const emotions = []
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('confused') || lowerText.includes('help')) emotions.push('confusion')
    if (lowerText.includes('excited') || lowerText.includes('great')) emotions.push('excitement')
    if (lowerText.includes('frustrated') || lowerText.includes('stuck')) emotions.push('frustration')
    if (lowerText.includes('happy') || lowerText.includes('good')) emotions.push('satisfaction')
    
    return emotions
  }

  const extractPatterns = (text: string): string[] => {
    const patterns = []
    
    // Problem-solving patterns
    if (text.includes('how to') || text.includes('help me')) patterns.push('seeking guidance')
    if (text.includes('think') || text.includes('analyze')) patterns.push('analytical thinking')
    if (text.includes('create') || text.includes('build')) patterns.push('creative generation')
    if (text.includes('organize') || text.includes('structure')) patterns.push('systems thinking')
    
    return patterns
  }

  const generateAIResponse = async (input: string, context: ConversationContext): Promise<string> => {
    // Simulate AI processing based on personality and context
    const responses = {
      professional: [
        "Based on your input, I recommend a systematic approach to break down this challenge.",
        "Let me analyze this from multiple angles to provide comprehensive insights.",
        "I've processed your request. Here's my structured analysis:"
      ],
      friendly: [
        "I totally get what you're saying! Let's work through this together.",
        "That's interesting! Tell me more about what you're thinking.",
        "I'm here to help you figure this out step by step!"
      ],
      mentor: [
        "Let me guide you through this. First, let's understand the core issue.",
        "This reminds me of similar patterns I've observed. Here's what I've learned:",
        "Based on our conversation history, I suggest we focus on:"
      ],
      creative: [
        "What if we approach this from a completely different angle?",
        "I'm sensing some creative possibilities here. Let me brainstorm with you:",
        "This sparks some interesting connections! Here's what I'm thinking:"
      ],
      technical: [
        "Analyzing the technical parameters of your request...",
        "From a systems perspective, here are the key variables:",
        "Let me break this down into actionable components:"
      ]
    }

    const styleResponses = responses[aiIdentity.voiceStyle] || responses.mentor
    
    // Context-aware response selection
    let response = styleResponses[Math.floor(Math.random() * styleResponses.length)]
    
    // Add context awareness
    if (context.patterns.includes('seeking guidance')) {
      response = "I'm here to provide guidance. Based on our previous conversations, I notice you often seek clarity on complex topics. Let me help you structure your thinking."
    }
    
    if (context.patterns.includes('creative generation')) {
      response = "I love creative sessions! Your mind seems to be making novel connections. Let me help you capture and develop these ideas."
    }

    return response
  }

  const addMessage = (role: 'user' | 'ai', content: string) => {
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      isSpeaking: role === 'ai'
    }
    
    setMessages(prev => [...prev, newMessage])
    setTimeout(scrollToBottom, 100)
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      processUserInput(inputText)
      setInputText('')
    }
  }

  const updateAIIdentity = (field: keyof AIIdentity, value: string) => {
    setAIIdentity(prev => ({ ...prev, [field]: value }))
    localStorage.setItem('ai-identity', JSON.stringify({ ...aiIdentity, [field]: value }))
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // Load saved identity
  useEffect(() => {
    const saved = localStorage.getItem('ai-identity')
    if (saved) {
      setAIIdentity(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[600px] bg-gray-900/95 backdrop-blur-lg 
                  border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col">
      
      {/* AI Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* AI Avatar */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl 
                         transition-all duration-300 ${
                           isAwake ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-900' : ''
                         }`}
                 style={{ backgroundColor: aiIdentity.color }}>
              {isAwake ? aiIdentity.avatar : '😴'}
            </div>
            
            <div>
              <div className="font-display text-lg text-white">{aiIdentity.name}</div>
              <div className="text-xs text-gray-400">{aiIdentity.personality}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Power Button */}
            <button
              onClick={isAwake ? sleepAI : wakeAI}
              className={`p-2 rounded-lg transition-all ${
                isAwake 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' 
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
              }`}
            >
              {isAwake ? <Power className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </button>
            
            {/* Settings */}
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isAwake ? 'bg-green-500' : 'bg-gray-500'
            }`} />
            <span className={isAwake ? 'text-green-400' : 'text-gray-500'}>
              {isAwake ? 'Awake' : 'Sleeping'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
            }`} />
            <span className={isListening ? 'text-red-400' : 'text-gray-500'}>
              {isListening ? 'Listening' : 'Ready'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isProcessing ? 'bg-blue-500 animate-spin' : 'bg-gray-500'
            }`} />
            <span className={isProcessing ? 'text-blue-400' : 'text-gray-500'}>
              {isProcessing ? 'Processing' : 'Idle'}
            </span>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {isCustomizing && (
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <h4 className="font-alternate ui-text mb-3">Customize AI Identity</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Name</label>
              <input
                type="text"
                value={aiIdentity.name}
                onChange={(e) => updateAIIdentity('name', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                placeholder="Give your AI a name..."
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Voice Style</label>
              <select
                value={aiIdentity.voiceStyle}
                onChange={(e) => updateAIIdentity('voiceStyle', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="mentor">Mentor</option>
                <option value="creative">Creative</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {['🧠', '🤖', '🧬', '🎯', '⚡', '🔮', '💭', '🌟'].map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => updateAIIdentity('avatar', avatar)}
                    className={`p-2 rounded text-lg transition-all ${
                      aiIdentity.avatar === avatar ? 'ring-2 ring-purple-500' : 'hover:bg-gray-700'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Wake Word</label>
              <input
                type="text"
                value={aiIdentity.wakeWord}
                onChange={(e) => updateAIIdentity('wakeWord', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                placeholder="Hey AI..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Conversation Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={messagesEndRef}>
        {messages.map(message => (
          <div key={message.id} 
               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-purple-500/20 border border-purple-500/50' 
                : 'bg-gray-800 border border-gray-700'
            }`}>
              <div className="flex items-start space-x-2">
                {message.role === 'ai' && (
                  <div className="text-lg" style={{ color: aiIdentity.color }}>
                    {aiIdentity.avatar}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{message.content}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {/* Speaking Indicator */}
              {message.isSpeaking && (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <Volume2 className="w-3 h-3 text-blue-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Voice Controls */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleListening}
              disabled={!isAwake}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !isAwake 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Recording' : 'Voice Input'}</span>
              </div>
            </button>
            
            {voiceTranscript && (
              <div className="text-xs text-gray-400 italic">
                "{voiceTranscript}"
              </div>
            )}
          </div>
        </div>

        {/* Text Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isAwake ? "Type your message..." : "Wake me up first!"}
            disabled={!isAwake}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 
                     disabled:bg-gray-900 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isAwake || !inputText.trim()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg 
                     font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
