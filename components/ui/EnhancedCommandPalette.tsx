'use client'

import { useState, useEffect, useRef } from 'react'
import { Command, Search, Terminal, Zap, FileText, MessageSquare, Settings, Brain, TrendingUp, Activity, Compass, Archive, Link, Mic, Upload, Camera, Save, Inbox, Tag, Filter, ChevronRight, Layout, Clock, Play, Flame, Flower2, Send, Plus, Code } from 'lucide-react'
import { providerRouter } from '@/lib/ai-router'

interface AICommand {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
  isAI?: boolean
  shortcut?: string
}

export default function EnhancedCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // AI Chat Hook for streaming responses
  // const { messages, handleSubmit, isLoading } = useChat({
  //   api: '/api/ai/chat',
  //   onFinish: (message: any) => {
  //     setIsProcessing(false)
  //     setAiResponse('')
  //   }
  // })

  const aiCommands: AICommand[] = [
    {
      id: 'think',
      name: '/think [query]',
      description: 'Claude reasoning stream',
      icon: <Brain className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘T',
      action: () => handleAICommand('think', 'Claude reasoning analysis')
    },
    {
      id: 'code',
      name: '/code [request]',
      description: 'DeepSeek code generation',
      icon: <Code className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘C',
      action: () => handleAICommand('code', 'DeepSeek code generation')
    },
    {
      id: 'recall',
      name: '/recall [topic]',
      description: 'Semantic memory search',
      icon: <Search className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘R',
      action: () => handleAICommand('recall', 'Memory search and retrieval')
    },
    {
      id: 'brief',
      name: '/brief',
      description: 'Generate morning briefing',
      icon: <FileText className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘B',
      action: () => handleAICommand('brief', 'Generate comprehensive system briefing')
    },
    {
      id: 'phase',
      name: '/phase',
      description: 'Show current phase analysis',
      icon: <TrendingUp className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘P',
      action: () => handleAICommand('phase', 'Analyze current system phase')
    },
    {
      id: 'drift',
      name: '/drift',
      description: 'Run drift detection',
      icon: <Activity className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘D',
      action: () => handleAICommand('drift', 'Detect system drift patterns')
    },
    {
      id: 'compress',
      name: '/compress',
      description: 'Trigger memory compression',
      icon: <Archive className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘M',
      action: () => handleAICommand('compress', 'Compress and optimize memory storage')
    },
    {
      id: 'map',
      name: '/map',
      description: 'Open cognitive map',
      icon: <Compass className="w-4 h-4" />,
      shortcut: '⌘G',
      action: () => {
        window.location.href = '/cognitive-map'
        setIsOpen(false)
      }
    },
    {
      id: 'agent',
      name: '/agent [name] [msg]',
      description: 'Talk to specific agent',
      icon: <MessageSquare className="w-4 h-4" />,
      isAI: true,
      shortcut: '⌘A',
      action: () => handleAICommand('agent', 'Communicate with specific AI agent')
    }
  ]

  const navigationCommands: AICommand[] = [
    {
      id: 'new-note',
      name: 'New Note',
      description: 'Create a new note',
      icon: <Plus className="w-4 h-4" />,
      shortcut: '⌘N',
      action: () => {
        window.location.href = '/notes?new=true'
        setIsOpen(false)
      }
    },
    {
      id: 'open-chat',
      name: 'Open Chat',
      description: 'Open AI chat interface',
      icon: <MessageSquare className="w-4 h-4" />,
      shortcut: '⌘I',
      action: () => {
        window.location.href = '/chat'
        setIsOpen(false)
      }
    },
    {
      id: 'system-status',
      name: 'System Status',
      description: 'Check system health and AI status',
      icon: <Activity className="w-4 h-4" />,
      shortcut: '⌘S',
      action: () => {
        window.location.href = '/settings?tab=system'
        setIsOpen(false)
      }
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Open application settings',
      icon: <Settings className="w-4 h-4" />,
      shortcut: '⌘,',
      action: () => {
        window.location.href = '/settings'
        setIsOpen(false)
      }
    },
    {
      id: 'terminal',
      name: 'Terminal',
      description: 'Open developer terminal',
      icon: <Terminal className="w-4 h-4" />,
      shortcut: '⌘`',
      action: () => {
        window.location.href = '/terminal'
        setIsOpen(false)
      }
    }
  ]

  const allCommands = [...aiCommands, ...navigationCommands]

  const filteredCommands = allCommands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords?.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAICommand = async (commandType: string, description: string) => {
    setIsProcessing(true)
    setAiResponse(`🤖 Processing ${commandType} command: ${description}...`)
    
    try {
      // Simulate AI command processing
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            content: `✅ ${commandType} command executed successfully.\n\nResponse: This is a simulated response for the ${description} feature.\n\nIn production, this would connect to the actual AI provider and return real results.`
          })
        }, 1500)
      })
      
      // Stream the response
      setAiResponse((response as any).content || 'Command processed successfully')
      
    } catch (error: any) {
      console.error('AI Command error:', error)
      setAiResponse(`❌ Error processing ${commandType}: ${error.message}`)
    }
  }

  const executeCommand = (command: AICommand) => {
    if (command.isAI) {
      handleAICommand(command.id, command.description)
    } else {
      command.action()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }

      // Navigation within palette
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          filteredCommands[selectedIndex]?.action()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, search, selectedIndex, filteredCommands])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setSelectedIndex(0)
      setSearch('')
      setAiResponse('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-4xl mx-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* AI Response Area */}
          {isProcessing && (
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-400 animate-pulse mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Command List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Terminal className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No commands found</p>
                <p className="text-xs mt-2">Try searching for a different term</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                      index === selectedIndex 
                        ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-500' 
                        : 'hover:bg-gray-800 text-gray-300 border-r-2 border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {command.isAI ? (
                        <div className="p-1 bg-blue-500/20 rounded">
                          {command.icon}
                        </div>
                      ) : (
                        command.icon
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{command.name}</div>
                      <div className="text-sm text-gray-500">{command.description}</div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {command.shortcut && (
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">
                          {command.shortcut}
                        </span>
                      )}
                      {index === selectedIndex && (
                        <Zap className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Execute</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded">⌘K</kbd>
                <span>to open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
